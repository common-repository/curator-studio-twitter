const EntityInputMixin = {
	methods: {
		passThroughMasks(value){
			if( this.masks ){
				if( this.masks[0] === 'profile' ){
					const matches = value.match(/http(?:s)?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/);
					if( matches && matches[1] ){
						return matches[1];
					}
				} else if( this.masks[0] === 'list' ){
					if( value.includes('/lists/') ){
						const match = value.split('/lists/');
						if( match.length > 1 ) return match[1].trim();
					}
				}
			}
			return value;
		}
	}
};

export {EntityInputMixin};
