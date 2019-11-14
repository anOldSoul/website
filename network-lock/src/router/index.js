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

const Department = resolve => require(['../views/departmentManage/department'], resolve)
const DepartmentDetail = resolve => require(['../views/departmentManage/editDepart'], resolve)
const RoomDetail = resolve => require(['../views/departmentManage/editRoom'], resolve)
const RentDetail = resolve => require(['../views/departmentManage/editRent'], resolve)

const SystemAdm = resolve => require(['../views/system/adm/list'], resolve)
const SystemLog = resolve => require(['../views/system/log/list'], resolve)
const SystemRole = resolve => require(['../views/system/role/list'], resolve)
const DeviceUnlock = resolve => require(['../views/deviceLog/unlock'], resolve)
const DeviceUserUpdate = resolve => require(['../views/deviceLog/userUpdate'], resolve)
const DeviceWarning = resolve => require(['../views/deviceLog/warning'], resolve)
const UserManage = resolve => require(['../views/userManage/list'], resolve)
const Statistic = resolve => require(['../views/statistic/graph'], resolve)
const Platform = resolve => require(['../views/statistic/platform'], resolve)

const Lookforward = resolve => require(['../views/lookforward'], resolve)

const routers = [
  {
    path: '/',
    name: 'Statistic',
    component: Statistic,
    meta: {
      keepAlive: true,
      breadcrumb: [{
        text: '首页'
      }, {
        text: '数据统计'
      }]
    }
  }, {
    path: '/lock',
    name: 'Lock',
    component: Lock,
    meta: {
      keepAlive: true,
      breadcrumb: [{
        text: '设备管理'
      }, {
        text: '锁具'
      }]
    }
  }, {
    path: '/lock/detail/:id/:gateid',
    name: 'LockDetail',
    component: LockDetail,
    meta: {
      keepAlive: false,
      breadcrumb: [{
        text: '设备管理'
      }, {
        text: '门锁详情'
      }]
    }
  }, {
    path: '/lock/password/:id',
    name: 'Password',
    component: Password,
    meta: {
      keepAlive: true,
      breadcrumb: [{
        text: '设备管理'
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
        text: '设备管理'
      }, {
        text: '网关'
      }]
    }
  }, {
    path: '/gateway/detail/:id',
    name: 'GateWayDetail',
    component: GateWayDetail,
    meta: {
      keepAlive: false,
      breadcrumb: [{
        text: '设备管理'
      }, {
        text: '网关详情'
      }]
    }
  }, {
    path: '/department',
    name: 'Department',
    component: Department,
    meta: {
      keepAlive: true,
      breadcrumb: [{
        text: '公寓管理'
      }]
    }
  }, {
    path: '/department/detail/:id',
    name: 'DepartmentDetail',
    component: DepartmentDetail,
    meta: {
      keepAlive: false,
      breadcrumb: [{
        text: '公寓管理'
      }, {
        text: '公寓信息'
      }]
    }
  }, {
    path: '/room/detail/:id/:apartmentid/:floor',
    name: 'RoomDetail',
    component: RoomDetail,
    meta: {
      keepAlive: false,
      breadcrumb: [{
        text: '公寓管理'
      }, {
        text: '房间信息'
      }]
    }
  }, {
    path: '/rent/detail/:id',
    name: 'RentDetail',
    component: RentDetail,
    meta: {
      keepAlive: false,
      breadcrumb: [{
        text: '公寓管理'
      }, {
        text: '租客信息'
      }]
    }
  }, {
    path: '/deviceLog/deviceUnlock',
    name: 'DeviceUnlock',
    component: DeviceUnlock,
    meta: {
      keepAlive: true,
      breadcrumb: [{
        text: '设备日志'
      }, {
        text: '开锁记录'
      }]
    }
  }, {
    path: '/deviceLog/deviceWarning',
    name: 'DeviceWarning',
    component: DeviceWarning,
    meta: {
      keepAlive: true,
      breadcrumb: [{
        text: '设备日志'
      }, {
        text: '告警记录'
      }]
    }
  }, {
    path: '/deviceLog/deviceUserUpdate',
    name: 'DeviceUserUpdate',
    component: DeviceUserUpdate,
    meta: {
      keepAlive: true,
      breadcrumb: [{
        text: '设备日志'
      }, {
        text: '操作记录'
      }]
    }
  }, {
    path: '/system/log',
    name: 'SystemLog',
    component: SystemLog,
    meta: {
      keepAlive: true,
      breadcrumb: [{
        text: '系统管理'
      }, {
        text: '系统日志'
      }]
    }
  }, {
    path: '/system/adm',
    name: 'SystemAdm',
    component: SystemAdm,
    meta: {
      keepAlive: true,
      breadcrumb: [{
        text: '系统管理'
      }, {
        text: '管理员信息'
      }]
    }
  }, {
    path: '/system/role',
    name: 'SystemRole',
    component: SystemRole,
    meta: {
      keepAlive: true,
      breadcrumb: [{
        text: '系统管理'
      }, {
        text: '角色信息'
      }]
    }
  }, {
    path: '/system/log',
    name: 'SystemLog',
    component: SystemLog,
    meta: {
      keepAlive: true,
      breadcrumb: [{
        text: '系统日志'
      }, {
        text: ''
      }]
    }
  }, {
    path: '/userManage',
    name: 'UserManage',
    component: UserManage,
    meta: {
      keepAlive: true,
      breadcrumb: [{
        text: '租客管理'
      }]
    }
  }, {
    path: '/statistic',
    name: 'Statistic',
    component: Statistic,
    meta: {
      keepAlive: true,
      breadcrumb: [{
        text: '数据统计'
      }, {
        text: ''
      }]
    }
  }, {
    path: '/platform',
    name: 'Platform',
    component: Platform,
    meta: {
      hideMenu: true,
      keepAlive: true,
      breadcrumb: [{
        text: '数据统计'
      }, {
        text: ''
      }]
    }
  }, {
    path: '/lookforward',
    name: 'Lookforward',
    component: Lookforward,
    meta: {
      keepAlive: true,
      breadcrumb: [{
        text: '敬请期待'
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
  }, {
    path: '/login',
    name: 'Login',
    component: Login,
    permission: []
  }]
})
router.beforeEach((to, from, next) => {
  console.log(store.state.hasLoad)
  if (to.path.indexOf('login') > -1 || store.state.hasLoad) {
    next()
  } else {
    Site.http.post('/admin-rest/auth/login', {
      username: 'admin123',
      password: 'admin123'
    }, data => {
      localStorage.setItem('name', data.data.token)
      next({
        path: '/login'
      })
    })
  }
})
export default router
