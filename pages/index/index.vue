<template>
	<view>
		<page-head title="首页"></page-head>
		
		<div class="content">
			<div v-for="(item, index) of contentData"
					 :key="index">
				<body-content :cData="item"
											class="body-content"
											:index="index"></body-content>
			</div>
		</div>
		
		<!-- <page-bottom></page-bottom> -->
	</view>
</template>

<script lang="ts">
	import {
		Component,
		Vue
	} from "vue-property-decorator";
	import bodyContent from '../../components/bodyer/content.vue'

	@Component({
		components: {
			bodyContent
		}
	})
	export default class Home extends Vue {
		contentData: Array < object > = [];
		$api: any;

		onLoad() {
			const THAT = this;
			// uni.request({
			// 	url: '/overview',
			// 	method: 'GET',
			// 	success: res => {
			// 		console.log(res)
			// 	}
			// })
			this.$api.basic.getOverview().then((res: any) => {
				this.$nextTick(function() {
					THAT.contentData = res.data
				});
			});
		}
	}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/index'	

.content
  padding 10px
  color $color-dialog-background
	display flex
	flex-wrap wrap
	justify-content center
	
.body-content
	display flex
	flex-wrap wrap
	justify-content center
	
</style>
