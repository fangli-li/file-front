<template>
	<div id="app">
		<home />
	</div>
</template>

<script>
	//import portal from './components/portal.vue'
	import home from './components/home/home.vue'

	export default {
		name: 'app',
		components: {
			home
		}
	}
</script>

<style>
	html, body{
		margin: 0;
		padding: 0;
	}
</style>
