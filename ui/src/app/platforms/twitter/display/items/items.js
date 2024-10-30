import {ItemMixin, LongItemMixin} from './mixins';
import {RendererMixin, RenderHelpers} from '../../../../elements';
import TweetItemMixin from './Tweet.vue';

import ProItems from './items.pro';

const TestItem = {
	mixins: [ItemMixin],
	template: `
		<div>
			<div class="box" @click="onItemChoose" :class="{'ba-1': isSelected}">{{ it.text }}</div>
		</div>
	`
};

const StandardItem = {
	mixins: [ItemMixin, RendererMixin]
};

const LongItem = {
	mixins: [ItemMixin, RendererMixin, LongItemMixin]
};

const TweetItem = {
	mixins: [ItemMixin, RendererMixin, TweetItemMixin]
};

export default {StandardItem, LongItem, TweetItem, ...ProItems};
