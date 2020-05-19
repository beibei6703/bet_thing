import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'
import Blank from '@/components/blank'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    
        {
            path: "/pc_index", // pc端首页
            name: Blank,
            component: Blank
          },
    
  ]
})
