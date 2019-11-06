<template>
  <div class="page">
    <div class="flex search-box">
      <el-form class="form" label-width="86px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="名称">
              <el-input v-model="searchModel.gateWayName" clearable @change="handleSearchChange"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编号">
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
      <el-table-column prop="lockname" label="门锁名称"></el-table-column>
      <el-table-column prop="lockid" label="设备编号"></el-table-column>
      <el-table-column prop="bingdingroom" label="绑定房间"></el-table-column>
      <el-table-column prop="userid" label="开锁用户"></el-table-column>
      <el-table-column prop="usertype" label="用户类型"></el-table-column>
      <el-table-column prop="addtype" label="开锁类型"></el-table-column>
      <el-table-column prop="createtime" label="开锁时间"></el-table-column>
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
    // this.getCount()
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
        '/admin/tLockopenTxninfo/queryByPage', this.searchModel,
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
