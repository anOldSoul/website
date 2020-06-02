import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

const Lock = resolve => require(['../views/lock/index'], resolve)
const LockDetail = resolve => require(['../views/lock/detail'], resolve)
const GateWay = resolve => require(['../views/gateway/index'], resolve)
const GateWayDetail = resolve => require(['../views/gateway/detail'], resolve)

const Department = resolve => require(['../views/departmentManage/department'], resolve)
const DepartmentDetail = resolve => require(['../views/departmentManage/editDepart'], resolve)
const RoomDetail = resolve => require(['../views/departmentManage/editRoom'], resolve)
const RentDetail = resolve => require(['../views/departmentManage/editRent'], resolve)

const DeviceUnlock = resolve => require(['../views/deviceLog/unlock'], resolve)
const DeviceWarning = resolve => require(['../views/deviceLog/warning'], resolve)
const UserManage = resolve => require(['../views/userManage/list'], resolve)
const CollectionLog = resolve => require(['../views/deviceLog/collection'], resolve)
const Collection = resolve => require(['../views/collection/list'], resolve)
const CollectionDetail = resolve => require(['../views/collection/detail'], resolve)

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    perms: ['GET /aaa','POST /bbb']     will control the page perms (you can set multiple perms)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'el-icon-pie-chart', noCache: true }
      }
    ]
  },
  {
    path: '/department',
    component: Layout,
    redirect: '/department',
    children: [
      {
        path: '/department/list',
        component: Department,
        name: 'Department',
        perms: ['POST/admin/apartmeninfo/queryByPage'],
        meta: { title: '公寓管理', icon: 'el-icon-menu', noCache: true }
      }
    ]
  },
  {
    path: '/userManage',
    redirect: '/userManage/list',
    component: Layout,
    children: [
      {
        path: '/userManage/list',
        component: UserManage,
        name: 'UserManage',
        perms: ['POST/admin/tLockRentuser/queryByPage'],
        meta: { title: '租客管理', icon: 'el-icon-user', noCache: true }
      }
    ]
  },
  {
    path: '/department/detail',
    component: Layout,
    redirect: '/department/detail/:id',
    hidden: true,
    children: [
      {
        path: '/department/detail/:id',
        component: DepartmentDetail,
        name: 'DepartmentDetail',
        perms: ['POST/admin/apartmeninfo/queryByPage'],
        meta: { title: '公寓信息', icon: 'dashboard', noCache: true }
      }
    ]
  },
  {
    path: '/rent/detail',
    component: Layout,
    redirect: '/rent/detail/:id',
    hidden: true,
    children: [
      {
        path: '/rent/detail/:id',
        component: RentDetail,
        name: 'RentDetail',
        meta: { title: '租客信息', icon: 'dashboard', noCache: true }
      }
    ]
  },
  {
    path: '/room/detail',
    component: Layout,
    redirect: '/room/detail/:id/:apartmentid/:floor',
    hidden: true,
    children: [
      {
        path: '/room/detail/:id/:apartmentid/:floor',
        component: RoomDetail,
        name: 'RoomDetail',
        meta: { title: '房间信息', icon: 'dashboard', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/lock',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'sysManage',
    meta: {
      title: '设备管理',
      icon: 'el-icon-printer'
    },
    children: [
      {
        path: 'gateWay',
        component: GateWay,
        name: 'GateWay',
        meta: {
          perms: ['POST/admin/tGatewayInfo/queryByPage'],
          title: '网关',
          noCache: true
        }
      },
      {
        path: '/gateway/detail/:id',
        component: GateWayDetail,
        name: 'GateWayDetail',
        hidden: true,
        meta: {
          perms: ['POST/admin/tGatewayInfo/queryByPage'],
          title: '网关详情',
          noCache: true
        }
      },
      {
        path: 'admin',
        component: Lock,
        name: 'admin',
        meta: {
          perms: ['POST/admin/tLockInfo/queryByPage'],
          title: '锁具',
          noCache: true
        }
      },
      {
        path: '/lock/detail/:id/:gateid',
        component: LockDetail,
        name: 'LockDetail',
        hidden: true,
        meta: {
          perms: ['POST/admin/tLockInfo/queryByPage'],
          title: '锁具详情',
          noCache: true
        }
      },
      {
        path: 'collection',
        component: Collection,
        name: 'collection',
        meta: {
          perms: ['POST/admin/tCollectorInfo/queryByPage'],
          title: '采集器',
          noCache: true
        }
      },
      {
        path: '/collection/detail/:id',
        component: CollectionDetail,
        name: 'CollectionDetail',
        hidden: true,
        meta: {
          perms: ['POST/admin/tCollectorInfo/queryByPage'],
          title: '采集器详情',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/deviceLog',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'DeviceLog',
    meta: {
      title: '设备日志',
      icon: 'el-icon-date'
    },
    children: [
      {
        path: 'deviceLog/deviceUnlock',
        component: DeviceUnlock,
        name: 'DeviceUnlock',
        meta: {
          perms: ['POST/admin/tWarningTxninfo/queryByPage'],
          title: '开锁日志',
          noCache: true
        }
      },
      {
        path: '/deviceLog/deviceWarning',
        component: DeviceWarning,
        name: 'DeviceWarning',
        meta: {
          perms: ['POST/admin/tLockopenTxninfo/queryByPage'],
          title: '告警日志',
          noCache: true
        }
      },
      {
        path: '/deviceLog/collectionLog/:id',
        component: CollectionLog,
        name: 'CollectionLog',
        meta: {
          perms: ['POST/admin/tCollectorTxn/queryByPage'],
          title: '采集日志',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/sys',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'sysManage',
    meta: {
      title: '系统管理',
      icon: 'el-icon-setting'
    },
    children: [
      {
        path: 'admin',
        component: () => import('@/views/sys/admin'),
        name: 'admin',
        meta: {
          perms: ['GET /admin/admin/list', 'POST /admin/admin/create', 'POST /admin/admin/update', 'POST /admin/admin/delete'],
          title: '管理员',
          noCache: true
        }
      },
      {
        path: 'log',
        component: () => import('@/views/sys/log'),
        name: 'log',
        meta: {
          perms: ['GET /admin/log/queryByPage'],
          title: '操作日志',
          noCache: true
        }
      },
      {
        path: 'role',
        component: () => import('@/views/sys/role'),
        name: 'role',
        meta: {
          perms: ['GET /admin/role/list', 'POST /admin/role/create', 'POST /admin/role/update', 'POST /admin/role/delete', 'GET /admin/role/permissions', 'POST /admin/role/permissions'],
          title: '角色管理',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    children: [
      {
        path: 'password',
        component: () => import('@/views/profile/password'),
        name: 'password',
        meta: { title: '修改密码', noCache: true }
      }
    ],
    hidden: true
  },
  { path: '*', redirect: '/404', hidden: true }
]
