import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import './theme/element/index.css'
// import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import './icons' // icon
import './permission' // permission control

import Http from './utils/Http'
import moment from 'moment'

import * as filters from './filters' // global filters

import permission from '@/directive/permission/index.js' // 权限判断指令

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.directive('permission', permission)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
window.moment = moment
window.Site = {
  v: '0.1.0',
  http: Http,
  env: Http.env,
  navMenuScrollBar: null
}
Vue.prototype.$moment = moment
Vue.config.productionTip = false

Site.app = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
