<template>
  <div class="container"
       @click="show">
    <div class="box-card"
         :class="{'box-even': index%2 !== 0 }">
      <div class="content-box">
        <!-- <h2 class="title">{{cData.title}}</h2> -->
				<view class="solid-bottom text-xl title">
					<text class="text-black text-bold">{{cData.title}}</text>
				</view>
				
				<!-- <h2 class="time">{{cData.time}}</h2> -->
				<view class="solid-bottom text-xs time">
					<text class="text-gray">{{cData.time}}</text>
				</view>

				<view class="flex-sub">
					<view class="solid-bottom text-df padding text">{{cData.text}}</view>
				</view>
        <!-- <p class="content">{{cData.text}}</p> -->
      </div>
      <div class="img-box">
        <img :src="cData.img ? cData.img : require('assets/img/hanbao.jpg')">
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
interface contentObj {
  title: string;
  content: string;
  img: string;
  id: number;
  time: string;
}

@Component
export default class Content extends Vue {
  @Prop()
  cData!: contentObj;
  @Prop()
  index!: number;

  

  show() {
		console.log('goshow')
		uni.navigateTo({
		    url: `/pages/read/read?id=${this.cData.id}`
		});
		// uni.navigateTo({
		//     url: `pages/read/read/${this.cData.id}`
		// });
  }
}
</script>

<style lang="stylus" scoped>
title-font = 22px

.img-box
  height 100%
  width 40%
  // display flex
  // justify-content flex-end
  // align-items center
	display table-cell
	vertical-align middle

.img-box img
  max-height 100%
  max-width 100%
  transition all 0.6s
	display block
	margin auto

.img-box img:hover
  transform scale(1.1)

.container
  width 90vw
  margin-bottom 20px

.box-card
  display flex
  box-shadow 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  border 1px solid #EBEEF5
  background-color #FFF
  color #303133
  transition 0.3s
  border-radius 4px
  overflow hidden
  height 25vh
  justify-content space-between
  align-items center

.box-card:hover
  box-shadow 0 4px 12px 12px rgba(7, 17, 27, 0.15)

.box-card:hover .img-box img
  transform scale(1.1)

.box-even
  flex-direction row-reverse

.content-box
	width 80%
	flex-wrap wrap
	display flex
  // padding 0.5rem
	justify-content center
	align-items center

.title
  font-size title-font
  font-weight bold
	
.title
	padding-left 1rem

.time
  color #999
  font-style italic
  padding 0 1rem

.content
  color #666
  margin 0 10px 10px 0
  text-overflow ellipsis
  -webkit-line-clamp 3
  -webkit-box-orient vertical
  line-height 1.4em
  height 4.2em
  overflow hidden
  font-size 14px
	
.text
	overflow: hidden;/*超出部分隐藏*/
	text-overflow:ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	
</style>


