const app = getApp()
var udp
Page({
  data: {
    deviceName: '1506门禁',
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
  },
  unbind() {
    wx.showModal({
      title: '提示',
      content: '帐号解绑后，门禁本地数据保留，可以使用其他帐号或此帐号重新扫码绑定门锁，请确认',
      success: (res) => {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.cloud.callFunction({
            name: 'updateDevice',
            data: {
              sn: wx.getStorageSync('sn')
            }
          }).then((e) => {
            wx.hideLoading()
            wx.showToast({
              title: '已通过',
            })
            this.onQuery()
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})
