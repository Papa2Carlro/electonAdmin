import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'auth',
      component: require('@/components/Auth').default
    },
    {
      path: '/page',
      name: 'page',
      component: require('@/components/Page').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
