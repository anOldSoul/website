<template>
  <div class="page-content">
    <div class="btn-wrap">
      <el-button type="primary" size="small" @click="putData" v-if="!isAdd">保存</el-button>
      <el-button type="primary" size="small" @click="postData" v-if="isAdd">新增</el-button>
      <el-button type="danger" size="small" @click="handleDelete">删除</el-button>
      <el-button size="small" @click="$router.back()">返回</el-button>
    </div>
    <el-card class="page-content">
      <div slot="header" class="clearfix">
        <span class="headerTitle">房间信息</span>
      </div>
      <el-row>
        <el-col :span="3">房间号</el-col>
        <el-col :span="15">
          <el-input v-model="formData.roomname" placeholder="请输入房间号"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">管理员</el-col>
        <el-col :span="15">
          <el-input v-model="formData.manager" placeholder="请输入管理员"></el-input>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="page-content">
      <div slot="header" class="clearfix">
        <span class="headerTitle">房间设备</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="handleAddDevice">新增+</el-button>
      </div>
      <el-col :span="6" v-for="(device, deviceIndex) in formData.lockInfo" :key="o" :offset="index > 0 ? 2 : 0">
        <el-card :body-style="{ padding: '0px' }" class="deviceItem">
          <img src="../../assets/pic-lock.png" class="image">
          <div style="padding: 14px;">
            <div class="lockname">{{device.lockname}}<el-button type="text" class="button">删除</el-button></div>
            <div class="bottom clearfix">
              <div class="propertie">电量：{{ device.electricity }}</div>
              <div class="propertie">连网状态：{{device.connetnstat === '1' ? '已连接' : '断开'}}</div>
              <div class="propertie">闭合状态：{{device.closestat === '1' ? '已闭合' : '未闭合'}}</div>
              <div class="propertie">故障情况：{{device.faultstat === '1' ? '有故障' : '无故障'}}</div>              
            </div>
          </div>
        </el-card>
      </el-col>
    </el-card>
    <el-dialog title="请选择要添加的设备" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column property="lockname" label="设备名称" width="150"></el-table-column>
        <el-table-column property="gateid" label="绑定网关" width="200"></el-table-column>
        <el-table-column property="electricity" label="电量"></el-table-column>
        <el-table-column label="操作" width="160" class-name="cell-cneter" fixed="right">
          <template slot-scope="scope">
            <template>
              <el-button type="text" @click="handleAdd(scope.row)">添加</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'detail',
  components: {
  },
  data () {
    return {
      dialogTableVisible: false,
      gridData: [],
      formData: {
        roomname: '',
        manager: '',
        lockInfo: []
      }
    }
  },
  created: function () {
  },
  beforeRouteLeave: (to, from, next) => {
    next()
  },
  computed: {
    curId () {
      return this.$route.params.id || ''
    },
    isAdd () {
      return this.curId === 'add'
    }
  },
  methods: {
    handleAdd (row) {
      this.formData.lockInfo.push(row)
      this.dialogTableVisible = false
    },
    handleDelete () {
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        Site.http.delete(`/admin/tRoomInfo/${this.curId}`, {
        }, data => {
          if (data.errno === 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.$router.back()
          }
        })
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleOnContentChange (q, html, text) {
      this.formData.richText = html
      this.formData.text = text
    },
    handleAddDevice () {
      this.dialogTableVisible = true
      this.getDevice()
    },
    getDevice () {
      Site.http.post(
        '/admin/tLockInfo/queryByPage', {
          pageNo: 1, // 必须
          pageSize: 20, // 必须
        },
        data => {
          this.gridData = data.data.list
        }
      )
    },
    getData () {
      Site.http.get(`/admin/tRoomInfo/${this.curId}`, {}, data => {
        if (data.data) {
          this.formData = data.data
        }        
      })
    },
    putData () {
      console.log(this.formData)
      Site.http.put(`/admin/tRoomInfo/${this.curId}`, this.formData, data => {
        if (data.errno === 0) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.$router.back()
        }
      })
    },
    postData () {
      Site.http.post('/admin/tRoomInfo', this.formData, data => {
        if (data.errno === 0) {
          this.$message({
            message: '新增成功',
            type: 'success'
          })
          this.$router.back()
        }
      })
    }
  },
  mounted: function () {
    if (!this.isAdd) {
      this.getData()

    }   
  }
}
</script>
<style scoped>
.page-content {
  width: 100%;
  padding: 30px 30px;
  margin-bottom: 20px;
}
.el-row,
.trace {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.button {
    padding: 0;
    float: right;
  }

.image {
  width: 100%;
  display: block;
}
.lockname {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  line-height: 1;
}
.deviceItem {
  margin-top: 20px;
  margin-right: 20px;
}
.propertie {
  font-size: 14px;
  line-height: 1.5;
}
.headerTitle {
  font-weight: bold;
  font-size: 24px;
}
</style>