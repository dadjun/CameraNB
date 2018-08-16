import Vue from 'vue'
import Router from 'vue-router'
import login1 from '@/components/pages/login'
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
      name: 'login1',
      component: login1
    },
    {
      path:  '/summary',
      name:  'summary',
      component: summary,
      meta:
        {
          auth: false
        }
    }
  ]
})
