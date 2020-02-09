<template>
	<div>
		<page-head title="关于"></page-head>
		
		<scroll-view scroll-y class="scrollPage">
			<view class="UCenter-bg bg-gradual-blue padding radius text-center shadow-blur">
					<!-- <view class="cu-avatar png lg round margin-left" mode="widthFix" :style="getAvatar"></view>
					
					<view class="text-xl">{{userInfo.nickName}}</view> -->
					
					
					<open-data type="userAvatarUrl" class="avatar png lg round" mode="widthFix" :style="getAvatar"></open-data>
					<open-data type="userNickName" class="text-xl"></open-data>
				</view>
			</view>
			
			<view class="cu-list menu sm-border card-menu margin-top">
					
					<view class="cu-item arrow" @click="goIframe('note')">
						<view class="content">
							<text class="cuIcon-post text-grey"></text>
							<text class="text-grey">note</text>
						</view>
					</view>
					
					<view class="cu-item arrow" @click="goIframe('github')">
						<view class="content">
							<text class="cuIcon-github text-grey"></text>
							<text class="text-grey">github</text>
						</view>
					</view>
					
					<view class="cu-item arrow" @click="goIframe('blog')">
						<view class="content">
							<text class="cuIcon-form text-grey"></text>
							<text class="text-grey">PC-blog</text>
						</view>
					</view>
			</view>
		</scroll-view>
	
		<!-- <page-bottom></page-bottom> -->
	</div>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {
					nickName: '',
					city: '',
					province: '',
					avatarUrl: ''
				}
			}
		},
		
		computed: {
			getAvatar() {
				return `background-image:url(${this.userInfo.avatarUrl})`
			}
		},
		
		methods: {
			goIframe(router) {
				const url = '/pages/iframe/' + router
				console.log(url)
				uni.navigateTo({
					url
				})
			}
		},
		
		onLoad() {
			console.log(getApp())
			const THAT = this
			wx.getSetting({
				success(res)	{
					console.log(res)
					THAT.userInfo = res
				}
			})
			
			wx.login({
				success(res) {
					console.log(res)
				}
			})
		}
	}
</script>

<style>
	.UCenter-bg {
	  background-size: cover;
	  height: 550rpx;
	  display: flex;
	  justify-content: center;
	  padding-top: 40rpx;
	  overflow: hidden;
	  position: relative;
	  flex-direction: column;
	  align-items: center;
	  color: #fff;
	  font-weight: 300;
	  text-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
	}
	
	.UCenter-bg text {
	  opacity: 0.8;
	}
	
	.UCenter-bg image {
	  width: 200rpx;
	  height: 200rpx;
	}
	
	.UCenter-bg .gif-wave{
	  position: absolute;
	  width: 100%;
	  bottom: 0;
	  left: 0;
	  z-index: 99;
	  mix-blend-mode: screen;  
	  height: 100rpx;   
	}
	
	.cu-avatar {
		width: 150rpx !important;
		height: 150rpx !important;
		margin-bottom: 45rpx;
	}
	
	.avatar {
		width: 150rpx;
		height: 150rpx;
		border-radius: 50%;
		overflow: hidden;
	}
</style>
