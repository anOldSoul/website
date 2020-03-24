<template>
  <div class="page-content">
    <div class="btn-wrap">
      <el-button v-if="!isAdd" type="primary" size="small" @click="putData">保存</el-button>
      <el-button v-if="isAdd" type="primary" size="small" @click="postData">新增</el-button>
      <el-button v-if="!isAdd" type="danger" size="small" @click="handleDelete">删除</el-button>
      <el-button size="small" @click="$router.back()">返回</el-button>
    </div>
    <el-card class="page-content">
      <el-row>
        <el-col :span="3">租户名</el-col>
        <el-col :span="15">
          <el-input v-model="formData.rentusername" placeholder="请输入租户名"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">性别</el-col>
        <el-col :span="15">
          <el-select v-model="formData.sex" clearable placeholder="请选择性别">
            <el-option label="男" value="1" />
            <el-option label="女" value="2" />
          </el-select>
        </el-col>
      </el-row>
      <!--       <el-row>
        <el-col :span="3">授权小程序</el-col>
        <el-col :span="15">
          <el-input v-model="formData.apartmentaddr" placeholder="请输入网关名称"></el-input>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="3">联系方式</el-col>
        <el-col :span="15">
          <el-input v-model="formData.renttel" placeholder="请输入联系方式"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">紧急联系方式</el-col>
        <el-col :span="15">
          <el-input v-model="formData.emergencytel" placeholder="请输入紧急联系方式"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">证件号码</el-col>
        <el-col :span="15">
          <el-input v-model="formData.certificateno" placeholder="请输入证件号码"/>
        </el-col>
      </el-row>
      <!--       <el-row>
        <el-col :span="3">证件上传</el-col>
        <el-col :span="15">
          <el-input v-model="formData.manager" placeholder="请输入网关位置"></el-input>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="3">入住时间</el-col>
        <el-col :span="15">
          <el-date-picker
            v-model="formData.checkintime"
            type="date"
            placeholder="选择日期"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">合同编号</el-col>
        <el-col :span="15">
          <el-input v-model="formData.contract" placeholder="请输入合同编号"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">授权公寓</el-col>
        <el-col :span="5">
          <el-select v-model="formData.apartmentid" clearable placeholder="请选择公寓" @change="onchangeDepart">
            <el-option v-for="item in arpartments" :label="item.apartmentname" :value="item.apartmentid" :key="item.apartmentid"/>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-select v-model="formData.checkinroomid" filterable clearable placeholder="请选择授权房间">
            <el-option v-for="item in rooms" :label="item.roomname" :value="item.roomid" :key="item.roomid"/>
          </el-select>
        </el-col>
      </el-row>
      <!--       <el-row>
        <el-col :span="3">合同上传</el-col>
        <el-col :span="15">
          <el-input v-model="formData.roomsnum" placeholder="请输入网关位置"></el-input>
        </el-col>
      </el-row> -->
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
      contract: '',
      apartmentid: '',
      rooms: [],
      arpartments: [],
      formData: {
        certificateno: '',
        emergencytel: '',
        renttel: '',
        rentusername: '',
        sex: '',
        checkintime: '',
        checkimroom: '',
        checkinroomid: '',
        apartmentid: '',
        rsv1: ''
      }
    }
  },
  computed: {
    curId() {
      return this.$route.params.id || ''
    },
    isAdd() {
      return this.curId === 'add'
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
    onchangeDepart() {
      this.formData.checkinroomid = ''
      this.getRoom()
    },
    getRoom() {
      const data = {
        apartmentid: this.formData.apartmentid
      }
      Site.http.get('/admin/tRoomInfo/queryByApart', data, data => {
        this.rooms = data.data
      })
    },
    getApartment() {
      Site.http.post('/admin/apartmeninfo/queryByPage', {
        pageNo: 1,
        pageSize: 2000
      }, data => {
        this.arpartments = data.data.list
      })
    },
    handleDelete() {
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          Site.http.delete(`/admin/tLockRentuser/${this.curId}`, {
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
      Site.http.get(`/admin/tLockRentuser/${this.curId}`, {}, data => {
        this.formData = data.data || {}
        this.formData.rsv1 = Number(this.formData.rsv1)
        if (this.formData.checkimroom) {
          this.formData.checkimroom = Number(this.formData.checkimroom)
          this.getRoom()
        }
        if (this.formData.checkintime) {
          this.formData.checkintime = this.$moment(this.formData.checkintime, 'YYYYMMDDhhmmss')
        }
      })
    },
    putData() {
      this.formData.rsv1 = 0
      this.formData.checkintime = this.$moment(this.formData.checkintime).format('YYYY-MM-DD')
      console.log(this.rooms)
      console.log(this.formData.checkinroomid)
      this.rooms.forEach((item, index) => {
        if (item.roomid === this.formData.checkinroomid) {
          this.formData.checkimroom = item.roomname.toString()
        }
      })
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
    postData() {
      this.formData.rsv1 = 0
      this.formData.checkintime = this.$moment(this.formData.checkintime).format('YYYY-MM-DD')
      console.log(this.rooms)
      console.log(this.checkinroomid)
      this.rooms.forEach((item, index) => {
        if (item.roomid === this.formData.checkinroomid) {
          this.formData.checkimroom = item.roomname.toString()
        }
      })
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
}
</style>
