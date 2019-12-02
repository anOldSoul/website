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
        <span class="headerTitle">门锁信息</span>
      </div>
      <el-row>
        <el-col :span="3">设备名称</el-col>
        <el-col :span="7">
          <el-input v-model="formData.lockname" clearable placeholder="请输入设备名称"></el-input>
        </el-col>
        <el-col :span="3" :push="1">绑定网关</el-col>
        <el-col :span="8" :push="1">
          <el-input disabled v-model="formData.gateid" clearable placeholder="请输入绑定网关"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">设备编号</el-col>
        <el-col :span="7">
          <el-input disabled v-model="formData.lockid" clearable placeholder="请输入设备编号"></el-input>
        </el-col>
        <el-col :span="3" :push="1">设备位置</el-col>
        <el-col :span="8" :push="1">
          <el-input v-model="formData.lockaddr" clearable placeholder="请输入设备位置"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">授权公寓</el-col>
        <el-col :span="5">
          <el-select v-model="formData.rsv1" @change="onchangeDepart" clearable placeholder="请选择公寓">
            <el-option :label="item.apartmentname" :value="item.apartmentid" v-for="item in arpartments" :key="item.apartmentid"></el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-select v-model="formData.roomid" filterable clearable placeholder="请选择授权房间">
            <el-option :label="item.roomname" :value="item.roomid" v-for="item in rooms" :key="item.roomid"></el-option>
          </el-select>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="page-content">
      <div slot="header" class="clearfix">
        <span class="headerTitle">密钥管理</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="handleOpenAddPw">新增+</el-button>
      </div>
      <el-table :data="formData.tUseInfoList" style="width: 100%" :row-key="rowKey">
        <el-table-column prop="pwtype" label="密码类型">
          <template slot-scope="scope">{{pwtypeStr[scope.row.pwtype]}}
          </template>
        </el-table-column>
        <el-table-column prop="usertype" label="用户类型">
          <template slot-scope="scope">{{scope.row.usertype === '00' ? '普通用户' : '管理员'}}
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column label="有效时间" min-width="120">
          <template slot-scope="scope">{{validStr[scope.row.validate] || '——'}}
          </template>
        </el-table-column>
        <el-table-column prop="changetype" label="状态">
          <template slot-scope="scope"><span :style="{'color': scope.row.changetype === '3' ? 'red' : 'green'}">{{changetypeStr[scope.row.changetype]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="pwd" label="密码/卡号" min-width="120">
        </el-table-column>
        <el-table-column prop="registtime" label="创建时间" min-width="120">
          <template slot-scope="scope">{{scope.row.registtime ? $moment(scope.row.registtime, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss') : ''}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" class-name="cell-cneter" fixed="right">
          <template slot-scope="scope">
            <div class="opertion">              
              <el-button type="primary" size="mini" v-if="scope.row.pwtype !== '01'" @click="handlePwStats(scope.row)" :disabled="scope.row.changetype !== '1' && scope.row.changetype !== '3'">
                {{scope.row.changetype === '1' ? '禁用' : (scope.row.changetype === '3' ? '启用' : changetypeStr[scope.row.changetype])}}
              </el-button>
              <el-button type="danger" size="mini" @click="handleDelPw(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="新增密钥" :visible.sync="dialogTableVisible">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" auto-complete="off" class="dialog-input"></el-input>
        </el-form-item>
        <el-form-item label="用户类型" :label-width="formLabelWidth">
          <el-select v-model="form.usertype" placeholder="请选择用户类型">
            <el-option label="普通用户" value="00"></el-option>
            <el-option label="管理员" value="01"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密码类型" :label-width="formLabelWidth">
          <el-select v-model="form.pwtype" placeholder="请选择密码类型">
            <el-option label="密码用户" value="00"></el-option>
            <el-option label="临时密码" value="01"></el-option>
            <el-option label="卡片用户" value="02"></el-option>
            <el-option label="指纹用户" value="03"></el-option>
            <el-option label="身份证用户" value="04"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="form.pwtype === '03' ? '卡号' : '密码'" :label-width="formLabelWidth" v-if="form.pwtype !== '03'">
          <el-input v-model="form.pwd" clearable :maxlength="pwtypeLengthStr[form.pwtype]" class="dialog-input"></el-input> 
          <span v-if="form.pwtype">*长度必须为{{pwtypeLengthStr[form.pwtype]}}位</span>
        </el-form-item>
        <el-form-item label="时限" :label-width="formLabelWidth" v-if="form.pwtype === '01'">
          <el-select v-model="form.validate" placeholder="请选择时限">
            <el-option label="3分钟" value="00"></el-option>
            <el-option label="30分钟" value="01"></el-option>
            <el-option label="4小时" value="02"></el-option>
            <el-option label="24小时" value="03"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddPw">确 定</el-button>
      </div>
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
      rooms: [],
      arpartments: [],
      changetypeStr: {
        '0': '启用中',
        '1': '已启用',
        '2': '禁用中',
        '3': '已失效'
      },
      validStr: {
        '00': '3分钟',
        '01': '30分钟',
        '02': '4小时',
        '03': '24小时'
      },
      pwtypeStr: {
        '00': '密码用户',
        '01': '临时密码',
        '02': '卡片用户',
        '03': '指纹用户',
        '04': '身份证用户'
      },
      pwtypeLengthStr: {
        '00': 6,
        '01': 6,
        '02': 8,
        '04': 16,
      },
      formLabelWidth: '120px',
      form: {
      },
      dialogTableVisible: false,
      gridData: [],
      formData: {
        tUseInfoList: []
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
    },
    gateId () {
      return this.$route.params.gateid || ''
    }
  },
  methods: {
    onchangeDepart () {
      this.formData.roomid = ''
      this.getRoom()
    },
    getRoom () {
      let data = {
        apartmentid: this.formData.rsv1
      }
      Site.http.get('/admin/tRoomInfo/queryByApart', data, data => {
        this.rooms = data.data
      })
    },
    getApartment () {
      Site.http.post('/admin/apartmeninfo/queryByPage', {
        pageNo: 1,
        pageSize: 2000
      }, data => {
        this.arpartments = data.data.list
      })
    },
    handleOpenAddPw () {
      this.dialogTableVisible = true
      this.form = {}
    },
    handleDelPw (row) {
      this.$confirm('确认删除该密码？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        Site.http.delete(`/admin/tUserInfo/${row.id}`, {
        }, data => {
          if (data.errno === 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          }
          this.getData()
        })
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handlePwStats (row) {
      row.changetype = row.changetype === '1' ? '2' : '0'
      Site.http.put(`/admin/tUserInfo/${row.id}`, row, data => {
        if (data.errno === 0) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.getData()
        }
      })
    },
    handleAddPw () {
      if (!this.form.username) {
        this.$message({
          message: '请输入用户名',
          type: 'warning'
        })
        return
      }
      if (!this.form.usertype) {
        this.$message({
          message: '请选择用户类型',
          type: 'warning'
        })
        return
      }
      if (!this.form.pwtype) {
        this.$message({
          message: '请选择密码类型',
          type: 'warning'
        })
        return
      }
      if (this.form.pwd && this.form.pwd.length !== this.pwtypeLengthStr[this.form.pwtype]) {
        this.$message({
          message: '密码长度不正确',
          type: 'warning'
        })
        return
      }
      this.form.pwd = this.form.pwd || '888888'
      this.form.lockid = this.curId
      this.form.rsv1 = this.formData.gateid
      this.form.changetype = '0'
      Site.http.post('/admin/tUserInfo', this.form, data => {
        if (data.errno === 0) {
          this.$message({
            message: '新增成功',
            type: 'success'
          })
          this.getData()
          this.dialogTableVisible = false
        }
      })
    },
    handleGoDetail () {
      this.$router.push({
        path: `department/detail/add`
      })
    },
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
        Site.http.delete(`/admin/tLockInfo/${this.curId}`, {
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
    getData () {
      Site.http.get(`/admin/tLockInfo/${this.curId}/${this.gateId}`, {}, data => {
        if (data.data) {
          this.formData = data.data
          this.formData.tUseInfoList = this.formData.tUseInfoList.reverse()
          this.formData.rsv1 = Number(this.formData.rsv1)
          if (this.formData.roomid) {
          this.formData.roomid = Number(this.formData.roomid)
            this.getRoom()
          }
        }        
      })
    },
    putData () {
      console.log(this.formData)
      Site.http.put(`/admin/tLockInfo/${this.curId}/${this.gateId}`, this.formData, data => {
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
      Site.http.post('/admin/tLockInfo', this.formData, data => {
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
    this.getApartment ()
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
.dialog-input{
  width: 300px;
}
.opertion {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
</style>