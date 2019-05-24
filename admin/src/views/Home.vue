<template>
  <div style="height:100%" class="flex">
    <nav-menu class="nav-menu-box"></nav-menu>
    <div class="root-route-view-box">
      <div class="fixed">
        <div class="breadcrumb-box flex-a-c">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="(item,index) in $store.state.breadcrumbs" :key="index" :to="{ path:item.url}">{{item.text}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
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
//
export default {
  name: 'Home',
  components: {
    NavMenu
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
  justify-content: space-between;
  padding: 0 20px;
  background-color: #fff;
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
  top: 10px;
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
  height: calc(100% - 105px);
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
