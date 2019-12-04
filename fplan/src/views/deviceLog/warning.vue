<template>
  <div class="app-container">
    <div class="flex search-box">
      <el-form class="form" label-width="86px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备名称">
              <el-input v-model="searchModel.gateWayName" clearable @change="handleSearchChange"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备编号">
              <el-input v-model="searchModel.gateId" clearable @change="handleSearchChange"/>
            </el-form-item>
          </el-col>
          <el-col :span="6" :push="2">
            <el-button type="primary" @click="handleSearchChange">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="tableData" :row-key="rowKey" style="width: 100%">
      <el-table-column prop="warndesc" label="告警类型"/>
      <el-table-column prop="rsv1" label="设备名称"/>
      <el-table-column prop="gateid" label="网关编号"/>
      <el-table-column prop="lockid" label="设备编号"/>
      <el-table-column prop="roomname" label="绑定房间"/>
      <el-table-column prop="uploadtime" label="告警时间">
        <template slot-scope="scope">
          {{ $moment(scope.row.uploadtime, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="searchModel.pageNo" :page-size="20" :total="dataCount" layout="total, prev, pager, next" class="flex pagination" @current-change="handleCurrentChange"/>
  </div>
</template>
<script>
export default {
  name: 'ProvisionsList',
  components: {
  },
  props: {
  },
  data() {
    return {
      tableData: [], // 必须
      dataCount: 0, // 必须
      searchModel: {
        pageNo: 1, // 必须
        pageSize: 10
      },
      countries: [],
      query: {}
    }
  },
  computed: {},
  created() {
    this.fetchData()
    // this.getCount()
  },
  mounted: function() {
  },

  methods: {
    handleGoDetail: function(row) {
      this.$router.push({
        path: `/gateway/detail/${row.gateid}`
      })
    },
    handleCurrentChange(val) {
      this.searchModel.pageNo = +val
      this.fetchData()
    },
    fetchData: function() {
      Site.http.post(
        '/admin/tWarningTxninfo/queryByPage', this.searchModel,
        data => {
          this.tableData = data.data
          this.dataCount = Number(this.tableData.length)
        }
      )
    },
    rowKey(row) {
      return row._id
    },
    handleSearchChange() {
      this.searchModel.pageNo = 1
      this.fetchData()
      // this.getCount()
    }
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
