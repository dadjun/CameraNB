import axios from 'axios'
import qs from 'qs'
import promise from 'es6-promise'

promise.polyfill()

// axios 配置
axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

axios.defaults.baseURL ='http://localhost:8082'
// axios.defaults.baseURL = 'http://hylink.imwork.net:8235/fireinspectionMgmt'
// axios.defaults.baseURL = 'http://192.168.0.40:8080/fireMgmt'

// POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
// 在发送请求之前做某件事
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  return config
}, (error) => {
  return Promise.reject(error)
})
// 返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) => {
//  对响应数据做些事
  // console.log(JSON.stringify(res))
  if (!res.data.resultCode === 'NO_ERROR') {
    return Promise.reject(res)
  }
  return res
}, (error) => {
  // _.toast("网络异常", 'fail');
  return Promise.reject(error)
})
// 返回一个Promise(发送post请求)
export function fetch (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(response => {
        if (!response.data) {
          resolve(response)
        } else {
          resolve(response.data)
        }
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export default {
  /**
   * 消防接口耗时
   */
  interfaceCapabilityAxios (params) {
    return fetch('/xfTimeMonitoring/selectXfTimeMonitoring.action', params)
  },

  /**
   * 用户登录日志
   */
  selectCustomersAxios(params) {
    return fetch('/customer/selectCustomers', params)
  },

  sendCustomersEmailAxios(params) {
    return fetch('/email/batchSend', params)
  },

  // 登录接口
  loginAxios (params) {
    return fetch('/user/login', params)
  },
// 登录接口
  registerUserAxios (params) {
    return fetch('/user/register', params)
  }
}
