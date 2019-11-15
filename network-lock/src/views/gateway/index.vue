<template>
  <div class="page">
    <div class="btn-wrap">
      <!-- <el-button type="primary" size="small" @click="addStaff">新增 + </el-button> -->
    </div>
    <div class="flex search-box">
      <el-form class="form" label-width="86px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="网关名称">
              <el-input v-model="searchModel.gateWayName" clearable @change="handleSearchChange"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="网关编号">
              <el-input v-model="searchModel.gateId" clearable @change="handleSearchChange"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" :push="2">
            <el-button type="primary" @click="handleSearchChange">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="tableData" style="width: 100%" :row-key="rowKey">
      <el-table-column prop="gatewayname" label="网关名称"></el-table-column>
      <el-table-column prop="gateid" label="网关系统编号"></el-table-column>
      <el-table-column prop="gateaddr" label="网关位置"></el-table-column>
      <el-table-column prop="rsv2" label="到期时间">
        <template slot-scope="scope">{{$moment(scope.row.rsv2, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')}}</template>
      </el-table-column>
      <el-table-column prop="rsv1" label="网关物理编号" width="220"></el-table-column>
      <el-table-column prop="createtime" label="最后通讯时间">
        <template slot-scope="scope">{{$moment(scope.row.createtime, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')}}</template>
      </el-table-column>
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
        pageSize: 20, // 必须
        gateId: '',
        gateWayName: ''
      },
      countries: [],
      query: {}
    }
  },
  computed: {},

  methods: {
    addStaff () {
      this.$router.push({
        path: `/gateway/detail/add`
      })
    },
    handleDelete (row) {
      Site.http.delete(`/admin/tGatewayInfo/${row.gateid}`, {}, data => {
        this.$confirm('确认删除该网关吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          Site.http.delete(`/admin/tLockInfo/${row.lockid}/${row.gateid}`, {
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
      })
    },
    handleGoDetail: function (row) {
      this.$router.push({
        path: `/gateway/detail/${row.gateid}`
      })
    },
    handleCurrentChange (val) {
      this.searchModel.pageNo = +val
      this.fetchData()
    },
    fetchData: function () {
      Site.http.post(
        '/admin/tGatewayInfo/queryByPage', this.searchModel,
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
