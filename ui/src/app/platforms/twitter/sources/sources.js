import {expandPaths, createSource} from './utils';

const expandables = [
	{
		title: 'Profile',
		fields: {
			source: 'twitter',
			edge: 'profile',
			entity: ''
		},
		type: 'profile',
		select_key: 'id',
		children: [
			['Tweets', [createSource('timeline', {include_replies: true, include_rts: true})]]
		],
		schema: {
			masks: ['profile'],
			label: 'Enter username',
			entity: 'Username'
		}
	},
	{
		title: 'Tweets of a user',
		fields: createSource('timeline', {include_replies: true, include_rts: true}),
		type: 'item',
		select_key: 'external_id',
		schema: {
			fields: [['static', 'limit'], ['include_exclue_types']],
			masks: ['profile'],
			label: 'Enter username',
			entity: 'Username'
		}
	},
	{
		title: 'Mentions of you',
		fields: createSource('mentions'),
		type: 'item',
		select_key: 'external_id',
		schema: {
			fields: [['static', 'limit']],
			masks: ['profile'],
			label: 'Enter your username',
			entity: 'Username'
		}
	}
];

export default [
	...expandPaths(
		expandables,
		[
			['--shortcode', ' from shortcode attribute', 'Enter shortcode attribute name']
		]
	)
];

export const commentStream = [{source: 'twitter', edge: 'comments', entity: ''}];
