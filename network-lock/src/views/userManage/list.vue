<template>
  <div class="page">
    <div class="btn-wrap">
      <el-button type="primary" size="small" @click="addStaff">新增 + </el-button>
    </div>
    <div class="flex search-box">
      <el-form class="form" label-width="86px">
        <el-row>
          <el-col :span="7">
            <el-form-item label="租户名">
              <el-input v-model="searchModel.rentusername" clearable @change="handleSearchChange"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="手机号">
              <el-input v-model="searchModel.renttel" clearable @change="handleSearchChange"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="授权房间">
              <el-input v-model="searchModel.checkimroom" clearable @change="handleSearchChange"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3" :push="2">
            <el-button type="primary" icon="el-icon-search" @click="handleSearchChange">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="tableData" style="width: 100%" :row-key="rowKey">
      <el-table-column prop="rentusername" label="租户名"></el-table-column>
      <el-table-column prop="renttel" label="手机号"></el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">{{scope.row.sex === '1' ? '男' : '女'}}
        </template>
      </el-table-column>
      <el-table-column prop="certificateno" label="证件号"></el-table-column>
      <el-table-column prop="checkimroom" label="授权房间"></el-table-column>
      <el-table-column prop="checkintime" label="授权时间"></el-table-column>
      <el-table-column label="操作" width="160" class-name="cell-cneter" fixed="right">
        <template slot-scope="scope">
          <template>
            <el-button type="text" @click="handleGoDetail(scope.row)">编辑</el-button>
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
  },
  data () {
    return {
      tableData: [], // 必须
      dataCount: 0, // 必须
      searchModel: {
        pageNo: 1, // 必须
        pageSize: 20 // 必须
      },
      countries: [],
      query: {}
    }
  },
  computed: {},

  methods: {
    handleDelete (row) {
      this.$confirm('确认删除该用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        Site.http.delete(`/admin/tLockRentuser/${row.rentuserid}`, {
        }, data => {
          if (data.errno === 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.fetchData()
          }
        })
      })
      .catch((e) => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    addStaff () {
      this.$router.push({
        path: `/rent/detail/add`
      })
    },
    handleGoDetail: function (row) {
      this.$router.push({
        path: `/rent/detail/${row.rentuserid}`
      })
    },
    handleCurrentChange (val) {
      this.searchModel.pageNo = +val
      this.fetchData()
    },
    fetchData: function () {
      Site.http.post(
        '/admin/tLockRentuser/queryByPage', this.searchModel,
        data => {
          this.tableData = data.data.list
          this.dataCount = data.data.total
        }
      )
    },
    rowKey (row) {
      return row._id
    },
    handleSearchChange () {
      this.searchModel.pageNo = 1
      this.fetchData()
    }
  },
  mounted: function () {
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
