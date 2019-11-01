<template>
  <div class="page fullH">
    <el-row :gutter="20" class="fullH">
      <el-col :span="7" class="fullH headerL">
        <el-card class="fullH">
          <div slot="header" class="clearfix">
            <span>公寓</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="addDepart">添加</el-button>
          </div>
          <div class="searchBox">
            <el-input placeholder="请输入内容" v-model="apartKey" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
            </el-input>
          </div>
          <div v-for="(arpartment, arpartmentIndex) in arpartments" :key="arpartmentIndex" class="text item" :class="{'isSelected': arpartmentIndex === selectApartIndex }" @click="selectApart(arpartmentIndex, arpartment.apartmentid)">
            <div>{{ arpartment.apartmentname }}</div>
            <div><el-button type="text" @click="editDepart(arpartment.apartmentid)">编辑</el-button></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-tabs v-model="activeTab" @tab-click="handleClick">
          <el-tab-pane :label="tab.label" :name="tab.name" v-for="(tab, tabIndex) in tabs" :key="tabIndex">
            <el-collapse v-model="activeName" accordion>
              <el-collapse-item :title="`楼层${floorIndex + 1}`" :name="floorIndex" v-for="(floor, floorIndex) in rooms" class="floor" :key="floorIndex">
                <el-card class="box-card" v-for="(room, roomIndex) in floor" :key="roomIndex">
                  <div slot="header" class="clearfix">
                    <span>房间号 {{room.roomname}}</span>
                    <el-tooltip placement="bottom" effect="light">
                      <div slot="content">
                        <div><el-button type="text" class="edit-room" @click="editRoom(room.roomid)">编辑房间</el-button></div>
                        <div><el-button type="text" class="edit-room" @click="editCustome(room.roomid)">租客信息</el-button></div>
                        <div><el-button type="text" class="edit-room" @click="updateStat(room.roomid)">转为待租</el-button></div>
                        <div><el-button type="text" class="edit-room" @click="delRoom(room.roomid)">删除房间</el-button></div>
                      </div>
                      <el-button type="text" style="float: right; padding: 3px 0">...</el-button>
                    </el-tooltip>
                  </div>
                  <div>{{room.roomstat === '02' ? '入住' : '空置'}}</div>
                  <div>到期：{{room.endtime}}</div>
                </el-card>
              </el-collapse-item>
            </el-collapse>
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
  activated () {
    this.getData()
  },
  data () {
    return {
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
  methods: {
    selectApart (index,  id) {
      this.selectApartIndex = index
      this.apartmentid = id
      this.getRoom()
    },
    addDepart () {
      this.$router.push({
        path: `department/detail/add`
      })
    },
    delRoom (id) {
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
            this.$router.back()
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
    updateStat () {

    },
    editCustome (id) {
      this.$router.push({
        path: `rent/detail/${id}`
      })
    },
    editRoom (id) {
      this.$router.push({
        path: `room/detail/${id}`
      })
    },
    editDepart (id) {
      this.$router.push({
        path: `department/detail/${id}`
      })
    },
    getData () {
      if (this.apartKey) {
        Site.http.get(`/admin/apartmeninfo/likeread/${this.apartKey}`, {
        }, data => {
          this.arpartments = data.data
          if (this.arpartments.length) {
            this.selectApartIndex = 0
            this.apartmentid = this.arpartments[0].apartmentid
            this.getRoom ()
          }
        })
      } else {
        this.getApartment()
      }
    },
    handleClick(tab, event) {
      if (tab.name === 'second') {
        this.roomstat = '02'
      }
      if (tab.name === 'third') {
        this.roomstat = '03'
      }
      this.getRoom ()
    },
    getRoom () {
      this.floors = []
      let rooms = []
      let data = {
        apartmentid: this.apartmentid
      }
      if (this.roomstat) {
        data.roomstat = this.roomstat
      }
      Site.http.get('/admin/tRoomInfo/queryByApart', data, data => {
        if (data.data.length > 0) {
          data.data.forEach ((item, index) => {
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
    getApartment () {
      Site.http.post('/admin/apartmeninfo/queryByPage', {
        pageNo: 1,
        pageSize: 2000
      }, data => {
        this.arpartments = data.data.list
        if (this.arpartments.length) {
          this.selectApartIndex = 0
          this.apartmentid = this.arpartments[0].apartmentid
          this.getRoom ()
        }
      })
    }
  },
  mounted: function () {
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
  /*width: 100%;*/
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
