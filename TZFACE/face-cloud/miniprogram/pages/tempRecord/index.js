// pages/unlockRecord/index.js
const app = getApp()
Page({
  data: {
    currentMonthData: [],
    status: {
      '0': '正常',
      '1': '已失效',
      '2': '异常'
    }
  },
  onShow: function() {
    this.getList()
  },
  handleDel(e) {
    console.log(e)
    let key_id = e.currentTarget.dataset.keyid
    wx.showModal({
      title: '提示',
      content: '确认要删除该访客密码吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          let desc = {
            "key_id": key_id
          }
          wx.navigateTo({
            url: `/pages/activateDevice/index?func=delTempPw&desc=${JSON.stringify(desc)}&userid=${wx.getStorageSync('userid')}`,
            success: () => { }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  goCreateTemp() {
    wx.navigateTo({
      url: `/pages/createTemp/index`
    })
  },
  getList() {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('visitors').where({
      sn: wx.getStorageSync('sn')
      // faceid: { "$exists": true }
    }).get({
      success: res => {
        this.setData({
          currentMonthData: res.data.map((item, index) => {
            item.beginTime = app.Moment(item.beginTime, 'YYYYMMDDHHmm').format('YYYY-MM-DD HH:mm')
            item.endTime = app.Moment(item.beginTime, 'YYYYMMDDHHmm').format('YYYY-MM-DD HH:mm')
            return item
          })
        })
        wx.hideLoading()
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  handleClear: function() {
    wx.showModal({
      title: '提示',
      content: '确定要清空历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            currentMonthData: []
          })
          wx.showToast({
            title: '已清空临时密码记录',
            icon: 'none',
            duration: 2000
          })
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onLoad: function (options) {
  }
})