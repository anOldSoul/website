<template>
  <div style="height:100%" class="flex">
    <nav-menu class="nav-menu-box" v-if="!$route.meta.hideMenu"></nav-menu>
    <div class="root-route-view-box">
      <div class="fixed" v-if="!$route.meta.hideMenu">
        <div class="header flex-a-c">
          <el-dropdown @command="userOptions">
            <span class="el-dropdown-link">
              {{realname || 'admin123'}}
              <el-badge class="mark" :value="noticeCount" v-if="noticeCount > 0"/>
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">{{realname || 'admin123'}}</el-dropdown-item>
              <template v-if="!isYueHui">
                <el-dropdown-item command="notice">通知<el-badge  v-if="noticeCount > 0"  class="mark" :value="noticeCount" /></el-dropdown-item>
                <el-dropdown-item command="chpwd">修改密码</el-dropdown-item>
              </template>
              <el-dropdown-item command="logout">登出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="breadcrumb-box flex-a-c">
          <el-breadcrumb separator="/">
            <transition-group name="breadcrumb">
              <el-breadcrumb-item v-for="(item,index) in $route.meta.breadcrumb" :key="index" :to="{ path:item.url}">{{item.text}}</el-breadcrumb-item>
            </transition-group>
          </el-breadcrumb>
        </div>
        <tags-view/>
      </div>
      <div class="router-view">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import NavMenu from '../components/common/NavMenu'
import TagsView from '../components/common/TagsView'

export default {
  name: 'Home',
  components: {
    NavMenu, TagsView
  },
  data () {
    return {
    }
  },
  computed: {
  },
  watch: {
  },
  beforeRouteUpdate (to, from, next) {
    const container = document.querySelector('.router-view')
    container.scrollTop = 0
    next()
  },
  created () {
  },
  methods: {
    userOptions (command) {
      if (command === 'logout') {
        this.$store.commit('logout', true)
        this.$router.push({
          path: '/login'
        })
      }
    },
  },
  mounted: function () {
  }
}
</script>
<style>
.nav-menu-box {
  width: 200px;
  height: 100%;
  flex-shrink: 0;
  display: flex;
  overflow: auto;
}

.root-route-view-box {
  flex-grow: 2;
  background-color: #f0f0f0;
  width: 70%;
  min-width: 900px;
  height: 100%;
}

.header {
  height: 60px;
  justify-content: flex-end;
  padding: 0 20px;
  background-color: #091928;
}
.el-dropdown {
  color: #ffffff;
  cursor: pointer;
}
.navigation-box {
  margin-left: 15px;
}
.system-name {
  display: flex;
  align-items: center;
}

.el-dropdown-menu {
  font-size: 14px;
}
.router-view {
  position: relative;
  height: 100%;
  z-index: 99;
}
.btn-wrap {
  position: fixed;
  top: 70px;
  right: 20px;
  z-index: 0;
}
.el-table th {
  padding: 8px 0;
}
.el-table td {
  padding: 0;
  height: 40px;
}
.router-view {
  height: calc(100%);
  overflow: auto;
  overflow-x: hidden;
}
.el-table__expanded-cell {
  padding: 0 !important;
}
.width-200 {
  width: 200px;
}
.link, .link:visited{
  color: #1BA19D;
  text-decoration: none;
}
.el-form-item .el-form-item{
  /* margin-bottom: 22px !important; */
}
</style>
