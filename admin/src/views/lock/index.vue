<template>
  <div class="page">
    <div class="btn-wrap">
    </div>
    <div class="flex search-box">
      <el-form class="form" label-width="86px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="名称">
              <el-input v-model="searchModel.no" @change="handleSearchChange"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="编号">
              <el-input v-model="searchModel.no" @change="handleSearchChange"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="绑定网关">
              <el-select v-model="searchModel.countryRef" filterable clearable @change="handleSearchChange">
                <el-option v-for="country in countries" :key="country._id" :label="country.name" :value="country._id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="绑定状态">
              <el-select v-model="searchModel.countryRef" filterable clearable @change="handleSearchChange">
                <el-option v-for="country in countries" :key="country._id" :label="country.name" :value="country._id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="tableData" style="width: 100%" :row-key="rowKey">
      <el-table-column prop="countryRef.name" label="网关名称"></el-table-column>
      <el-table-column prop="title" label="网关编号"></el-table-column>
      <el-table-column prop="title" label="网关位置"></el-table-column>
      <el-table-column prop="title" label="绑定数量"></el-table-column>
      <el-table-column label="操作" width="160" class-name="cell-cneter" fixed="right">
        <template slot-scope="scope">
          <template>
            <el-button type="text" @click="handleGoDetail(scope.row)">详情</el-button>
            <el-button type="text" @click="handleGoPassword(scope.row)">密码</el-button>
            <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange" :current-page="searchModel.pageNo" :page-size="20" layout="total, prev, pager, next" :total="dataCount" class="flex pagination">
    </el-pagination>
  </div>
</template>
<script>
export default {
  name: 'provisions-list',
  components: {
  },
  props: {
  },
  activated () {
    this.fetchData()
    this.getCount()
  },
  data () {
    return {
      tableData: [], // 必须
      dataCount: 0, // 必须
      searchModel: {
        pageNo: 1, // 必须
        pageSize: 20, // 必须
        countryRef: ''
      },
      countries: [],
      query: {}
    }
  },
  computed: {},

  methods: {
    handleGoPassword () {
      this.$router.push({
        path: `/lock/password`
      })
    },
    handleDelete (row) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        Site.http.delete('/rest/provisions/' + row._id, {}, result => {
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          })
          this.fetchData()
          this.getCount()
        })
      }).catch(() => { })
    },
    handleCurrentChange (val) {
      this.searchModel.pageNo = +val
      this.fetchData()
    },
    fetchData: function () {
      let populate = ['countryRef']
      let pageSize = this.searchModel.pageSize

      let skip = (this.searchModel.pageNo - 1) * pageSize
      Site.http.get(
        '/rest/provisions', {
          skip: skip,
          limit: pageSize,
          populate: populate,
          query: JSON.stringify(this.query)
        },
        data => {
          this.tableData = data
        }
      )
    },
    fetchCountries() {
      Site.http.get(
        '/rest/countries', {},
        data => {
          this.countries = data
        }
      )
    },
    getCount () {
      Site.http.get(
        '/rest/provisions/count', {
          query: JSON.stringify(this.query)
        },
        function (data) {
          this.dataCount = data.count
        }.bind(this)
      )
    },
    handleGoDetail: function (row) {
      this.$router.push({
        path: `/lock/detail/${row._id}`
      })
    },
    rowKey (row) {
      return row._id
    },
    handleSearchChange () {
      this.searchModel.pageNo = 1
      let query = {}
      let searchModel = this.searchModel
      if (searchModel.countryRef) {
        query.countryRef = searchModel.countryRef
      }
      this.searchModel.pageNo = 1
      this.query = query
      this.fetchData()
      this.getCount()
    }
  },
  mounted: function () {
    this.fetchCountries()
  }
}
</script>
<style scoped>
.form {
  width: 80%;
}
.noticeContent{
  padding: 30px;
}
</style>
