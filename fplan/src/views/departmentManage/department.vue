<template>
  <div class="app-container fullH">
    <el-row :gutter="20" class="fullH">
      <el-col :span="7" class="fullH headerL">
        <el-card class="fullH">
          <div slot="header" class="clearfix">
            <span>公寓</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="addDepart">添加</el-button>
          </div>
          <div class="searchBox">
            <el-input v-model="apartKey" placeholder="请输入公寓名称" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="getData"/>
            </el-input>
          </div>
          <div v-for="(arpartment, arpartmentIndex) in arpartments" :key="arpartmentIndex" :class="{'isSelected': arpartmentIndex === selectApartIndex }" class="text item" @click="selectApart(arpartmentIndex, arpartment.apartmentid)">
            <div>{{ arpartment.apartmentname }}</div>
            <div><el-button type="text" @click="editDepart(arpartment.apartmentid)">编辑</el-button></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16" style="position: relative;">
        <div style="position: absolute; right: 20px; z-index: 99;">
          <el-button type="primary" size="small" @click="handleAddRoom">新增房间</el-button>
        </div>
        <el-tabs v-model="activeTab" @tab-click="handleClick">
          <el-tab-pane v-for="(tab, tabIndex) in tabs" :label="tab.label" :name="tab.name" :key="tabIndex">
            <el-collapse v-if="rooms.length" v-model="activeName" accordion>
              <el-collapse-item v-for="(floor, floorIndex) in rooms" :title="`楼层${floorIndex + 1}`" :name="floorIndex" :key="floorIndex" class="floor">
                <template slot="title">
                  <div class="tab-title">楼层 {{ floorIndex + 1 }} <i v-if="floor && floor.length" class="el-icon-zoom-in"/></div>
                </template>
                <div v-if="floor && floor.length > 0">
                  <el-card v-for="(room, roomIndex) in floor" :key="roomIndex" class="box-card">
                    <div slot="header" class="clearfix">
                      <span>房间号 {{ room.roomname }}</span>
                      <el-tooltip placement="bottom" effect="light">
                        <div slot="content">
                          <div><el-button type="text" class="edit-room" @click="editRoom(room.roomid)">编辑房间</el-button></div>
                          <div v-if="room.rentid"><el-button type="text" class="edit-room" @click="editCustome(room.roomid, room.roomname)">租客信息</el-button></div>
                          <div><el-button type="text" class="edit-room" @click="delRoom(room.roomid)">删除房间</el-button></div>
                        </div>
                        <el-button type="text" style="float: right; padding: 3px 0"><i class="el-icon-more"/></el-button>
                      </el-tooltip>
                    </div>
                    <div>状态：{{ room.roomstat === '02' ? '入住' : '空置' }}</div>
                    <div>到期：{{ room.endtime }}</div>
                    <div class="lock-icon"><img src="../../assets/lock.png"></div>
                  </el-card>
                </div>
                <div v-if="!floor || floor.length === 0" class="noroom"><img class="room-img" src="../../assets/noroom.png">该楼层暂无房间</div>
              </el-collapse-item>
            </el-collapse>
            <div v-else class="empty-box">
              <div><img src="../../assets/empty.png"></div>
              <div class="empty-text">暂无相关房间哦...</div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-dialog :title="`房间${dialogTitle}租客信息`" :visible.sync="dialogTableVisible" width="70%">
      <div><el-button type="text" class="edit-room" @click="delRoom(room.roomid)"><i class="el-icon-delete"/> 空置</el-button></div>
      <el-table :data="gridData">
        <el-table-column label="授权时间">
          <template slot-scope="scope">{{ scope.row.checkintime ? $moment(scope.row.checkintime, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss') : '' }}</template>
        </el-table-column>
        <el-table-column property="rentusername" label="租户名"/>
        <el-table-column property="sex" label="性别"/>
        <el-table-column property="renttel" label="手机号"/>
        <el-table-column label="操作" class-name="cell-cneter" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="viewRenter(scope.row)">详情</el-button>
            <el-button type="text" @click="deleteRow(scope.$index, gridData)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="text" @click="viewRenter(scope.row)"><i class="el-icon-circle-plus-outline"/> 添加租户</el-button>
      <el-card>
        <div class="rentUser">
          <el-row>
            <el-col :span="2">租户名</el-col>
            <el-col :span="5">
              <el-input v-model="searchModel.rentusername" placeholder="请输入租户名"/>
            </el-col>
            <el-col :span="2" :push="1">手机号</el-col>
            <el-col :span="5" :push="1">
              <el-input v-model="searchModel.renttel" placeholder="请输入手机号"/>
            </el-col>
            <el-col :span="5" :push="2">
              <el-button type="primary" size="mini" @click="handleSearchChange">查询</el-button>
            </el-col>
          </el-row>
        </div>
        <el-table :data="userData">
          <el-table-column label="授权时间">
            <template slot-scope="scope">{{ scope.row.checkintime ? $moment(scope.row.checkintime, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss') : '' }}</template>
          </el-table-column>
          <el-table-column property="rentusername" label="租户名"/>
          <el-table-column property="sex" label="性别"/>
          <el-table-column property="renttel" label="手机号"/>
          <el-table-column label="操作" class-name="cell-cneter" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="handleAddRenter(scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSaveRenter">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Vue from 'vue'
export default {
  name: 'Department',
  components: {
  },
  props: {
  },
  data() {
    return {
      dataCount: 0,
      searchModel: {
        pageNo: 1,
        pageSize: 20,
        rentusername: '',
        renttel: ''
      },
      selectId: '',
      dialogTitle: '',
      gridData: [],
      userData: [],
      dialogTableVisible: false,
      formLabelWidth: '120px',
      apartmentid: '',
      selectApartIndex: 0,
      tabs: [{
        label: '全部',
        name: 'first'
      }, {
        label: '已租',
        name: 'second'
      }, {
        label: '待租',
        name: 'third'
      }],
      arpartments: [],
      apartKey: '',
      select: '',
      activeName: 0,
      activeTab: 'first',
      floors: [],
      rooms: [],
      roomstat: ''
    }
  },
  computed: {},
  created() {
    this.getData()
  },
  mounted: function() {
  },
  methods: {
    handleSaveRenter() {
      const rentids = this.gridData.map((item, index) => {
        return item.rentuserid
      })
      Site.http.put(
        `/admin/tRoomInfo/checkroom/${this.selectId}`, {
          rentids: rentids,
          roomstat: '02'
        },
        data => {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      )
    },
    handleSearchChange() {
      this.searchModel.pageNo = 1
      this.getUserData()
    },
    handleAddRenter(row) {
      this.gridData.push(row)
    },
    getUserData() {
      this.searchModel['rentstat'] = '03'
      Site.http.post(
        '/admin/tLockRentuser/queryByPage', this.searchModel,
        data => {
          this.userData = data.data.list
          this.dataCount = Number(data.data.total)
        }
      )
    },
    viewRenter(row) {
      this.$router.push({
        path: `/rent/detail/${row.rentuserid}`
      })
    },
    handleAddRoom() {
      this.$router.push({
        path: `/room/detail/add/${this.arpartments[this.selectApartIndex].apartmentid}/${this.arpartments[this.selectApartIndex].floor}`
      })
    },
    selectApart(index, id) {
      this.selectApartIndex = index
      this.apartmentid = id
      this.getRoom()
    },
    addDepart() {
      this.$router.push({
        path: `/department/detail/add`
      })
    },
    delRoom(id) {
      this.$confirm('确认删除改房间？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          Site.http.delete(`/admin/tRoomInfo/${id}`, {
          }, data => {
            if (data.errno === 0) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getData()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    editCustome(id, name) {
      this.dialogTableVisible = true
      this.selectId = id
      this.dialogTitle = name
      this.getUserData()
      this.getRentByRoomid()
    },
    getRentByRoomid() {
      Site.http.get(
        `/admin/tLockRentuser/getRentByRoomid/${this.selectId}`, {

        },
        data => {
          this.gridData = data.data
        }
      )
    },
    editRoom(id) {
      this.$router.push({
        path: `/room/detail/${id}/${this.arpartments[this.selectApartIndex].apartmentid}/${this.arpartments[this.selectApartIndex].floor}`
      })
    },
    editDepart(id) {
      this.$router.push({
        path: `/department/detail/${id}`
      })
    },
    getData() {
      if (this.apartKey) {
        Site.http.get(`/admin/apartmeninfo/likeread/${this.apartKey}`, {
        }, data => {
          this.arpartments = data.data
          if (this.arpartments.length) {
            this.getRoom()
          }
        })
      } else {
        this.getApartment()
      }
    },
    onSearch() {
      this.selectApartIndex = 0
      this.getData()
    },
    handleClick(tab, event) {
      this.selectApartIndex = 0
      if (tab.name === 'second') {
        this.roomstat = '02'
      }
      if (tab.name === 'third') {
        this.roomstat = '03'
      }
      if (tab.name === 'first') {
        this.roomstat = ''
      }
      this.getRoom()
    },
    getRoom() {
      this.floors = []
      const rooms = []
      const data = {
        apartmentid: this.arpartments[this.selectApartIndex].apartmentid
      }
      if (this.roomstat) {
        data.roomstat = this.roomstat
      }
      Site.http.get('/admin/tRoomInfo/queryByApart', data, data => {
        if (data.data.length > 0) {
          data.data.forEach((item, index) => {
            if (!this.floors.includes(item.floor)) {
              this.floors.push(item.floor)
              rooms[item.floor - 1] = [item]
            } else {
              rooms[item.floor - 1].push(item)
            }
            Vue.set(this, 'rooms', rooms)
          })
        } else {
          this.rooms = []
        }
      })
    },
    getApartment() {
      Site.http.post('/admin/apartmeninfo/queryByPage', {
        pageNo: 1,
        pageSize: 2000
      }, data => {
        this.arpartments = data.data.list
        if (this.arpartments.length) {
          this.getRoom()
        }
      })
    }
  }
}
</script>
<style scoped>
.rentUser >>> .el-row {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}
.headerL >>> .el-card__body {
  padding: 0;
}
.searchBox{
  padding: 20px;
}
.fullH {
  height: 100%;
}
.box-card{
  width: 200px;
  margin: 10px;
  position: relative;
}
.lock-icon {
  position: absolute;
  bottom: 15px;
  right: 0;
  opacity: 0.75;
}
.text.item{
  height: 50px;
  display: flex;
  flex-direction: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 20px;
  font-size: 14px;
}
.isSelected {
  background: #f0f0f0;
}
.page >>> .el-collapse-item__header{
  padding: 0 10px;
}
.page >>> .el-collapse-item__content{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.page >>> .el-tabs__content {
  height: 75vh;
  overflow: scroll;
}
.headerL >>> .el-card__body {
  height: 75vh;
  overflow-y: scroll;
}
.empty-box{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
  flex-direction: column;
  color: gray;
}
.empty-text{
  margin-top: 15px;
}
.floor {
  position: relative;
}
.tab-title {
  position: absolute;
  left: 15px;
}
.noroom {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.room-img {
  margin-right: 10px;
}
.el-icon-zoom-in {
  color: #1faa89;
}
.dialog-input {
  width: 200px;
}
</style>
