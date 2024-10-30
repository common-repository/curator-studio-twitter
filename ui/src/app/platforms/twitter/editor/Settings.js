import Config from '../config';

const SettingsMixin = {
	methods: {
		extraSchema(schema){
			schema.root.children.unshift('root-0');
						
			const {oauth_access_token} = this.settings.creds.twitter;
			
			return {
				...schema,
				'root-0': {
					tag: 'div',
					children: [
						'root-0-0',
						'root-0-1'
					],
				},
				'root-0-0': {
					tag: 'div',
					classes: ['mb-sm', 'tw-bold', oauth_access_token ? 'color-success' : 'color-error'],
					text: oauth_access_token ? 'Connected' : 'Not Connected'
				},
				'root-0-1': {
					tag: 'a',
					classes: ['button', 'mb-normal', 'primary', 'small'],
					text: 'Connect Twitter API',
					attrs: {
						href: Config.auth_api.url
					}
				}
			};
		}
	}
};

const GroupInputMixin = {};

export {SettingsMixin, GroupInputMixin};
