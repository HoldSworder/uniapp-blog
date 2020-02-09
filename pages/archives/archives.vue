<template>
  <div class="container">
		<page-head title="归档"></page-head>
		
    <view class="cu-timeline" v-for="(item, index) in getDate" :key="index">
      <view class="cu-time" v-if="checkString(item)">{{item}}</view>
      <view class="cu-item" v-else>
					<view class="content" @click="goShow(item.id)">
						{{item.title}}
					</view>
      </view>
    </view>

		<!-- <page-bottom></page-bottom> -->
  </div>
</template>

<script>
import Tool from 'common/js/tool'
export default {
  data() {
    return {
      data: {}
    }
  },

  computed: {
    getMonth() {
      const month = []
      const data = this.data
      for (const item in data) {
        if (data.hasOwnProperty(item)) {
          month.push(item)
        }
      }
      return month
    },
		
    getDate() {
      const arr = []
      for (const item of this.getMonth) {
        arr.push(item)
        for (const ite of this.data[item]) {
          arr.push(ite)
        }
      }
      console.log(arr)
      return arr
    }
  },
	
	methods: {
		checkString(item) {
			return typeof item == 'string'
		},
		goShow(id) {
			const url = `/pages/read/read?id=${id}`
			uni.navigateTo({
				url
			})
		}
	},

  mounted() {
    this.$api.basic.getArchives().then(res => {
      this.data = res.data
    })
  }
}
</script>

<style lang="stylus" scoped>
.content
  margin-top 20px
.month
  font-size 24px
.title
  margin-right 10px
  font-size: 16px;
  color #2479CC
.date
  color: #999;
  font-size: 14px;
  font-style: italic;
.container
	min-height 100vh
	background-color white
</style>
