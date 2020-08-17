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

// axios.defaults.timeout = 50000;// 超时时间
// axios.defaults.headers.get['Content-Type'] = 'application/json;'
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;'

axios.defaults.baseURL = "https://admin.dingrennet.cn"; 
// axios.defaults.baseURL = "http://125.124.205.233:8182"; 
// axios.defaults.baseURL = "http://192.168.1.112:8082"; 
// axios.defaults.baseURL = "http://47.99.156.10:8182"
// axios.defaults.baseURL = "http://10.75.22.5:8182"

// 整理数据
// axios.defaults.transformRequest = [
//   function (data) {
//     if (JSON.stringify(data) == "{}") {
//       return data
//     } else {
//       let ret = "";
//       for (let it in data) {
//         ret +=
//           encodeURIComponent(it) +
//           "=" +
//           encodeURIComponent(data[it]) +
//           "&";
//       }
//       return ret;
//     }
//   }
// ]

// 请求拦截器
// 如果是登录和注册操作，则不需要携带header里面的token
axios.interceptors.request.use(
  config => {
    if (config.url === '/') {
    } else {
      if (sessionStorage.getItem('Authorization')) {
        config.headers.Authorization = sessionStorage.getItem('Authorization')
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  })

// 异步请求后，判断token是否过期
axios.interceptors.response.use(
  res => {
    return res
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 500:
          alert('网络异常,请稍后重试')
          break
        case 401:
          alert('你没有该操作权限')
          break
        case 600:
          alert('用户登录过期，请重新登陆');
          sessionStorage.removeItem('Authorization')
          sessionStorage.removeItem('menuList')
          sessionStorage.clear()
          router.push({path: '/'})
          break
      }
    }
  })
