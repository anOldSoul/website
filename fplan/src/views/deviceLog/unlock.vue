<template>
  <div class="app-container">
    <div class="flex search-box">
      <el-form class="form" label-width="86px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="名称">
              <el-input v-model="searchModel.gateWayName" clearable @change="handleSearchChange"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编号">
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
      <el-table-column prop="lockid" label="设备编号"/>
      <el-table-column prop="lockname" label="门锁名称"/>
      <el-table-column prop="rsv1" label="网关编号"/>
      <el-table-column prop="bingdingroom" label="绑定房间"/>
      <el-table-column prop="userid" label="开锁用户"/>
      <el-table-column prop="usertype" label="用户类型">
        <template slot-scope="scope">{{ usertypeStr[scope.row.usertype] }}</template>
      </el-table-column>
      <el-table-column prop="addtype" label="开锁类型" width="220">
        <template slot-scope="scope">{{ opentypeStr[scope.row.opentype] }}</template>
      </el-table-column>
      <el-table-column prop="rsv2" label="开锁时间" width="220">
        <template slot-scope="scope">{{ $moment(scope.row.createtime, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss') }}</template>
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
      usertypeStr: {
        '00': '管理员',
        '01': '普通用户'
      },
      opentypeStr: {
        '01': '下端数字普通密码开锁成功',
        '02': '下端临时密码开锁成功',
        '03': '下端管理员密码开锁成功',
        '04': '下端指纹开锁成功',
        '05': '远程开锁成功'
      },
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
        '/admin/tLockopenTxninfo/queryByPage', this.searchModel,
        data => {
          this.tableData = data.data.list
          this.dataCount = Number(data.data.total)
        }
      )
    },
    rowKey(row) {
      return row._id
    },
    handleSearchChange() {
      this.searchModel.pageNo = 1
      this.fetchData()
      this.getCount()
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
