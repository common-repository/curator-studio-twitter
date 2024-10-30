<?php
namespace cstwitter\platform;

if( !defined( 'ABSPATH' ) )
	die('They dead me.');

use cstwitter\utils\URL;
use cstwitter\utils\Utils;
use cstwitter\platform\BaseSource;
use cstwitter\platform\TwitterAPIExchange;
	
class Twitter extends BaseSource{
	function __construct(){
		parent::__construct();
	}
			
	function init($creds){
		$this->limit = 50;
		$this->Creds = $creds;
		return $this;
	}
	
	function query($url, $fields){
		$config = $this->Creds;
		
		if( !$config['oauth_access_token'] || !$config['oauth_access_token_secret'] ){
			return Utils::create_error('Twitter API not connected', 401);
		}
		
		$cache_key = $url.$fields.json_encode($config);
		if( $this->enable_cache ){
			$cache = get_transient(md5($cache_key));
			if( $cache ) return $cache;
		}
				
		$twitter = new TwitterAPIExchange($config);
		
		try {
			$body = $twitter->setGetfield($fields)
				->buildOauth($url, 'GET')
				->performRequest();
		} catch(\Exception $e){
			return Utils::create_error($e->getMessage());
		}
							
		if( $this->enable_cache ){
			set_transient(md5($cache_key), $body, 150*60);
		}
		return $body;
	}
			
	function request( $url, $fields ){
		$url = "https://api.twitter.com/1.1/$url";
		//wp_send_json([$url, $fields]);
		
		$re = $this->query($url, $fields);
		if(gettype($re) === 'object') return $re;
		
		//wp_send_json( json_decode($re) );
		return json_decode( $re );
	}
	
	function makeURL($ppath, $path=null){
		return Utils::apply_filters('make_url', $ppath, $path);
	}
	
	function getProfile($path){
		return $this->request( 
			'users/show.json',
			$this->makeURL("?screen_name={$path['entity']}", $path)
		);
	}
						
	function getTimeline($path, $state){
		$max_id = $state['pagination']['after'] ? "&max_id={$state['pagination']['after']}" : '';
		$replies = !Utils::get($path, 'include_replies', false);
		$retweets = Utils::get($path, 'include_rts', true);
		
		return $this->request( 
			'statuses/user_timeline.json',
			$this->makeURL("?screen_name={$path['entity']}&tweet_mode=extended&count={$this->limit}&exclude_replies=$replies&include_rts=$retweets$max_id", $path)
		);
	}
	
	function getMentions($path, $state){
		$max_id = $state['pagination']['after'] ? "&max_id={$state['pagination']['after']}" : '';
		return $this->request( 
			'statuses/mentions_timeline.json',
			$this->makeURL("?screen_name={$path['entity']}&tweet_mode=extended&count={$this->limit}$max_id", $path)
		);
	}
				
	function defaultState(){
		return [
			'pagination' => [
				'after' => ''
			]
		];
	}
	
	
	function checkCreds($state, $entity=null){
		$hash = hash('sha256', json_encode($this->Creds));
		$this->validateCreds($state, $hash, [88, 89, 99], 3600);
	}
	
	function isError($re){
		if( gettype($re) === 'object' ){
			if( Utils::geto($re, 'error') ) return $re;
			if( Utils::geto($re, 'errors') ){
				return (object)['error' => $re->errors[0]];
			}
		}
		return false;
	}
				
	function getItems($path, $state=null, $anystate=null){
		$this->checkCreds($anystate, $path['entity']);
		if( $this->nonCredible ) return $this->nonCredible;
		
		if( !$state ) $state = $this->defaultState();
		
		$this->limit = Utils::get($path, 'limit', $this->limit);
				
		if( $path['edge'] === 'timeline' ){
			$re = $this->getTimeline($path, $state);
			if( $this->isError($re) ) return $this->isError($re);
			$re = $this->normalizeItems( $re );
		
		} else if( $path['edge'] === 'mentions' ){
			$re = $this->getMentions($path, $state);
			if( $this->isError($re) ) return $this->isError($re);
			$re = $this->normalizeItems( $re );
		
		} else if( $this->nonLiveEdge($path) ){
			
			return Utils::nonEditorError();
		
		} else {
			return Utils::apply_filters('get_remote_items', Utils::create_error('Unknown path', 400),
				$path, $state, $this
			);
		}
		
		return (object)['data' => Utils::apply_filters('normalized_source', $re, $path)];
	}
		
