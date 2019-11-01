<template>
	<div class="page-content">
		<div class="btn-wrap">
		  <el-button type="primary" size="small" @click="handleSave">保存</el-button>
		  <el-button size="small" @click="$router.back()">返回</el-button>
		</div>
		<el-card class="page-content">
      <el-row>
        <el-col :span="3">锁具编号</el-col>
        <el-col :span="10">{{formData.lockid}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="3">锁具名称</el-col>
        <el-col :span="10">
          <el-input v-model="formData.lockname" placeholder="请输入锁具名称"></el-input>
        </el-col>
      </el-row>
		  <el-row>
		    <el-col :span="3">锁具位置</el-col>
		    <el-col :span="10">
		    	<el-input v-model="formData.lockaddr" placeholder="锁具位置"></el-input>
		    </el-col>
		  </el-row>
      <el-row>
        <el-col :span="3">网关编号</el-col>
        <el-col :span="10">{{formData.gateid}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="3">网关位置</el-col>
        <el-col :span="10">{{formData.gateaddr}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="3">绑定状态</el-col>
        <el-col :span="10">{{bindStr[formData.bindingstat]}}</el-col>
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
      bindStr: {
        '1': '锁具与网关已绑定',
        '0': '锁具与网关已解绑'
      },
      formData: {
      },
      countries: []
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
    gateId () {
      return this.$route.params.gateid || ''
    },
  	isAdd () {
  	  return this.curId === 'add'
  	}
  },
  methods: {
    getData () {
      let populate = []
      Site.http.get(`/admin/tLockInfo/${this.curId}/${this.gateId}`, {}, data => {
        this.formData = data.data
      })
    },
    handleSave() {
      this.patchData()
    },
    patchData () {
      this.formData.lockId = (this.formData.lockid).toString()
      Site.http.patch('/tLockInfo/updateLock', this.formData, data => {
        if (data.errno === 0) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.$router.back()
        }
      })
    }
  },
  mounted: function () {
    this.getData()
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