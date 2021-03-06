import Vue from 'vue'
import VueRouter from 'vue-router'

import PageNames from '@/consts/PageNames'
import IndexPage from '@/view/pages/IndexPage'
import NotFoundPage from '@/view/pages/NotFoundPage'

import DatabaseService from '@/model/services/DatabaseService'

Vue.use(VueRouter)

const isAuthorized = function (next, redirect, reverse = false) {
  return DatabaseService.isAuthorized()
    .then(user => {
      console.log('> Router -> isAuthorized =', user)
      let authorized = (user != null)
      if (reverse ? !authorized : authorized) next()
      else Router.replace({ name: redirect })
    })
}

const Router = new VueRouter({
  routes: [
    {
      path: '/',
      name: PageNames.INDEX,
      component: IndexPage
    },
    {
      path: '/gallery',
      name: PageNames.GALLERY,
      component: () => import('@/view/pages/GalleryPage'),
      beforeEnter (to, from, next) { isAuthorized(next, PageNames.ENTRANCE) }
    },
    {
      path: '/entrance',
      name: PageNames.ENTRANCE,
      component: () => import('@/view/pages/EntrancePage'),
      beforeEnter (to, from, next) { isAuthorized(next, PageNames.INDEX, true) }
    },
    {
      path: '/exit',
      name: PageNames.EXIT,
      component: () => import('@/view/pages/ExitPage'),
      beforeEnter (to, from, next) { isAuthorized(next, PageNames.INDEX) }
    },
    { path: '*', component: NotFoundPage }
  ],
  mode: 'history'
})

export default Router
