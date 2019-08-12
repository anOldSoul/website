<template>
  <el-row class="tac">
    <el-col :style="{minHeight:'100%', 'overflow-x': 'hidden'}" class="clearfix nav-menu-c-box">
      <el-menu :default-active="activeIndex" unique-opened class="el-menu-nav">
        <div class="nav-logo">
          联网锁
        </div>
        <!-- 首页 -->
        <el-menu-item index="1" @click="goView('/gateway')">
          <i class="el-icon-menu"></i>公寓管理
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-k-manageorder"></i>设备管理
          </template>
          <el-menu-item index="5-5" @click="goView('/')">门锁</el-menu-item>
          <el-menu-item index="5-6" @click="goView('/gateway')">网关</el-menu-item>
        </el-submenu>
        <el-menu-item index="1" @click="goView('/')">
          <i class="el-icon-menu"></i>用户管理
        </el-menu-item>
        <el-menu-item index="1" @click="goView('/')">
          <i class="el-icon-menu"></i>设备告警
        </el-menu-item>
        <el-menu-item index="1" @click="goView('/')">
          <i class="el-icon-menu"></i>设备日志
        </el-menu-item>
        <el-menu-item index="1" @click="goView('/')">
          <i class="el-icon-menu"></i>数据统计
        </el-menu-item>
        <el-menu-item index="1" @click="goView('/')">
          <i class="el-icon-menu"></i>公众号管理
        </el-menu-item>
        <el-menu-item index="1" @click="goView('/')">
          <i class="el-icon-menu"></i>小程序管理
        </el-menu-item>
        <el-menu-item index="1" @click="goView('/')">
          <i class="el-icon-menu"></i>系统管理
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>
<script>
import _ from 'lodash'
export default {
  name: 'nav-menu',
  data () {
    return {
      activeIndex: '1-1'
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    goView: function (path) {
      this.$router.push({
        path: path
      })
    }
  },
  created: function () {
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-menu-nav {
  min-height: 100%;

  padding-bottom: 50px;
}

.nav-logo {
  text-align: center;
  padding: 20px 0;
  background: #fff;
  /* border: 1px solid #324157; */
}
.title-badge {
  line-height: 1;
}
.nav-menu-c-box::-webkit-scrollbar {
  width: 0;
}
</style>
