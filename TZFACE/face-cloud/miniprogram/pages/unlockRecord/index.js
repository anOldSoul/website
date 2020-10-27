// pages/unlockRecord/index.js
const app = getApp()
Page({
  data: {
    month: app.Moment().format('YYYY-MM'),
    currentMonthData: [],
    type: '',
    pageSize: 20,
    pageNo: 1,
    pages: 0
  }, 
  onPullDownRefresh: function () {
    this.data.pageNo = 1
    this.getList()
  },
  onReachBottom: function () {
    if (this.data.pageNo < this.data.pages) {
      this.data.pageNo++
      this.getList()
    }
  },
  getList() {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    let sn = wx.getStorageSync('sn')
    if (sn) {
      db.collection('logs').where({
        sn: sn
      }).get({
        success: res => {
          let list = res.data
          this.setData({
            currentMonthData: list.map((item, index) => {
              item.time = app.Moment(item.time, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')
              return item
            })
          })
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
    // let config = app.Apis.GET_OPENLOG
    // app.post(config, {
    //   "pageNo": this.data.pageNo,
    //   "pageSize": this.data.pageSize,
    //   "endTime": app.Moment(this.data.month, 'YYYY-MM').add(1, 'months').format('YYYYMM010000'),
    //   "startTime": app.Moment(this.data.month, 'YYYY-MM').format('YYYYMM010000'),
    //   "sn": wx.getStorageSync('sn')
    // }, result => {
    //   if (result.errno === 0) {
    //     wx.stopPullDownRefresh()
    //     this.data.pages = result.data.pages
    //     let resultData = result.data.list.map((item, index) => {
    //       item.upTime = app.Moment(item.upTime, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')
    //       item.rsvd2 = app.Moment(item.rsvd2, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')
    //       return item
    //     })
    //     if (this.data.pageNo === 1) {
    //       this.setData({
    //         currentMonthData: resultData
    //       })
    //     } else {
    //       this.setData({
    //         currentMonthData: this.data.currentMonthData.concat(resultData)
    //       })
    //     }
    //   }
    // })
  },
  onShow: function() {
  },
  onLoad: function (options) {
    this.getList()
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      month: e.detail.value
    })
    this.data.pageNo = 1
    this.getList()
  }
})