	function extractMedia($r){
		if( !Utils::geto($r, 'extended_entities') )
			return [];
		
		$it = ['type' => 'photo'];
		$extra = [];
		$ent = Utils::geto($r, 'extended_entities');
		
		$images = array_map(function($e){
			$images = (array)$e->sizes;
			
			$images = array_map(function($i, $k) use($e){
				return [
					'external_id' => $e->id_str,
					'width' => $i->w,
					'height' => $i->h,
					'url' => "{$e->media_url_https}:$k",
					'resize' => $i->resize
				];
			}, array_values($images), array_keys($images));
			
			array_multisort(array_column($images, 'width'), SORT_DESC, $images);
			return [
				'external_id' => $e->id_str,
				'media' => $images
			];
			
		}, $ent->media);
		
		$it['media'] = $images[0]['media'];
		if( count($images) > 1 ){
			$it['type'] = 'album';
			$extra['att'] = [
				'sub_atts' => $images,
				'inline_album' => true
			];
		}
		
		if( Utils::geto($ent->media[0], 'video_info') ){
			$vid = $ent->media[0]->video_info;
			if( !isset( $extra['att'] ) ) $extra['att'] = [
				'url' => $ent->media[0]->expanded_url
			];
			
			$variants = array_map(function($e){
				$u = explode('/vid/', $e->url);
				if( count($u) === 1 ) return array_merge((array)$e, ['width' => 0, 'height' => 0]);
				$u = explode('x', explode('/', $u[1])[0]);
				return array_merge((array)$e, ['width' => (int)$u[0], 'height' => (int)$u[1]]);
			}, $vid->variants);
			array_multisort(array_column($variants, 'width'), SORT_DESC, $variants);
			
			$extra['att']['video'] = [
				'type' => 'source',
				'aspect_ratio' => $vid->aspect_ratio,
				'variants' => $variants
			];
			
			$it['duration'] = Utils::geto($vid, 'duration_millis') ? $vid->duration_millis / 1000 : null;
			$it['type'] = $ent->media[0]->type === 'animated_gif' ? 'gif' : $ent->media[0]->type;
		}
		
		$it['extra'] = $extra;
		return $it;
	}

	function normalizeItem($t){
		$r = $t;
		
		if( Utils::geto($t, 'retweeted_status') ){
			$r = $t->retweeted_status;
		}
				
		$it = [
			'created_time' => gmdate('Y-m-d H:i:s', strtotime($t->created_at)),
			'external_id' => $r->id_str,
			'text' => $r->full_text,
			'likes' => $r->favorite_count,
			'shares' => $r->retweet_count,
			'author' => $this->extractAuthor($r),
			'type' => 'text',
			'media' => null,
			'duration' => null,
			'extra' => [
				'in_reply_to' => $r->in_reply_to_status_id_str,
				'lang' => $r->lang,
				'entities' => [
					'hashtags' => $r->entities->hashtags,
					'users' => $r->entities->user_mentions,
					'urls' => $r->entities->urls
				]
			]
		];
		
		if( Utils::geto($t, 'retweeted_status') ){
			$it['extra']['is_shared'] = array_merge(
				$this->extractAuthor($t),
				['shared_item_created_time' => gmdate('Y-m-d H:i:s', strtotime($r->created_at))]
			);
		}
		
		if( $r->is_quote_status && Utils::geto($r, 'quoted_status') ){
			$it['extra']['shared_item'] = $this->normalizeItem( $r->quoted_status );
		}
		
		return Utils::mergeItem($it, $this->extractMedia($r));
	}
	
	function normalizeItems( $re ){
		return [
			'source' => $this->prepareSource($re),
			'items' => array_map(function($e){
				return $this->normalizeItem($e);
			}, gettype($re) === 'object' ? $re->statuses : $re)
		];
	}
	
	function extractAuthor($it){
		$it = $it->user;
		return [
			'name' => $it->name,
			'external_id' => $it->id_str,
			'username' => $it->screen_name,
			'followers' => $it->followers_count,
			'picture' => $it->profile_image_url_https,
			'verified' => $it->verified
		];
	}
		
	function prepareSource($re, $extra=null){
		if( gettype($re) === 'object' && Utils::geto($re, 'search_metadata') ){
			$next = Utils::geto($re->search_metadata, 'next_results');
			$max_id = $next ? explode('&', explode('max_id=', $next)[1])[0] : null;
		} else {
			$max_id = empty($re) ? null : $re[ count($re)-1 ]->id_str;
		}
		
		return [
			'name' => '',
			'state' => [
				'pagination' => $max_id ? [
					'after' => $max_id
				] : null
			],
			'extra' => $extra
		];
	}
		
	function getMeta($path, $state=null, $anystate=null){
		$this->checkCreds($anystate, $path['entity']);
		if( $this->nonCredible ) return $this->nonCredible;
		
		if( $path['edge'] === 'profile' ){
			$re = $this->getProfile($path);
			if( $this->isError($re) ) return $this->isError($re);
			
			return (object)['data' => [
				'external_id' => $re->id_str,
				'text' => Utils::geto($re, 'description'),
				'name' => $re->name,
				'followers' => $re->followers_count,
				'following' => $re->friends_count,
				'username' => Utils::geto($re, 'screen_name'),
				'verified' => Utils::geto($re, 'verified'),
				'items' => Utils::geto($re, 'statuses_count'),
				'location' => Utils::geto($re, 'location'),
				'url' => Utils::geto($re, 'url'),
				'created_time' => gmdate('Y-m-d H:i:s', strtotime($re->created_at)),
				'cover' => Utils::geto($re, 'profile_banner_url') ? [['url' => $re->profile_banner_url]] : null,
				'pictures' => [['url' => str_replace('_normal', '', $re->profile_image_url_https)]]
			]];
		} else if( $this->nonLiveEdge($path) ){
			return Utils::nonEditorError();
		} else {
			return Utils::create_error('Unknown path', 400);
		}		
	}
}
