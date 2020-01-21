<template>
  <div class="app-container">
    <div class="btn-wrap">
      <el-button type="primary" size="small" @click="addStaff">新增 + </el-button>
    </div>
    <div class="flex search-box">
      <el-form class="form" label-width="86px">
        <el-row>
          <el-col :span="7">
            <el-form-item label="租户名">
              <el-input v-model="searchModel.rentusername" clearable @change="handleSearchChange"/>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="手机号">
              <el-input v-model="searchModel.renttel" clearable @change="handleSearchChange"/>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="授权房间">
              <el-input v-model="searchModel.roomname" clearable @change="handleSearchChange"/>
            </el-form-item>
          </el-col>
          <el-col :span="3" :push="2">
            <el-button type="primary" icon="el-icon-search" @click="handleSearchChange">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="tableData" :row-key="rowKey" style="width: 100%">
      <el-table-column prop="rentusername" label="租户名"/>
      <el-table-column prop="renttel" label="手机号"/>
      <el-table-column label="性别">
        <template slot-scope="scope">{{ scope.row.sex === '1' ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column prop="certificateno" label="证件号"/>
      <el-table-column prop="checkimroom" label="授权房间"/>
      <el-table-column label="状态">
        <template slot-scope="scope">{{ scope.row.rentstat === '02' ? '入住' : '退租' }}
        </template>
      </el-table-column>
      <el-table-column label="授权时间">
        <template slot-scope="scope">{{ scope.row.checkintime ? $moment(scope.row.checkintime, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss') : '' }}</template>
      </el-table-column>
      <el-table-column label="操作" width="260" class-name="cell-cneter" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="handleGoDetail(scope.row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
          <el-button type="text" @click="handleCollect(scope.row)">采集数据</el-button>
          <el-button type="text" @click="handleStat(scope.row)">入住/退租</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="searchModel.pageNo" :page-size="20" :total="dataCount" layout="total, prev, pager, next" class="flex pagination" @current-change="handleCurrentChange"/>
    <el-dialog :title="`采集数据`" :visible.sync="dialogTableVisible" width="80%">
      <el-dialog
        :visible.sync="innerStatVisible"
        title="更改数据状态"
        append-to-body
        width="50%">
        <div class="dataDialog">
          <el-select v-model="datastat.datastat" clearable placeholder="请选择数据状态">
            <el-option label="初始状态" value="0"/>
            <el-option label="删除中" value="1"/>
            <el-option label="同步中" value="2"/>
            <el-option label="已同步" value="3"/>
            <el-option label="已删除" value="4"/>
          </el-select>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="innerStatVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSureStat">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :visible.sync="innerVisible"
        title="采集数据"
        append-to-body
        width="70%">
        <div class="dataDialog">{{ collData }}</div>
      </el-dialog>
      <el-dialog
        :visible.sync="fingerDialogVisible"
        title="指纹图像数据"
        append-to-body
        width="70%">
        <div class="dataDialog">{{ collPicture }}</div>
      </el-dialog>
      <el-table :data="gridData">
        <el-table-column prop="apartname" label="绑定公寓"/>
        <el-table-column label="数据状态">
          <template slot-scope="scope">
            <span>{{ collStatusStr[scope.row.datastat] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="datatype" label="数据类型">
          <template slot-scope="scope">
            {{ datatypeStr[scope.row.datatype] }}
          </template>
        </el-table-column>
        <el-table-column prop="telno" label="手机号"/>
        <el-table-column prop="rentusername" label="客户姓名"/>
        <el-table-column width="300" label="操作" class-name="cell-cneter" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleViewData(scope.row)">采集数据</el-button>
            <el-button v-if="scope.row.datatype === '00'" type="text" size="mini" @click="handleViewImgData(scope.row)">指纹图像数据</el-button>
            <el-button type="text" size="mini" @click="handleUpdateData(scope.row)">更改数据状态</el-button>
            <el-button type="text" size="mini" @click="handleDelData(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog :title="`入住/退租`" :visible.sync="dialogStat" width="70%">
      <el-row>
        <el-col :span="3">授权公寓</el-col>
        <el-col :span="5">
          <el-select v-model="formData.apartmentid" clearable placeholder="请选择公寓" @change="onchangeDepart">
            <el-option v-for="item in arpartments" :label="item.apartmentname" :value="item.apartmentid" :key="item.apartmentid"/>
          </el-select>
        </el-col>
        <el-col :span="8" :push="1">
          <el-select v-model="formData.checkinroomid" filterable clearable placeholder="请选择授权房间">
            <el-option v-for="item in rooms" :label="item.roomname" :value="item.roomid" :key="item.roomid"/>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">状态</el-col>
        <el-col :span="5">
          <el-select v-model="formData.rentstat" clearable placeholder="请选择公寓">
            <el-option label="入住" value="02"/>
            <el-option label="退租" value="03"/>
          </el-select>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogStat = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdate">确 定</el-button>
      </span>
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
      datastat: {},
      collData: '',
      collPicture: '',
      formData: {
        checkinroomid: '',
        apartmentid: '',
        rentstat: ''
      },
      dialogStat: false,
      innerVisible: false,
      fingerDialogVisible: false,
      innerStatVisible: false,
      collStatusStr: {
        '0': '初始状态',
        '1': '删除中',
        '2': '同步中',
        '3': '已同步',
        '4': '已删除'
      },
      datatypeStr: {
        '00': '指纹',
        '01': '卡片',
        '02': '身份证'
      },
      dialogTableVisible: false,
      tableData: [], // 必须
      gridData: [], // 必须
      rooms: [], // 必须
      dataCount: 0, // 必须
      searchModel: {
        pageNo: 1, // 必须
        pageSize: 20 // 必须
      },
      arpartments: [],
      query: {}
    }
  },
  computed: {},
  created() {
    this.fetchData()
  },
  mounted: function() {
    this.getApartment()
  },

  methods: {
    handleSureStat() {
      Site.http.put(`/admin/tCollectorData/${this.datastat.id} `, this.datastat, data => {
        if (data.errno === 0) {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.innerStatVisible = false
        }
      })
    },
    handleUpdateData(row) {
      this.innerStatVisible = true
      this.datastat = row
    },
    handleDelData(row) {
      this.$confirm('确认删除该数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          Site.http.delete(`/admin/tCollectorData/${row.id} `, {
          }, data => {
            if (data.errno === 0) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.dialogTableVisible = false
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
    handleViewImgData(row) {
      this.collPicture = row.collPicture
      this.fingerDialogVisible = true
    },
    handleViewData(row) {
      this.collData = row.collData
      this.innerVisible = true
    },
    getRoom() {
      const data = {
        apartmentid: this.formData.apartmentid
      }
      Site.http.get('/admin/tRoomInfo/queryByApart', data, data => {
        this.rooms = data.data
      })
    },
    onchangeDepart() {
      this.formData.checkinroomid = ''
      this.getRoom()
    },
    getApartment() {
      Site.http.post('/admin/apartmeninfo/queryByPage', {
        pageNo: 1,
        pageSize: 2000
      }, data => {
        this.arpartments = data.data.list
      })
    },
    handleUpdate() {
      Site.http.put(`/admin/tLockRentuser/${this.formData.rentuserid}`, this.formData, data => {
        if (data.errno === 0) {
          this.dialogStat = false
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.fetchData()
        }
      })
    },
    handleStat(row) {
      this.dialogStat = true
      this.formData = row
      if (this.formData.apartmentid) {
        this.getRoom()
      }
    },
    handleCollect(row) {
      this.dialogTableVisible = true
      Site.http.get(
        `/admin/tCollectorData/getCollData/${row.renttel}`, this.searchModel,
        data => {
          this.gridData = data.data
        }
      )
    },
    handleDelete(row) {
      this.$confirm('确认删除该用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          Site.http.delete(`/admin/tLockRentuser/${row.rentuserid}`, {
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
    addStaff() {
      this.$router.push({
        path: `/rent/detail/add`
      })
    },
    handleGoDetail: function(row) {
      this.$router.push({
        path: `/rent/detail/${row.rentuserid}`
      })
    },
    handleCurrentChange(val) {
      this.searchModel.pageNo = +val
      this.fetchData()
    },
    fetchData: function() {
      Site.http.post(
        '/admin/tLockRentuser/queryByPage', this.searchModel,
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
.el-row,
.trace {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}
</style>
