<template>
  <div class="app-container">
    <div class="btn-wrap">
      <!-- <el-button type="primary" size="small" @click="addStaff">新增 + </el-button> -->
    </div>
    <div class="flex search-box">
      <el-form class="form" label-width="86px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="名称">
              <el-input v-model="searchModel.lockname" clearable @change="handleSearchChange"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编号">
              <el-input v-model="searchModel.lockid" clearable @change="handleSearchChange"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="绑定网关">
              <el-input v-model="searchModel.gateid" clearable @change="handleSearchChange"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="绑定房间">
              <el-input v-model="searchModel.roomname" clearable @change="handleSearchChange"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="故障状态">
              <el-select v-model="searchModel.faultstat" clearable placeholder="">
                <el-option label="正常" value="00"/>
                <el-option label="故障" value="01"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :push="2">
            <el-button type="primary" @click="handleSearchChange">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="tableData" :row-key="rowKey" style="width: 100%">
      <el-table-column prop="lockid" label="编号" width="70"/>
      <el-table-column prop="lockname" label="名称" width="170"/>
      <el-table-column prop="lockaddr" label="位置" width="170"/>
      <el-table-column prop="gateid" label="绑定网关"/>
      <el-table-column prop="roomname" label="绑定房间"/>
      <el-table-column prop="faultstat" label="故障状态">
        <template slot-scope="scope"><span :style="{'color': scope.row.faultstat === '00' ? 'green' : 'red'}">{{ connectStr[scope.row.faultstat] }}</span></template>
      </el-table-column>
      <el-table-column prop="connetnstat" label="联网状态">
        <template slot-scope="scope"><span :style="{'color': scope.row.connetnstat === '00' ? 'green' : 'red'}">{{ connectStr[scope.row.connetnstat] }}</span></template>
      </el-table-column>
      <el-table-column prop="updatetime" label="最后通讯时间" width="150">
        <template slot-scope="scope">{{ $moment(scope.row.updatetime, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss') }}</template>
      </el-table-column>
      <el-table-column label="操作" width="200" class-name="cell-cneter" fixed="right">
        <template slot-scope="scope">
          <template>
            <el-button type="text" @click="handleOpenImmediately(scope.row)">一键开锁</el-button>
            <el-button type="text" @click="handleGoDetail(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
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
      connectStr: {
        '00': '正常',
        '01': '故障'
      },
      tableData: [], // 必须
      dataCount: 0, // 必须
      searchModel: {
        pageNo: 1, // 必须
        pageSize: 20 // 必须
      }
    }
  },
  computed: {},
  created() {
    this.fetchData()
  },
  mounted: function() {
  },
  methods: {
    handleOpenImmediately(row) {
      Site.http.post(
        '/admin/tUserInfo/openLock', {
          'lockid': row.lockid,
          'rsv1': row.gateid
        },
        data => {
          if (data.errno === 0) {
            this.$message({
              message: '开锁成功',
              type: 'success'
            })
          }
        }
      )
    },
    addStaff(row) {
      this.$router.push({
        path: `/device/lock/detail/add/${row.gateid}`
      })
    },
    handleDelete(row) {
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
    handleCurrentChange(val) {
      this.searchModel.pageNo = +val
      this.fetchData()
    },
    fetchData: function() {
      Site.http.post(
        '/admin/tLockInfo/queryByPage', this.searchModel,
        data => {
          this.tableData = data.data.list
          this.dataCount = Number(data.data.total)
        }
      )
    },
    handleGoDetail: function(row) {
      this.$router.push({
        path: `/lock/detail/${row.lockid}/${row.gateid}`
      })
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
