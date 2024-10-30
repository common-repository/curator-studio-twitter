import {ViewerMixin as BaseViewerMixin, ViewerItemMixin} from '../../../../display/viewers/mixins.js';
import {VideoPlayer as VideoPlayerMixin, YouTubePlayer, NativePlayer} from '../../../../display/viewers/players.js';
import {Links} from '../utils';

import ViewerMixinPro from '../../../../pro/display/viewers/mixins';

const ViewerMixin = {
	mixins: [BaseViewerMixin, ViewerMixinPro]
};

const VideoPlayer = {
	mixins: [VideoPlayerMixin],
	
	computed: {
		vid(){
			return {
				...this.it.extra.att.video,
				url: this.it.extra.att.video.variants[0].url,
				poster: this.it.media[0].url
			};
		}
	},
		
	methods: {
		getPlayerType(){
			const {type, source} = this.vid;
			if( type === 'embed' ){
				if( source === 'youtube' ) return YouTubePlayer;
				else if( source === 'vimeo' ) return VimeoPlayer;
			}
			return NativePlayer;
		}
	}
};

export {ViewerMixin, ViewerItemMixin, VideoPlayer};
