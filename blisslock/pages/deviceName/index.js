// pages/admPw/index.js
Page({
  data: {
    device_name: ''
  },
  onLoad: function (options) {
  },
  onShow: function () {
  },
  bindKeyInput: function(e) {
    this.setData({
      device_name: e.detail.value
    })
  },
  handleComplete: function() {
    wx.setStorageSync('device_name', this.data.device_name || 'M6智能锁')
    wx.redirectTo({
      url: '/pages/shopping/index'
    })
  }
})