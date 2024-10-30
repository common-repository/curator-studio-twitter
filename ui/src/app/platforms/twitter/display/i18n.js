const Terms = {
	meta: {
		followers: 'Followers',
		following: 'Following',
		tweets: 'Tweets'
	},
	list: {},
	pagination: {
		first: 'First',
		prev: 'Previous',
		next: 'Next',
		last: 'Last'
	},
	item: {
		likes: 'likes',
		comments: 'replies',
		replies: 'replies',
		shares: 'retweets',
		photos: 'photos',
		videos: 'videos',
		members: 'members',
		shared: 'Retweeted',
		write_a_comment: 'Write a reply...',
		less: 'Less',
		more: 'More'
	},
	numbers: {
		k: 'K',
		m: 'M',
		b: 'B'
	},
	time: {
		format: 'MMM DD, YYYY [at] HH:mm',
		short_format: 'MMM D, HH:mm'
	},
	extra: {
		loading: 'Loading...',
		close: 'Close'
	}
};

export default Terms;

const i18nMeta = {
	meta: {
		__label: 'Meta'
	},
	list: {
		__label: 'List'
	},
	pagination: {
		__label: 'Pagination'
	},
	item: {
		__label: 'Item'
	},
	numbers: {
		__label: 'Numbers'
	},
	time: {
		__label: 'Time',
		format: {
			label: 'Format',
			tip: {
				content: 'All <a href="https://day.js.org/docs/en/display/format" target="_blank">Day.js</a> formats are supported.'
			}
		},
		short_format: {
			label: 'Short Format',
			tip: {
				content: 'All <a href="https://day.js.org/docs/en/display/format" target="_blank">Day.js</a> formats are supported.'
			}
		}
	},
	extra: {
		__label: 'Extra'
	}
}; 

export {i18nMeta};
