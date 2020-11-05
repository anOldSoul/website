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
    // 查询当前用户所有的 counters
    let sn = wx.getStorageSync('sn')
    if (sn) {
      db.collection('logs').where({
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
    let startTime = parseInt(app.Moment(this.data.month, 'YYYY-MM').format('YYYYMM00000000'))
    let endTime = parseInt(app.Moment(this.data.month, 'YYYY-MM').add(1, 'months').format('YYYYMM00000000'))
    console.log(startTime)
    console.log(endTime)
    if (sn) {
      wx.cloud.callFunction({
        name: 'queryLog'
      }).data({
        sn: sn
      }).then((e) => {
        console.log(e)
      })
      // const $ = db.command
      // db.collection('logs').where({
      //   time: _$gt(startTime).and($lt(endTime)),
      //   sn: sn
      // })
      // .skip(this.data.pageNo)
      // .limit(20)
      // .get({
      //   success: res => {
      //     wx.stopPullDownRefresh()
      //     let list = res.data.map((item, index) => {
      //       item.time = app.Moment(item.time, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')
      //       return item
      //     })
      //     if (this.data.pageNo === 1) {
      //       this.setData({
      //         currentMonthData: list
      //       })
      //     } else {
      //       this.setData({
      //         currentMonthData: this.data.currentMonthData.concat(list)
      //       })
      //     }
      //   },
      //   fail: err => {
      //     wx.showToast({
      //       icon: 'none',
      //       title: '查询记录失败'
      //     })
      //     console.error('[数据库] [查询记录] 失败：', err)
      //   }
      // })
    }
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