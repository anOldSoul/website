<template>
  <div class="page">
    <div class="btn-wrap">
      <!-- <el-button type="primary" size="small" @click="addStaff">新增 + </el-button> -->
    </div>
    <div class="flex search-box">
      <el-form class="form" label-width="86px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="锁具名称">
              <el-input v-model="searchModel.lockname" clearable @change="handleSearchChange"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="锁具编号">
              <el-input v-model="searchModel.lockid" clearable @change="handleSearchChange"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" :push="2">
            <el-button type="primary" @click="handleSearchChange">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="tableData" style="width: 100%" :row-key="rowKey">
      <el-table-column prop="lockname" label="锁具名称"></el-table-column>
      <el-table-column prop="lockid" label="锁具编号"></el-table-column>
      <el-table-column prop="lockaddr" label="锁具位置"></el-table-column>
      <el-table-column prop="gateid" label="绑定网关"></el-table-column>
      <el-table-column prop="roomid" label="绑定房间"></el-table-column>
      <el-table-column prop="bindingstat" label="绑定状态">
        <template slot-scope="scope">{{bindStr[scope.row.bindingstat]}}</template>
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
      bindStr: {
        '1': '锁具与网关已绑定',
        '0': '锁具与网关已解绑'
      },
      tableData: [], // 必须
      dataCount: 0, // 必须
      searchModel: {
        pageNo: 1, // 必须
        pageSize: 20, // 必须
      }
    }
  },
  computed: {},

  methods: {
    addStaff (row) {
      this.$router.push({
        path: `/lock/detail/add/${row.gateid}`
      })
    },
    handleDelete (row) {
      this.$confirm('确认删除改用户吗？', '提示', {
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
    },
    handleCurrentChange (val) {
      this.searchModel.pageNo = +val
      this.fetchData()
    },
    fetchData: function () {
      Site.http.post(
        '/admin/tLockInfo/queryByPage', this.searchModel,
        data => {
          this.tableData = data.data.list
          this.dataCount = data.data.total
        }
      )
    },
    handleGoDetail: function (row) {
      this.$router.push({
        path: `/lock/detail/${row.lockid}/${row.gateid}`
      })
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
