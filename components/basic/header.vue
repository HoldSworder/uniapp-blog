<template>
	<div>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<!-- <block slot="backText">
				<navigator open-type="navigateBack" hover-class="navigator-hover">
					返回
				</navigator>
			</block> -->
			<block slot="content">{{title}}</block>
		</cu-custom>
	</div>
</template>

<script>
	export default {
		props: ['title']
	}
</script>

<style>
</style>
