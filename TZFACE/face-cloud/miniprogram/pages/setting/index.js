const app = getApp()
var udp
Page({
  data: {
    networkType: ''
  },
  onLoad: function () {
    this.setData({
      networkType: app.globalData.networkType
    })
  },
  goName() {
    wx.navigateTo({
      url: `/pages/deviceName/index`
    })
  },
  goNetwork() {
    wx.navigateTo({
      url: `/pages/status/index`
    })
  }
})
