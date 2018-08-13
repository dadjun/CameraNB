import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login/login'
import summary from '@/components/pages/summary'
Vue.use(Router)

export default new Router({
  routes: [
   {
      path:  '/login',
      name: 'login',
      component: login
    },
    {
      path:  '/',
      name:  'summary',
      component: summary,
      meta:
        {
          auth: false
        }
    }
  ]
})
