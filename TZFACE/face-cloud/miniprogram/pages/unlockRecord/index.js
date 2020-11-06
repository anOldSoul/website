// pages/unlockRecord/index.js
const app = getApp()
Page({
  data: {
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
        sn: 'TZFV030004'
      })
      .orderBy('time', 'desc')
      .skip(skip)
      .limit(skip)
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
          // this.getInfo()
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
    console.log('======')
    const db = wx.cloud.database()
    this.data.currentMonthData.forEach((item, index) => {
      db.collection('faces').doc(item.wxid).get().then((res) => {
        console.log(res)
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