<?php
namespace cstwitter\platform;
use cstwitter\utils\Utils;
use cstwitter\db\DB;

class Platform{
	static $slug = 'twitter';
	static $label = 'Twitter';
	static $name = 'Curator Studio - Twitter';
	
	static function init(){
		Utils::$platform = self::$slug;
		
		Utils::add_filter('delete_older_items_on_upsert', function($arg, $path){
			if( in_array($path['edge'], ['search', 'search-accounts', 'place-trends']) ) return 100;
			return $arg;
		}, 1, 2);
		
		add_action('admin_init', function(){
			self::setCreds();
		});
	}
	
	static function setCreds($api=false){
		$params = Utils::q('cs-tw-token') ? json_decode(wp_unslash(Utils::q('cs-tw-token')), true) : null;
		
		if(!$params) return null;
		if( isset($params['oauth_token']) && isset($params['oauth_token_secret']) ){
			$settings = DB::getSettings();
			
			$settings['creds'][self::$slug] = array_merge(
				$settings['creds'][self::$slug],
				[
					'oauth_access_token' => $params['oauth_token'],
					'oauth_access_token_secret' => $params['oauth_token_secret']
				]
			);
																
			DB:update_option(DB::$keys['settings'], $settings);
			
			if( $api ){
				return $settings;
			} else {
				if( Utils::$DEV ){
					wp_redirect( Utils::$devhost );
				} else {
					wp_redirect( self::returnURL() );
				}
			}
			exit;
		}
	}
	
	static function sourceNames(){
		return ['twitter'];
	}

	static function sourceClasses(){
		return [
			'twitter' => new \cstwitter\platform\Twitter()
		];
	}
	
	static function credsData(){
		return array_reduce(self::sourceNames(), function($acc, $cur){
			$acc[$cur] = [
				'oauth_access_token' => '',
				'oauth_access_token_secret' => '',
				'consumer_key' => 'KI0NqsHIeXxaLyJAQ95JiInTk',
				'consumer_secret' => 'gIUeU73tqx279DpXeS1RirPBUnQ9zpXpkb3Lbq5nBIHLzjjT57'
			];
			return $acc;
		}, []);
	}
	
	static function returnURL(){
		return  menu_page_url("curator-studio-".self::$slug, false);
	}
	
	static function editorVars(){
		$auth_api = 'https://auth.curatorstudio.io/twitter/';
		$return_url = urlencode(self::returnURL());
		
		return [
			'source' => [
				'limit' => [
					'any' => 50,
					'search-accounts' => 20
				]
			],
			'pagination' => [
				'items' => 12,
				'comments' => 10
			],
			'auth_api' => [
				'url' => "$auth_api?return=$return_url"
			]
		];
	}
}
