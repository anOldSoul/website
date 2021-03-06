// pages/unlockRecord/index.js
const app = getApp()
Page({
  data: {
    currentMonthData: []
  },
  onShow: function() {
    if (!app.util.getDeviceItem('tempPw').length) {
      wx.showModal({
        title: '提示',
        content: '暂时没有历史记录！',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    }
    this.setData({
      currentMonthData: app.util.getDeviceItem('tempPw')|| []
    })
  },
  handleClear: function() {
    wx.showModal({
      title: '提示',
      content: '确定要清空历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          app.util.updateDeviceList('tempPw', [])
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