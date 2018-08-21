// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'    // 使用 CSS
import Cookies from 'js-cookie'

Vue.config.productionTip = false

// 登录验证
router.beforeEach((to, from, next) => {
  if (to.meta.auth !== false) {
    console.log(Cookies.get('username'))
    if (Cookies.get('username')) { // 是否登录
      next()
    } else { // 未登录则跳转到登录页面
      next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  } else {
    next()
  }
})
Vue.use(iView)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
