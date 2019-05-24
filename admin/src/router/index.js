import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Login from '@/views/Login'
import store from '@/store/store'
import { Notification } from 'element-ui';

Vue.use(Router)
// lazyload
const Lock = resolve => require(['../views/provisions/index'], resolve)
const LockDetail = resolve => require(['../views/provisions/detail'], resolve)
const GateWay = resolve => require(['../views/provisions/index'], resolve)
const GateWayDetail = resolve => require(['../views/provisions/detail'], resolve)

const routers = [
  {
    path: '/',
    name: 'Lock',
    component: Lock,
    meta: {
      keepAlive: true
    }
  }, {
    path: '/lock/detail/:id',
    name: 'LockDetail',
    component: LockDetail,
    meta: {
      keepAlive: false
    }
  }, {
    path: '/gateway',
    name: 'GateWay',
    component: GateWay,
    meta: {
      keepAlive: false
    }
  }, {
    path: '/gateway/detail/:id',
    name: 'GateWayDetail',
    component: GateWayDetail,
    meta: {
      keepAlive: false
    }
  }
]
const routerList = routers

const router = new Router({
  routes: [{
    path: '/',
    component: Home,
    children: routerList
  }]
})
router.beforeEach((to, from, next) => {
  next()
})
export default router
