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
          <el-input v-model="formData.lockname" placeholder="请输入设备名称"></el-input>
        </el-col>
        <el-col :span="3" :push="1">绑定网关</el-col>
        <el-col :span="8" :push="1">
          <el-input v-model="formData.gateid" placeholder="请输入绑定网关"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">设备编号</el-col>
        <el-col :span="7">
          <el-input v-model="formData.lockid" placeholder="请输入设备编号"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">绑定房间</el-col>
        <el-col :span="7">
          <el-input v-model="formData.roomid" placeholder="请输入绑定房间"></el-input>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="page-content">
      <div slot="header" class="clearfix">
        <span class="headerTitle">密钥管理</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="dialogTableVisible = true">新增+</el-button>
      </div>
      <el-table :data="formData.tUseInfoList" style="width: 100%" :row-key="rowKey">
        <el-table-column prop="pwtype" label="密码类型">
          <template slot-scope="scope">{{scope.row.pwtype === '00' ? '密码用户' : (scope.row.pwtype === '01' ? '临时密码' : '指纹密码')}}
          </template>
        </el-table-column>
        <el-table-column prop="usertype" label="用户类型">
          <template slot-scope="scope">{{scope.row.usertype === '00' ? '普通用户' : '管理员'}}
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="validate" label="有效时间"></el-table-column>
        <el-table-column prop="gateid" label="添加源"></el-table-column>
        <el-table-column prop="gateid" label="状态"></el-table-column>
        <el-table-column prop="registtime" label="创建时间" min-width="120">
          <template slot-scope="scope">{{scope.row.registtime ? $moment(scope.row.registtime, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss') : ''}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" class-name="cell-cneter" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handlePwStats(scope.row)">{{scope.row.disstatus === '2' ? '禁用' : '启用'}}</el-button>
            <el-button type="text" @click="handleDelPw(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="添加密码" :visible.sync="dialogTableVisible">
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
            <el-option label="指纹用户" value="02"></el-option>
            <el-option label="卡片用户" value="03"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="form.pwtype === '03' ? '卡号' : '密码'" :label-width="formLabelWidth">
          <el-input v-model="form.pwd" auto-complete="off" class="dialog-input"></el-input>
        </el-form-item>
        <el-form-item label="时限" :label-width="formLabelWidth">
          <el-input v-model="form.validate" auto-complete="off" class="dialog-input"></el-input>
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
      row.disstatus = row.disstatus === '1' ? '2' : '1'
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
      this.form.rsv1 = '0'
      this.form.pwd = this.form.pwd || '888888'
      this.form.lockid = this.curId
      this.form.rsv1 = this.formData.gateid
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
</style>