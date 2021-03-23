<template>
	<div id="app">
		<!--<home />-->
		<!--<portal></portal>-->
		<router-view></router-view>
	</div>
</template>

<script>
	import portal from './components/portal.vue'
	// import home from './components/home/home.vue'

	export default {
		name: 'app',
		components: {
            portal
		}
	}
</script>

<style>
	html, body{
		margin: 0;
		padding: 0;
	}
</style>
