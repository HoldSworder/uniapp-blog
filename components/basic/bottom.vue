<template>
	<div class='bottom-box'>
		<view class="cu-bar tabbar bg-black">
			<view class="action text-gray">
				<navigator open-type="navigate" url="/pages/archives/archives" hover-class="navigator-hover">
					<view class="cuIcon-homefill"></view> 
					归档
				</navigator>
			</view>
			<!-- <view class="action text-gray">
				<view class="cuIcon-similar"></view> 分类
			</view> -->
			<view class="action text-gray add-action">
				<navigator open-type="navigate" url="/pages/index/index" hover-class="navigator-hover">
					<button class="cu-btn cuIcon-homefill bg-green shadow"></button>
					首页
				</navigator>
			</view>
			<!-- <view class="action text-gray">
				<view class="cuIcon-cart">
					<view class="cu-tag badge">99</view>
				</view>
				购物车
			</view> -->
			<view class="action text-gray">
				<navigator open-type="navigate" url="/pages/about/about" hover-class="navigator-hover">
					<view class="cuIcon-my">
						<!-- <view class="cu-tag badge"></view> -->
					</view>
					我的
				</navigator>
			</view>
		</view>
	
	</div>
</template>

<script>
	export default {
		onLoad() {
			const pages = getCurrentPages()
			console.log(pages)
		}		
	}
</script>

<style lang="stylus">
.bottom-box
	// position fixed
	width 100%
	bottom 0
	z-index 99
</style>
