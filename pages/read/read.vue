<template>
  <div>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">
				<navigator open-type="navigateBack" hover-class="navigator-hover">
					返回
				</navigator>
			</block>
			<block slot="content">{{title}}</block>
		</cu-custom>
		 <!-- <u-parse :content="info" class="parse" /> -->
		 <jyf-parser :html="info"></jyf-parser>
  </div>
</template>

<script>
import uParse from '@/components/gaoyia-parse/parse.vue'
import jyfParser  from '@/components/jyf-parser/jyf-parser'
import marked from 'marked'

export default {
	components: {
		uParse,
		jyfParser
	},
		
	data() {
		return {
			info: '',
			title: ''
		}
	},
	
	onLoad(option) { //option为object类型，会序列化上个页面传递的参数
		const id = option.id
		console.log(id)
		
		this.$api.info.get({id}).then((res) => {
			this.$nextTick(() => {
				this.info = marked(res.data.content);
				this.title = res.data.title;
			});
		});
	}
}
</script>

<style lang='stylus' scoped>
</style>