import BaseSimpleViewer from '../../../../display/viewers/SimpleViewer.vue';
import BaseItem from '../../../../display/viewers/Item.vue';
import BaseThumbGrid from '../../../../display/viewers/ThumbGrid.vue';

import {ItemMixin, LongItemMixin} from '../items/mixins';
import {Comments, ViewerMixin, ViewerItemMixin} from './mixins';

const Item = {
	mixins: [BaseItem, ItemMixin, LongItemMixin, ViewerMixin, ViewerItemMixin]
};

const ThumbGrid = {
	mixins: [BaseThumbGrid],
	
	components: {
		Item
	}
};

const SimpleViewer = {
	mixins: [BaseSimpleViewer, ViewerMixin],
	
	components: {
		ThumbGrid,
		Item
	}
};

export default {SimpleViewer};
