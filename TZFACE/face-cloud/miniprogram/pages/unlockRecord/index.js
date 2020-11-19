// pages/unlockRecord/index.js
const app = getApp()
Page({
  data: {
    logtype: {
      0: '人脸开门',
      1: '人脸录入', 
      2: '人脸删除',
      3: '刷卡开门',
      4: '卡片添加',
      5: '卡片删除',
      6: '远程开门'
    },
    usertype: {
      0: '访客',
      1: '访客',
      2: '员工'
    },
    pageSize: 20,
    pageNo: 1,
    pages: 0,
    month: app.Moment().format('YYYY-MM'),
    currentMonthData: [],
    type: ''
  }, 
  onPullDownRefresh: function () {
    this.data.pageNo = 1
    this.getList()
    this.getCount()
  },
  onReachBottom: function () {
    if (this.data.pageNo < this.data.pages) {
      this.data.pageNo++
      this.getList()
    }
  },
  getCount() {
    const db = wx.cloud.database()
    let startTime = (app.Moment(this.data.month, 'YYYY-MM').format('YYYYMM'))
    // 查询当前用户所有的 counters
    let sn = wx.getStorageSync('sn')
    if (sn) {
      db.collection('logs').where({
        time: db.RegExp({
          regexp: startTime,
          option:'i'
        }),
        sn: sn
      }).count({
        success: res => {
          this.data.pages = res.total % 20 === 0 ? parseInt(res.total / 20) : parseInt(res.total / 20) + 1
        }
      })
    }
  },
  getList() {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    let sn = wx.getStorageSync('sn')
    let skip = (this.data.pageNo - 1)*this.data.pageSize
    let startTime = (app.Moment(this.data.month, 'YYYY-MM').format('YYYYMM'))
    if (sn) {
      const _ = db.command
      db.collection('logs').where({
        time: db.RegExp({
          regexp: startTime,
          option:'i'
        }),
        sn: sn
      })
      .orderBy('time', 'desc')
      .skip(skip)
      .limit(this.data.pageSize)
      .get({
        success: res => {
          console.log(res)
          wx.stopPullDownRefresh()
          let list = res.data.map((item, index) => {
            item.time = app.Moment(item.time, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')
            return item
          })
          if (this.data.pageNo === 1) {
            this.setData({
              currentMonthData: list
            })
          } else {
            this.setData({
              currentMonthData: this.data.currentMonthData.concat(list)
            })
          }
          this.getInfo()
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
    }
  },
  getInfo() {
    const db = wx.cloud.database()
    this.data.currentMonthData.forEach((item, index) => {
      let collection = item.usertype === 2 ? 'faces' : 'visitors'
      db.collection(collection).doc(item.wxid).get().then((res) => {
        item.name = res.data.name
        item.fileID = res.data.fileID
        this.setData({
          currentMonthData: this.data.currentMonthData
        })
      })
    })
  },
  onShow: function() {
  },
  onLoad: function (options) {
    this.getList()
    this.getCount()
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      month: e.detail.value
    })
    console.log(this.data.month)
    this.data.pageNo = 1
    this.getList()
  }
})