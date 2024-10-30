import {cloneElements, normalizeStoredElements, mergeNormalizedElements} from '../../../editor/dom/utils';
import {normalizeElements} from '../../../elements';
import {dc} from '../../../../libs/bp';

import Schema from './editor';

import _Elements from '../../../editor/dom/index';
import Items from '../../../editor/dom/items';
import ItemComponents from '../../../editor/dom/item-components';
import Viewer from '../../../editor/dom/viewer';

const Elements = dc(_Elements);

const partials = {
	'simple-item': {
		children: [
			'li-author',
			'li-text',
			'li-media',
			'li-link-box',
			'li-shared-item'
		]
	},
	'long-item__content__elements': {
		children: [
			'li-author',
			'li-text',
			'li-shared-item'
		]
	}
};

Object.assign(Elements.elements, {
	...Items,
	...ItemComponents,
	...Viewer,
	'tweet-item': {
		tag: 'div', 
		classes: ['sub-col'], 
		name:'Tweet Item', 
		component: 'TweetItem', 
		type: 'Item'
	},
	'li-shared-item': {
		tag: 'div', 
		name: 'Quoted Tweet', 
		component: 'SharedItem', 
		classes:['bc-shadea2'], 
		eclasses: [
			['spacing', {
				pa: 'pa-normal', ma: 'ma-normal', mt: 'mt-none'
			}], 
			'borders'
		]
	}
});

const Elements2 = mergeNormalizedElements(
	normalizeStoredElements(dc(Elements), Schema),
	partials
);
const EditorSchema = normalizeElements(Schema, true);

const Views = [
	{name: 'Main', value: 'main', component: 'Explorer'}
];

export default Elements2;
export {cloneElements, EditorSchema, Views};
