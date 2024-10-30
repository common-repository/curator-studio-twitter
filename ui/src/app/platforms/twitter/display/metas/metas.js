import {MetaMixin as BaseMetaMixin} from '../../../../display/metas/mixins';
import SimpleMeta from '../../../../display/metas/SimpleMeta.vue';
import {numFormat} from '../../../../display/utils';
import {Links} from '../utils';

const MetaMixin = {
	mixins: [BaseMetaMixin],
			
	computed: {
		profilePic(){
			const {pictures} = this.meta;
			return (pictures[1] || pictures[0]).url;
		},
		
		coverPic(){
			return this.meta.cover && this.meta.cover[0].url;
		},
		
		profileLink(){
			return Links.profile(this.meta);
		},
		
		stats(){
			return [
				[this.meta.followers, this.i18n.followers],
				[this.meta.following, this.i18n.following],
				[this.meta.items, this.i18n.tweets]
			].map(e => ([numFormat(e[0], this.numAbbrs), e[1]]));
		},
		
		subscribePropsY(){
			return {
				css: {
					background: '#FF0000',
					color: '#fff'
				},
				url: Links.subscribe(this.meta),
				stat: numFormat(this.meta.followers, this.numAbbrs),
				brand: 'youtube',
				name: 'YouTube'
			};
		},
		
		subscribeProps(){
			return {
				css: {
					background: '#1da1f2',
					color: '#fff'
				},
				url: Links.subscribe(this.meta),
				stat: numFormat(this.meta.followers, this.numAbbrs),
				brand: 'twitter',
				name: 'Twitter'
			};
		},
		
		subscribePropsF(){
			return {
				css: {
					background: '#4267B2',
					color: '#fff'
				},
				url: Links.subscribe(this.meta),
				stat: numFormat(this.meta.followers, this.numAbbrs),
				brand: 'facebook-f',
				name: 'Facebook'
			};
		}
	}
};

export default {
	SimpleMeta: {
		mixins: [MetaMixin, SimpleMeta]
	}
};
