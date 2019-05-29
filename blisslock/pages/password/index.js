// pages/newHome/index.js
const app = getApp()
Page({
  data: {
    devices: [],
    connected: false,
    chs: []
  },
  manage_password() {
    this.doBLEConnection('addPass')
  },
  sync_password() {
    this.doBLEConnection('syncPass')
  },
  doBLEConnection(funcKey) {
    wx.createBLEConnection({
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
      deviceId: wx.getStorageSync('_deviceId'),
      success(res) {
        let time = app.Moment().format('ssmmhhDDMMYY')
        let hex = `55280000${time}00000000000000000000` //重置时钟
        app.util.writeBle(hex, funcKey)
      }
    })
  },
  onLoad: function (options) {
  },
  onShow: function () {
  },
  goDetail: function (e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/goodDetail/index?goodsId=${item.id}&eventType=selected_hot`
    })
  }
})