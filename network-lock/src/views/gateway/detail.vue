<template>
	<div class="page-content">
		<div class="btn-wrap">
      <el-button type="primary" size="small" @click="putData" v-if="!isAdd">保存</el-button>
      <el-button type="primary" size="small" @click="postData" v-if="isAdd">新增</el-button>
		  <el-button size="small" @click="$router.back()">返回</el-button>
		</div>
		<el-card class="page-content">
		  <el-row>
		    <el-col :span="3">网关编号</el-col>
		    <el-col :span="15">
          <el-input v-model="formData.gateid" disabled placeholder="请输入网关编号"></el-input>
		    </el-col>
		  </el-row>
		  <el-row>
		    <el-col :span="3">网关名称</el-col>
		    <el-col :span="15">
		    	<el-input v-model="formData.gatewayname" placeholder="请输入网关名称"></el-input>
		    </el-col>
		  </el-row>
      <el-row>
        <el-col :span="3">网关位置</el-col>
        <el-col :span="15">
          <el-input v-model="formData.gateaddr" placeholder="请输入网关位置"></el-input>
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
  	handleOnContentChange (q, html, text) {
  	  this.formData.richText = html
  	  this.formData.text = text
  	},
    getData () {
      let populate = []
      Site.http.get(`/admin/tGatewayInfo/${this.curId}`, {
      }, data => {
        this.formData = data.data
      })
    },
    postData () {
      Site.http.put(`/admin/tGatewayInfo/${this.curId}`, this.formData, data => {
        if (data.errno === 0) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.$router.back()
        }
      })
    },
    putData () {
      Site.http.put(`/admin/tGatewayInfo/${this.curId}`, this.formData, data => {
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