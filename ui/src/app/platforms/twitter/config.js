const return_url = 'http://localhost/wordpress/wp-admin/admin.php?page=curator-studio-twitter';

export default {
	platform: 'twitter',
	class_prefix: 'dm',
	versions: {
		dom: '0.1'
	},
	apps: {
		streams: true
	},
	source: {
		limit: {
			any: 6
		}
	},
	pagination: {
		items: 6,
		comments: 10
	},
	auth_api: {
		url: `https://auth.curatorstudio.io/twitter/?return=${return_url}`
	},
	...(window.cs_editor_vars||{})
};
