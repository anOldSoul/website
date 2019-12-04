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
            <el-collapse v-model="activeName" accordion>
              <el-collapse-item v-for="(floor, floorIndex) in rooms" :title="`楼层${floorIndex + 1}`" :name="floorIndex" :key="floorIndex" class="floor">
                <template slot="title">
                  <div class="tab-title">楼层 {{ floorIndex + 1 }} <i class="el-icon-zoom-in"/></div>
                </template>
                <el-card v-for="(room, roomIndex) in floor" :key="roomIndex" class="box-card">
                  <div slot="header" class="clearfix">
                    <span>房间号 {{ room.roomname }}</span>
                    <el-tooltip placement="bottom" effect="light">
                      <div slot="content">
                        <div><el-button type="text" class="edit-room" @click="editRoom(room.roomid)">编辑房间</el-button></div>
                        <div v-if="room.rentid"><el-button type="text" class="edit-room" @click="editCustome(room.rentid)">租客信息</el-button></div>
                        <div><el-button type="text" class="edit-room" @click="delRoom(room.roomid)">删除房间</el-button></div>
                      </div>
                      <el-button type="text" style="float: right; padding: 3px 0"><i class="el-icon-more"/></el-button>
                    </el-tooltip>
                  </div>
                  <div>状态：{{ room.roomstat === '02' ? '入住' : '空置' }}</div>
                  <div>到期：{{ room.endtime }}</div>
                  <div class="lock-icon"><img src="../../assets/lock.png"></div>
                </el-card>
                <div class="noroom"><img class="room-img" src="../../assets/noroom.png">该楼层暂无房间</div>
              </el-collapse-item>
            </el-collapse>
            <div class="empty-box">
              <div><img src="../../assets/empty.png"></div>
              <div class="empty-text">暂无相关房间哦...</div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
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
    handleAddRoom() {
      this.$router.push({
        path: `room/detail/add/${this.arpartments[this.selectApartIndex].apartmentid}/${this.arpartments[this.selectApartIndex].floor}`
      })
    },
    selectApart(index, id) {
      this.selectApartIndex = index
      this.apartmentid = id
      this.getRoom()
    },
    addDepart() {
      this.$router.push({
        path: `department/detail/add`
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
    updateStat(id, stat) {
      Site.http.put(`/admin/tRoomInfo/${id}`, {
        roomstat: stat === '02' ? '03' : '02'
      }, data => {
        if (data.errno === 0) {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.getData()
        }
      })
    },
    editCustome(id) {
      this.$router.push({
        path: `/rent/detail/${id}`
      })
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
