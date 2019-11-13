<template>
  <div class="page-content">
    <div class="btn-wrap">
      <el-button type="primary" size="small" @click="putData" v-if="!isAdd">保存</el-button>
      <el-button type="primary" size="small" @click="postData" v-if="isAdd">新增</el-button>
      <el-button type="danger" size="small" @click="handleDelete" v-if="!isAdd">删除</el-button>
      <el-button size="small" @click="$router.back()">返回</el-button>
    </div>
    <el-card class="page-content">
      <div slot="header" class="clearfix">
        <span class="headerTitle">房间信息</span>
      </div>
      <el-row>
        <el-col :span="2">公寓名称</el-col>
        <el-col :span="5">
          <el-select v-model="formData.apartmentid" placeholder="请选择公寓">
            <el-option :label="apart.apartmentname" :value="apart.apartmentid" v-for="apart in apartments" :key="apart.apartmentid"></el-option>
          </el-select>
        </el-col> 
        <el-col :span="2" :push="1">房间地址</el-col>
        <el-col :span="13" :push="1">
          <el-input type="textarea" v-model="formData.roomaddr"></el-input>
        </el-col>        
      </el-row>
      <el-row>
        <el-col :span="2">房间号</el-col>
        <el-col :span="5">
          <el-input v-model="formData.roomname" placeholder="请输入房间号"></el-input>
        </el-col>
        <el-col :span="2" :push="1">管理员</el-col>
        <el-col :span="5" :push="1">
          <el-input v-model="formData.manager" placeholder="请输入管理员"></el-input>
        </el-col>
        <el-col :span="2" :push="2">所在楼层</el-col>
        <el-col :span="5" :push="2">
          <el-input v-model="formData.floor" placeholder="请输入所在楼层"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2">房间状态</el-col>
        <el-col :span="5">
          <el-select v-model="formData.roomstat" placeholder="请选择房间状态">
            <el-option label="入住" value="02"></el-option>
            <el-option label="空置" value="03"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row v-if="formData.roomstat === '02'">
        <el-col :span="2">租户名</el-col>
        <el-col :span="5">
          <el-input class="dialog-input" v-model="formData.rentname" auto-complete="off"></el-input>
        </el-col>
        <el-col :span="2" :push="1">开始时间</el-col>
        <el-col :span="5" :push="1">
          <el-date-picker v-model="formData.begintime" type="date" placeholder="选择日期"></el-date-picker>
        </el-col>
        <el-col :span="2" :push="2">结束时间</el-col>
        <el-col :span="5" :push="2">
          <el-date-picker v-model="formData.endtime" type="date" placeholder="选择日期"></el-date-picker>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="page-content" style="margin-bottom: 100px !important;">
      <div slot="header" class="clearfix">
        <span class="headerTitle">房间设备</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="handleAddDevice">新增+</el-button>
      </div>
      <el-col :span="6" v-for="(device, deviceIndex) in formData.lockInfo" :key="o" :offset="index > 0 ? 2 : 0">
        <el-card :body-style="{ padding: '0px' }" class="deviceItem">
          <img src="../../assets/pic-lock.png" class="image">
          <div style="padding: 14px;">
            <el-tooltip class="item" effect="dark" :content="device.lockname" placement="top-start">
              <div class="lockname">{{device.lockname.length > 6 ? device.lockname.substring(0, 6) + '...' : device.lockname}}<el-button type="text" class="button" @click="delDevice(deviceIndex)">删除</el-button></div>
            </el-tooltip>            
            <div class="bottom clearfix">
              <div class="propertie">电量：<span :style="{ color: device.electricity > 30 ? 'green' : 'red'}">{{ device.electricity || 0 }}%</span></div>
              <div class="propertie">连网状态：<span :style="{ color: device.connetnstat === '1' ? 'green' : 'red'}">{{device.connetnstat === '1' ? '已连接' : '断开'}}</span></div>
              <!-- <div class="propertie">闭合状态：{{device.closestat === '1' ? '已闭合' : '未闭合'}}</div> -->
              <div class="propertie">故障情况：<span :style="{ color: device.faultstat === '1' ? 'red' : 'green'}">{{device.faultstat === '1' ? '有故障' : '无故障'}}</span></div>              
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
      apartments: [],
      dialogTableVisible: false,
      gridData: [],
      formData: {
        apartmentid: '',
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
    apartmentid () {
      return this.$route.params.apartmentid || ''
    },
    isAdd () {
      return this.curId === 'add'
    }
  },
  methods: {
    getApartment () {
      Site.http.post('/admin/apartmeninfo/queryByPage', {
        pageNo: 1,
        pageSize: 2000
      }, data => {
        this.apartments = data.data.list
        this.formData.apartmentid = Number(this.apartmentid)
      })
    },
    delDevice (index) {
      this.formData.lockInfo.splice(index, 1)
    },
    handleAdd (row) {
      if (this.formData.lockInfo.length && row.lockid === this.formData.lockInfo[0].lockid) {
        this.$message({
          message: '该设备已有,不可重复添加',
          type: 'warning'
        })
        return
      }
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
      if (this.formData.lockInfo.length === 2 && this.formData.lockInfo[1]) {
        this.$message({
          message: '该房间已有两台设备,不可继续添加',
          type: 'warning'
        })
        return
      }
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
          this.formData.lockInfo = data.data.lockInfo || []
          this.formData.lockInfo.forEach((item, index) => {
            if (!item) {
              this.formData.lockInfo.splice(index, 1)
            }
          })
        }
      })
    },
    putData () {
      if (this.formData.lockInfo.length) {
        this.formData.lockid1 = this.formData.lockInfo[0].lockid
        this.formData.lockid3 = this.formData.lockInfo[0].gateid
      }
      if (this.formData.lockInfo.length === 2) {
        this.formData.lockid2 = this.formData.lockInfo[1].lockid
      }
      this.formData.lockInfo.forEach((item, index) => {
        delete item.tUseInfoList
        delete item.tUserchangeTxninfoList
      })
      // this.formData.lockInfo = ''
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
      this.formData.begintime = this.$moment(this.formData.begintime).format('YYYY-MM-DD')
      this.formData.endtime = this.$moment(this.formData.endtime).format('YYYY-MM-DD')
      this.formData.apartmentid = this.apartmentid
      if (this.formData.lockInfo.length) {
        this.formData.lockid1 = this.formData.lockInfo[0].lockid
        this.formData.lockid3 = this.formData.lockInfo[0].gateid
      }
      if (this.formData.lockInfo.length === 2) {
        this.formData.lockid2 = this.formData.lockInfo[1].lockid
      }
      this.formData.lockInfo.forEach((item, index) => {
        delete item.tUseInfoList
        delete item.tUserchangeTxninfoList
      })
      Site.http.post('/admin/tRoomInfo', this.formData, data => {
        if (data.data) {
          this.$message({
            message: '新增成功',
            type: 'success'
          })
          this.$router.back()
        }
      })
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
    this.getApartment()
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
  /*justify-content: center;*/
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