// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'

import Vue from 'vue'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/icon/iconfont.css'
import ElementUI from 'element-ui'
import './common.css'
import VueLazyload from 'vue-lazyload'
// Vue.config.productionTip = false

import Http from './utils/Http'
import moment from 'moment'
import dotProp from 'dot-prop'

import store from './store/store'
Vue.use(VueLazyload)
Vue.use(ElementUI)

window.Site = {
  v: '0.1.0',
  http: Http,
  env: Http.env,
  navMenuScrollBar: null
}
window.moment = moment
window.dotProp = dotProp
Vue.prototype.$dotProp = dotProp
Vue.prototype.$moment = moment
Vue.config.silent = true

/* eslint-disable no-new */
Site.app = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
