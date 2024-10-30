import {ItemMixin as BaseItemMixin, ItemRendererMixin, LongItemMixin} from '../../../../display/items/mixins';
import SharedItem from './SharedItem.vue';
import {Links} from '../utils';

import ProItemMixin from './mixins.pro.js';

const ItemMixin = {
	mixins: [BaseItemMixin, ProItemMixin],
	
	computed: {
		verifiedTickColor(){
			return 'rgb(14, 141, 219)';
		}
	},
	
	components: {
		SharedItem
	},
					
	methods: {
		profileLink: Links.profile,
		itemLink: Links.item,
		
		allProps(){
			return {
				...ItemRendererMixin.methods.allProps.call(this),
				replyLink: Links.reply,
				retweetLink: Links.retweet,
				likeLink: Links.like
			};
		}
	}
};

export {ItemMixin, ItemRendererMixin, LongItemMixin};
