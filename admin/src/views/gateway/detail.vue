<template>
	<div class="page-content">
		<div class="btn-wrap">
		  <el-button type="primary" size="small" @click="handleSave">保存</el-button>
		  <el-button size="small" @click="$router.back()">返回</el-button>
		</div>
		<el-card class="page-content">
		  <el-row>
		    <el-col :span="3">国家</el-col>
		    <el-col :span="5">
			    <el-select v-model="formData.countryRef" filterable clearable>
			      <el-option v-for="country in countries" :label="country.name" :value="country._id">
			      </el-option>
			    </el-select>
		    </el-col>
		  </el-row>
		  <el-row>
		    <el-col :span="3">标题</el-col>
		    <el-col :span="15">
		    	<el-input v-model="formData.title" placeholder="请输入标题"></el-input>
		    </el-col>
		  </el-row>
		  <el-row>
		    <el-col :span="3">内容</el-col>
		    <el-col :span="15">
		    	<editor :content="formData.richText" :tokenData="entity.uploadTokenData" @onChange="handleOnContentChange"></editor>
		    </el-col>
		  </el-row>
		</el-card>
	</div>
</template>
<script>
import Editor from '@/components/common/editor'
export default {
  name: 'detail',
  components: {
  	Editor
  },
  data () {
    return {
      formData: {
      	countryRef: '',
      	title: '',
      	richText: ''
      },
      countries: [],
      entity: {
        uploadTokenData: {}
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
  	getEntity () {
  	  Site.http.get('/biz/util/getUploadToken', {}, data => {
  	    this.entity.uploadTokenData = data
  	  })
  	},
  	handleOnContentChange (q, html, text) {
  	  this.formData.richText = html
  	  this.formData.text = text
  	},
  	fetchCountries() {
  	  Site.http.get(
  	    '/rest/countries', {},
  	    data => {
  	      this.countries = data
  	    }
  	  )
  	},
    getData () {
      let populate = []
      Site.http.get('/rest/provisions/' + this.$route.params.id, {
        populate: populate
      }, data => {
        this.formData = data
      })
    },
    postData () {
      Site.http.post('/rest/provisions', this.formData, data => {
        this.$router.back()
      })
    },
    handleSave() {
    	if (!this.isAdd) {
    		this.patchData()
    	} else {
    		this.postData()
    	}
    },
    patchData () {
      Site.http.patch('/rest/provisions/' + this.$route.params.id, this.formData, data => {
        this.getData()
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      })
    }
  },
  mounted: function () {
    this.getEntity()
	this.fetchCountries()
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
}
</style>