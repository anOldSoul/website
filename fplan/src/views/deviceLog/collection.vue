<template>
  <div class="app-container">
    <div class="flex search-box">
      <el-form class="form" label-width="86px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备名称">
              <el-input v-model="searchModel.collName" clearable @change="handleSearchChange"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备编号">
              <el-input v-model="searchModel.collId" clearable @change="handleSearchChange"/>
            </el-form-item>
          </el-col>
          <el-col :span="6" :push="2">
            <el-button type="primary" @click="handleSearchChange">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="tableData" :row-key="rowKey" style="width: 100%">
      <el-table-column prop="collId" label="设备编号"/>
      <el-table-column prop="collName" label="设备名称"/>
      <el-table-column prop="collUser" label="操作员编号"/>
      <el-table-column prop="apartname" label="绑定公寓"/>
      <el-table-column prop="datatype" label="采集时间" width="150">
        <template slot-scope="scope">
          {{ $moment(scope.row.collTime, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column prop="stat" label="采集状态">
        <template slot-scope="scope">
          <span :style="{ color: scope.row.stat === '00' ? 'green' : 'red'}">{{ scope.row.stat === '00' ? '成功' : '异常' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="datatype" label="采集类型">
        <template slot-scope="scope">
          {{ datatypeStr[scope.row.datatype] }}
        </template>
      </el-table-column>
      <el-table-column prop="telno" label="手机号"/>
      <el-table-column prop="collData" label="采集数据"/>
      <el-table-column prop="upIp" label="采集设备ip"/>
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
      query: {},
      datatypeStr: {
        '00': '指纹',
        '01': '卡片',
        '02': '身份证'
      }
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
        '/admin/tCollectorTxn/queryByPage', this.searchModel,
        data => {
          this.tableData = data.data.list
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
