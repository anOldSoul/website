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
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="collId" label="设备编号"/>
      <el-table-column prop="collName" label="设备名称"/>
      <el-table-column prop="collUser" label="操作员编号"/>
      <el-table-column prop="apartname" label="绑定公寓"/>
      <el-table-column prop="datatype" label="采集时间" width="150">
        <template slot-scope="scope">
          {{ $moment(scope.row.collTime, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column label="采集状态">
        <template slot-scope="scope">
          <span :style="{ color: scope.row.collStatus === '00' ? 'green' : 'red'}">{{ scope.row.collStatus === '00' ? '正常' : '异常' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="datatype" label="采集类型">
        <template slot-scope="scope">
          {{ datatypeStr[scope.row.datatype] }}
        </template>
      </el-table-column>
      <el-table-column prop="telno" label="手机号"/>
      <el-table-column prop="upIp" label="采集设备ip"/>
      <el-table-column label="查看" class-name="cell-cneter" fixed="right">
        <template slot-scope="scope">
          <template>
            <el-button type="text" @click="handleViewData(scope.row)">采集数据</el-button>
            <el-button type="text" @click="handleViewImgData(scope.row)">指纹图像数据</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="searchModel.pageNo" :page-size="20" :total="dataCount" layout="total, prev, pager, next" class="flex pagination" @current-change="handleCurrentChange"/>
    <el-dialog
      :visible.sync="dialogVisible"
      title="采集数据"
      width="70%">
      <div class="dataDialog">{{ collData }}</div>
    </el-dialog>
    <el-dialog
      :visible.sync="fingerDialogVisible"
      title="指纹图像数据"
      width="70%">
      <div class="dataDialog">{{ collPicture }}</div>
    </el-dialog>
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
      collPicture: '',
      collData: '',
      dialogVisible: false,
      fingerDialogVisible: false,
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
    handleViewImgData(row) {
      this.collPicture = row.collPicture
      this.fingerDialogVisible = true
    },
    handleViewData(row) {
      this.collData = row.collData
      this.dialogVisible = true
    },
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
.collData {
  white-space:normal;
  word-break:break-all;
  word-wrap:break-word;
}
.el-button+.el-button{
  margin-left: 0;
}
.dataDialog {
  height: 600px;
  overflow-y: scroll;
}
</style>
