<template functional>
	<div class="card--highlight card--br card--elevation" :class="[data.class, data.staticClass]">
		<p class="d-flex ai-center mb-sm">
			<a target="_blank" :href="props.profileLink(props.it.author)" class="tw-semibold d-flex ai-center mr-sm lh-12">
				<img :src="props.it.author.picture" style="max-width:1.5em" class="mr-sm"/>
				{{ props.it.author.name }}
			</a>
			<a target="_blank" :href="props.itemLink(props.it)" class="color-hue small-text">{{ props.atTimeShort(props.it.created_time) }}</a>
		</p>
		<p v-html="props.it.text"></p>
	</div>
</template>
