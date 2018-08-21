import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/pages/login'
import register from '@/components/pages/register'
import summary from '@/components/pages/summary'
Vue.use(Router)

export default new Router({
  routes: [

    {
      path:  '/register',
      name: 'register',
      component: register
    },
    {
      path:  '/',
      name: 'login',
      component: login,
      meta:
        {
          auth: false
        }
    },
    {
      path:  '/summary',
      name:  'summary',
      component: summary,

    }
  ]
})
