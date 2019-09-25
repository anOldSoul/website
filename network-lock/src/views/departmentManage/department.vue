<template>
  <div class="page fullH">
    <el-row :gutter="20" class="fullH">
      <el-col :span="7" class="fullH">
        <el-card class="fullH">
          <div slot="header" class="clearfix">
            <span>公寓</span>
            <el-button style="float: right; padding: 3px 0" type="text">添加</el-button>
          </div>
          <div>
            <el-input placeholder="请输入内容" v-model="input5" class="input-with-select">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            <div>{{'公寓 ' + o }}</div>
            <div><el-button type="text">编辑</el-button></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-tabs v-model="activeTab" @tab-click="handleClick">
          <el-tab-pane label="全部" name="first">
            <el-collapse v-model="activeName" accordion>
              <el-collapse-item :title="`楼层${floorIndex + 1}`" :name="floorIndex" v-for="(i, floorIndex) in 5" class="floor" :key="floorIndex">
                <el-card class="box-card" v-for="f in 5">
                  <div slot="header" class="clearfix">
                    <span>房间号</span>
                    <el-tooltip placement="bottom" effect="light">
                      <div slot="content">
                        <div><el-button type="text" class="edit-room">编辑房间</el-button></div>
                        <div><el-button type="text" class="edit-room">租客信息</el-button></div>
                        <div><el-button type="text" class="edit-room">转为待租</el-button></div>
                        <div><el-button type="text" class="edit-room">删除房间</el-button></div>
                      </div>
                      <el-button type="text" style="float: right; padding: 3px 0">...</el-button>
                    </el-tooltip>
                  </div>
                  <div>已租</div>
                  <div>到期：2020-01-01</div>
                </el-card>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="已租" name="second">已租</el-tab-pane>
          <el-tab-pane label="待租" name="third">待租</el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'Department',
  components: {
  },
  props: {
  },
  activated () {
  },
  data () {
    return {
      input5: '',
      select: '',
      activeName: 0,
      activeTab: 'first'
    }
  },
  computed: {},
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  },
  mounted: function () {
  }
}
</script>
<style scoped>
.fullH {
  height: 100%;
}
.box-card{
  width: 200px;
  margin: 10px;
}
.text.item{
  height: 50px;
  display: flex;
  flex-direction: flex;
  justify-content: space-between;
  align-items: center;
}
.page >>> .el-collapse-item__header{
  padding: 0 10px;
}
.page >>> .el-collapse-item__content{
  /*width: 100%;*/
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
