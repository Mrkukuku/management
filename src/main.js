// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store/index'
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueAMap from 'vue-amap'
import moment from 'moment'
import {noMoreClick,numberInput} from './directive/directive'
import {post} from './utils/http'
Vue.prototype.$post=post;
VueAMap.initAMapApiLoader({
  key: '5272115ec9e9f0c601b3d83ac327afbd',
  plugin: ['AMap.Autocomplete', 'AMap.Geocoder','AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor','AMap.Geolocation'],
})
Vue.config.productionTip = false
Vue.use(elementUI)
Vue.use(VueAxios, axios)
Vue.use(VueAMap)
Vue.prototype.$moment = moment
import * as filters from './directive/validate'
Object.keys(filters).forEach(key => {//注册全局过滤器
  Vue.filter(key, filters[key])
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})


