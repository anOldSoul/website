import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Login from '@/views/Login'
import store from '@/store/store'
import { Notification } from 'element-ui';

Vue.use(Router)
// lazyload
const Lock = resolve => require(['../views/lock/index'], resolve)
const LockDetail = resolve => require(['../views/lock/detail'], resolve)
const Password = resolve => require(['../views/lock/password'], resolve)
const GateWay = resolve => require(['../views/gateway/index'], resolve)
const GateWayDetail = resolve => require(['../views/gateway/detail'], resolve)

const routers = [
  {
    path: '/',
    name: 'Lock',
    component: Lock,
    meta: {
      keepAlive: true,
      breadcrumb: [{
        text: '锁具'
      }, {
        text: '列表'
      }]
    }
  }, {
    path: '/lock/detail/:id',
    name: 'LockDetail',
    component: LockDetail,
    meta: {
      keepAlive: false,
      breadcrumb: [{
        text: '锁具'
      }, {
        text: '详情'
      }]
    }
  }, {
    path: '/lock/password',
    name: 'Password',
    component: Password,
    meta: {
      keepAlive: true,
      breadcrumb: [{
        text: '锁具'
      }, {
        text: '密码'
      }]
    }
  }, {
    path: '/gateway',
    name: 'GateWay',
    component: GateWay,
    meta: {
      keepAlive: true,
      breadcrumb: [{
        text: '网关'
      }, {
        text: '列表'
      }]
    }
  }, {
    path: '/gateway/detail/:id',
    name: 'GateWayDetail',
    component: GateWayDetail,
    meta: {
      keepAlive: false,
      breadcrumb: [{
        text: '网关'
      }, {
        text: '列表'
      }]
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
