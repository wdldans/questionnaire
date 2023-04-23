import Vue from 'vue'
import Router from 'vue-router'
import editor from '../page/editor/index.vue'
import preview from '../page/preview/index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'editor',
      component: editor,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/preview',
      name: 'preview',
      component: preview,
      meta: {
        keepAlive: false
      }
    }
  ]
})