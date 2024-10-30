<template>
	<div class="card pa-normal pb-none" style="padding-left:4.5em">
		<p v-if="it.extra.is_shared" class="small-text color-hue mb-xs" style="margin-left: -1.5em">
			<fa icon="retweet" style="margin-right:.5em"></fa>{{ it.extra.is_shared.name }} {{ i18n.shared }}
		</p>
		<div>
			<div v-if="it.author.picture" class="media__head pr-sm" style="margin-left:-3.5em;float:left">
				<a :href="profileLink(it.author)" target="_blank">
					<figure class="size-sm round clipped">
						<img :src="it.author.picture"/>
					</figure>
				</a>
			</div>
			<div class="media__body pr-sm d-flex ai-center lh-125">
				<div class="mr-sm d-flex">
					<a class="h6 mb-none d-inline tw-bold ws-nowrap" :href="profileLink(it.author)" target="_blank">{{ it.author.name }}</a>
					<span v-if="it.author.verified" class="ml-xs mr-sm">
						<fa icon="check-circle" :style="{color: verifiedTickColor}"></fa>
					</span>
				</div>
				<div class="subtitle small-text ws-nowrap">
					<a :href="itemLink(it)" target="_blank" class="color-hue"><time>{{ atTimeShort(it.created_time) }}</time></a>
				</div>
			</div>
		</div>
		<TextContent v-bind="allProps()" class="mb-normal"></TextContent>
		<Media v-bind="allProps()" class="mb-normal" v-if="it.media"></Media>
		<SharedItem v-if="it.extra.shared_item" v-bind="sharedItemProps()" class="pa-normal card--border bc-shadea2" :class="{'mb-normal': !cs_pro}"></SharedItem>
		<Stats v-if="cs_pro" v-bind="allProps()"></Stats>
	</div>
</template>

<script>
	export default {
		methods: {
			sharedItemProps(){
				return {
					...this.allProps(),
					it: this.it.extra.shared_item
				};
			}
		}
	};
</script>
