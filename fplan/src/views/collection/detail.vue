<template>
  <div class="page-content">
    <div class="btn-wrap">
      <el-button v-if="!isAdd" type="primary" size="small" @click="putData">保存</el-button>
      <el-button v-if="isAdd" type="primary" size="small" @click="postData">新增</el-button>
      <el-button v-if="!isAdd" type="danger" size="small" @click="handleDelete">删除</el-button>
      <el-button size="small" @click="$router.back()">返回</el-button>
    </div>
    <el-card class="page-content">
      <div slot="header" class="clearfix">
        <span class="headerTitle">采集器信息</span>
      </div>
      <el-row>
        <el-col :span="3">设备名称</el-col>
        <el-col :span="7">
          <el-input v-model="formData.collName" clearable placeholder="请输入设备名称"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">设备编号</el-col>
        <el-col :span="7">
          <el-input v-model="formData.collId" disabled clearable placeholder="请输入设备编号"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">授权公寓</el-col>
        <el-col :span="5">
          <el-select v-model="formData.apartid" clearable placeholder="请选择公寓">
            <el-option v-for="item in arpartments" :label="item.apartmentname" :value="item.apartmentid" :key="item.apartmentid"/>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">采集器登录账号</el-col>
        <el-col :span="7">
          <el-input v-model="formData.collUserid" disabled clearable placeholder="请输入设备编号"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">采集器密码</el-col>
        <el-col :span="7">
          <el-input v-model="formData.collPwd" :maxlength="6" clearable placeholder="请输入设备编号"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">采集器状态</el-col>
        <el-col :span="5">
          <el-select v-model="formData.stat" clearable placeholder="请选择">
            <el-option label="正常" value="0" />
            <el-option label="停用" value="1" />
          </el-select>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'Detail',
  components: {
  },
  data() {
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
        '04': 16
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
  computed: {
    curId() {
      return this.$route.params.id || ''
    },
    isAdd() {
      return this.curId === 'add'
    },
    gateId() {
      return this.$route.params.gateid || ''
    }
  },
  created: function() {
  },
  beforeRouteLeave: (to, from, next) => {
    next()
  },
  mounted: function() {
    this.getApartment()
    if (!this.isAdd) {
      this.getData()
    }
  },
  methods: {
    getApartment() {
      Site.http.post('/admin/apartmeninfo/queryByPage', {
        pageNo: 1,
        pageSize: 2000
      }, data => {
        this.arpartments = data.data.list
      })
    },
    handleOpenAddPw() {
      this.dialogTableVisible = true
      this.form = {}
    },
    handleAddPw() {
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
    handleAdd(row) {
      this.formData.lockInfo.push(row)
      this.dialogTableVisible = false
    },
    handleDelete() {
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          Site.http.delete(`/admin/tCollectorInfo/${this.curId}`, {
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
    handleOnContentChange(q, html, text) {
      this.formData.richText = html
      this.formData.text = text
    },
    getData() {
      Site.http.get(`/admin/tCollectorInfo/${this.curId}`, {}, data => {
        if (data.data) {
          this.formData = data.data
          this.formData.apartid = Number(data.data.apartid)
        }
      })
    },
    putData() {
      console.log(this.formData)
      Site.http.put(`/admin/tCollectorInfo/${this.curId}`, this.formData, data => {
        if (data.errno === 0) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.$router.back()
        }
      })
    },
    postData() {
      Site.http.post('/admin/tCollectorInfo', this.formData, data => {
        if (data.errno === 0) {
          this.$message({
            message: '新增成功',
            type: 'success'
          })
          this.$router.back()
        }
      })
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
