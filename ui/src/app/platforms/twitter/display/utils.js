const Links = {
	profile({username}){
		return `https://www.twitter.com/${username}`;
	},
		
	item({external_id, author}, it){
		if( !external_id && it.author )
			return `https://www.twitter.com/${it.author.username}/status/${it.external_id}`;
		if( author ) return `https://www.twitter.com/${author.username}/status/${external_id}`;
		return '#';
	},
	
	list({external_id}){
		return `https://www.twitter.com/i/lists/${external_id}`;
	},
	
	writeComment(arg){
		return this.reply(arg);
	},
	
	subscribe({username}){
		return `https://www.twitter.com/${username}`;
	},
	
	reply({external_id, author:{username}}){
		return `https://twitter.com/intent/tweet?in_reply_to=${external_id}&related=${username}`;
	},
	
	retweet({external_id, author:{username}}){
		return `https://twitter.com/intent/retweet?tweet_id=${external_id}&related=${username}`;
	},
	
	like({external_id, author:{username}}){
		return `https://twitter.com/intent/like?tweet_id=${external_id}&related=${username}`;
	}
};

export {Links};
