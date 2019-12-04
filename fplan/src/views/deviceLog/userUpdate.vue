<template>
  <div class="page">
    <div class="flex search-box">
      <el-form class="form" label-width="86px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备名称">
              <el-input v-model="searchModel.lockname" clearable @change="handleSearchChange"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备编号">
              <el-input v-model="searchModel.lockid" clearable @change="handleSearchChange"/>
            </el-form-item>
          </el-col>
          <el-col :span="6" :push="2">
            <el-button type="primary" @click="handleSearchChange">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="tableData" :row-key="rowKey" style="width: 100%">
      <el-table-column prop="lockname" label="设备名称"/>
      <el-table-column prop="lockid" label="设备编号"/>
      <el-table-column prop="roomname" label="绑定房间"/>
      <el-table-column prop="username" label="用户名"/>
      <el-table-column prop="usertype" label="用户类型"/>
      <el-table-column prop="changetype" label="操作类型"/>
      <el-table-column prop="warntype" label="操作源"/>
      <el-table-column prop="changetime" label="操作时间"/>
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
        pageSize: 20, // 必须
        gateId: '',
        gateWayName: ''
      },
      countries: [],
      query: {}
    }
  },
  computed: {},
  activated() {
    this.fetchData()
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
        '/admin/tUserchangeTxninfo/queryByPage', this.searchModel,
        data => {
          this.tableData = data.data.list
          this.dataCount = data.data.total
        }
      )
    },
    rowKey(row) {
      return row._id
    },
    handleSearchChange() {
      this.searchModel.pageNo = 1
      this.fetchData()
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
