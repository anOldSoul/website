<template>
  <div class="page-content">
    <div class="btn-wrap">
      <el-button type="primary" size="small" @click="putData" v-if="!isAdd">保存</el-button>
      <el-button type="primary" size="small" @click="postData" v-if="isAdd">新增</el-button>
      <el-button type="danger" size="small" @click="handleDelete">删除</el-button>
      <el-button size="small" @click="$router.back()">返回</el-button>
    </div>
    <el-card class="page-content">
      <el-row>
        <el-col :span="3">公寓名称</el-col>
        <el-col :span="15">
          <el-input v-model="formData.apartmentname" placeholder="请输入网关名称"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">详细地址</el-col>
        <el-col :span="15">
          <el-input v-model="formData.apartmentaddr" placeholder="请输入网关名称"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">总楼层</el-col>
        <el-col :span="15">
          <el-input v-model="formData.floor" placeholder="请输入网关位置"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">每层房间数</el-col>
        <el-col :span="15">
          <el-input v-model="formData.floorrooms" placeholder="请输入网关位置"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">房间号前缀</el-col>
        <el-col :span="15">
          <el-input v-model="formData.roomsnum" placeholder="请输入网关位置"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">管理员</el-col>
        <el-col :span="15">
          <el-input v-model="formData.manager" placeholder="请输入网关位置"></el-input>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'detail',
  components: {
  },
  data () {
    return {
      formData: {
        gateid: '',
        gatewayname: '',
        gateaddr: ''
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
    handleDelete () {
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        Site.http.delete(`/admin/tLockRentuser/delete/${this.curId}`, {
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
      Site.http.get(`/admin/tLockRentuser/${this.curId}`, {}, data => {
        this.formData = data.data
      })
    },
    putData () {
      Site.http.put(`/admin/tLockRentuser/${this.curId}`, this.formData, data => {
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
      Site.http.post('/admin/tLockRentuser', this.formData, data => {
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
  margin-top: 20px;
}
.el-row,
.trace {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>