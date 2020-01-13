<template>
  <div class="app-container">
    <div class="flex search-box">
      <el-form class="form" label-width="86px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="设备编号">
              <el-input v-model="searchModel.collId" clearable @change="handleSearchChange"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备名称">
              <el-input v-model="searchModel.collName" clearable @change="handleSearchChange"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="绑定公寓">
              <el-select v-model="searchModel.apartid" placeholder="请选择公寓" clearable>
                <el-option v-for="apart in apartments" :label="apart.apartmentname" :value="apart.apartmentid" :key="apart.apartmentid"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :push="2">
            <el-button type="primary" @click="handleSearchChange">查询</el-button>
            <el-button type="warning" @click="handleAdd">新增</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="collId" label="设备编号"/>
      <el-table-column prop="collName" label="设备名称"/>
      <el-table-column prop="collUserid" label="采集器登录账号"/>
      <el-table-column prop="apartname" label="绑定公寓"/>
      <el-table-column prop="stat" label="状态">
        <template slot-scope="scope">
          <span :style="{ color: scope.row.stat === '0' ? 'green' : 'red'}">{{ scope.row.stat === '0' ? '正常' : '停用' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="cell-cneter" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="handleGoDetail(scope.row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
          <el-button type="text" @click="handleViewLog(scope.row)">查看日志</el-button>
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
      apartments: [],
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
    this.getApartment()
    // this.getCount()
  },
  mounted: function() {
  },

  methods: {
    handleViewLog(row) {
      this.$router.push({
        path: `/deviceLog/collectionLog/${row.collId}`
      })
    },
    handleAdd() {
      this.$router.push({
        path: `/collection/detail/add`
      })
    },
    handleDelete(row) {
      this.$confirm('确认删除该采集器吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          Site.http.delete(`/admin/tCollectorInfo/${row.id}`, {
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
    getApartment() {
      Site.http.post('/admin/apartmeninfo/queryByPage', {
        pageNo: 1,
        pageSize: 2000
      }, data => {
        this.apartments = data.data.list
        this.searchModel.apartmentid = Number(this.apartmentid)
      })
    },
    handleGoDetail: function(row) {
      this.$router.push({
        path: `/collection/detail/${row.id}`
      })
    },
    handleCurrentChange(val) {
      this.searchModel.pageNo = +val
      this.fetchData()
    },
    fetchData: function() {
      Site.http.post(
        '/admin/tCollectorInfo/queryByPage', this.searchModel,
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
