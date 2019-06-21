// pages/admPw/index.js
Page({
  data: {
    device_name: ''
  },
  onLoad: function (options) {
    wx.showToast({
      title: '绑定成功',
      icon: 'none',
      duration: 2000
    })
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
    let deviceItem = {
      type: 'M6',
      name: wx.getStorageSync('device_name')
    }
    console.log(deviceItem)
    wx.setStorageSync('deviceList', [deviceItem])
    wx.reLaunch({
      url: '/pages/index/index',
    })
  }
})