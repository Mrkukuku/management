import axios from 'axios'
import router from '../router'
import {MessageBox} from 'element-ui'
// axios.defaults.baseURL = "https://admin.dingrennet.cn"; 
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

axios.interceptors.response.use(
    res => {
      return res
    },
    error => {
      if (error.response) {
        switch (error.response.status) {
          case 500:
            MessageBox.alert('网络异常,请稍后重试')
            break;
          case 401:
            router.push({path: '/'})
            sessionStorage.clear()
            MessageBox.alert('用户登录过期，请重新登陆');
            break;
          case 600:
            MessageBox.alert('用户登录过期，请重新登陆');
            sessionStorage.clear()
            router.push({path: '/'})
            break;
        }
      }
  })

export function post(url,data = {}){
    return new Promise((resolve,reject) => {
        axios.post(url,data)
        .then(response => {
            if(response.data.code == 0){
                resolve(response.data);
            }else{
              MessageBox.alert(response.data.msg)
            }
        },err => {
            reject(err);
            let message = '请求失败！请检查网络';
            if(err.response)message=err.response.data.message;
        })
    })
}