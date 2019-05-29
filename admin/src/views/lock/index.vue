<template>
  <div class="page">
    <div class="btn-wrap">
    </div>
    <div class="flex search-box">
      <el-form class="form" label-width="86px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="名称">
              <el-input v-model="searchModel.lockName" clearable @change="handleSearchChange"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编号">
              <el-input v-model="searchModel.lockId" clearable @change="handleSearchChange"></el-input>
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
      <el-table-column prop="bindingstat" label="绑定状态">
        <template slot-scope="scope">{{bindStr[scope.row.bindingstat]}}</template>
      </el-table-column>
      <el-table-column label="操作" width="160" class-name="cell-cneter" fixed="right">
        <template slot-scope="scope">
          <template>
            <el-button type="text" @click="handleGoDetail(scope.row)">详情</el-button>
            <el-button type="text" @click="handleGoPassword(scope.row)">密码</el-button>
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
      bindStr: {
        '1': '锁具与网关已绑定',
        '0': '锁具与网关已解绑'
      },
      tableData: [], // 必须
      dataCount: 0, // 必须
      searchModel: {
        pageNo: 1, // 必须
        pageSize: 20, // 必须
        lockName: '',
        lockId: ''
      }
    }
  },
  computed: {},

  methods: {
    handleGoPassword (row) {
      this.$router.push({
        path: `/lock/password/${row.lockid}`
      })
    },
    handleDelete (row) {
    },
    handleCurrentChange (val) {
      this.searchModel.pageNo = +val
      this.fetchData()
    },
    fetchData: function () {
      Site.http.get(
        '/tLockInfo/getLockListPage', this.searchModel,
        data => {
          this.tableData = data.data
        }
      )
    },
    getCount () {
      Site.http.get(
        '/tLockInfo/getLockListPageCount', this.searchModel,
        function (data) {
          this.dataCount = data.data
        }.bind(this)
      )
    },
    handleGoDetail: function (row) {
      this.$router.push({
        path: `/lock/detail/${row.lockid}`
      })
    },
    rowKey (row) {
      return row._id
    },
    handleSearchChange () {
      this.searchModel.pageNo = 1
      this.fetchData()
      this.getCount()
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
