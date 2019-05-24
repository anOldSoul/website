<template>
  <div class="page">
    <div class="btn-wrap">
      <el-button type="primary" size="small" @click="dialogFormVisible = true">新增</el-button>
      <el-button size="small" @click="$router.back()">返回</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" :row-key="rowKey">
      <el-table-column prop="countryRef.name" label="密码"></el-table-column>
      <el-table-column prop="title" label="密码类型"></el-table-column>
      <el-table-column prop="title" label="申请时间"></el-table-column>
      <el-table-column prop="title" label="下发时间"></el-table-column>
      <el-table-column prop="title" label="下发状态"></el-table-column>
      <el-table-column label="操作" width="160" class-name="cell-cneter" fixed="right">
        <template slot-scope="scope">
          <template>
            <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange" :current-page="searchModel.pageNo" :page-size="20" layout="total, prev, pager, next" :total="dataCount" class="flex pagination">
    </el-pagination>
    <el-dialog title="新增密码" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码类型" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
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
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      dialogFormVisible: false,
      formLabelWidth: '120px',
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
    addPassword() {

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
