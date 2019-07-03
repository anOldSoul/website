// pages/newHome/index.js
const app = getApp()
Page({
  data: {
    device_name: '',
    devices: [],
    connected: false,
    chs: []
  },
  onLoad: function (options) {
    let device_name = app.util.getDeviceItem('device_name')
    this.setData({
      device_name: device_name
    })
  },
  onShow: function () {
    if (app.util.getDeviceItem('showAdmPw')) {
      app.util.updateDeviceList('showAdmPw', false)
      this.checkAdmPw()
    }
  },
  goDetail: function (e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/goodDetail/index?goodsId=${item.id}&eventType=selected_hot`
    })
  }
})