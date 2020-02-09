import Vue from 'vue'
import App from './App'
import cuCustom from './colorui/components/cu-custom.vue'
import api from './api/index.ts'

import pageHead from './components/basic/header.vue'
import pageBottom from './components/basic/bottom.vue'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)

Vue.component('cu-custom',cuCustom)
Vue.component('page-head', pageHead)
Vue.component('page-bottom', pageBottom)

Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.$api = api

const app = new Vue({
    ...App
})
app.$mount()
