const app = getApp()
Page({
  data: {
    device_name: '',
    placeholder: '',
    pagetype: ''
  },
  onLoad: function (options) {
    this.setData({
      device_name: options.name
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
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name: 'updateDevice',
      data: {
        sn: wx.getStorageSync('sn'),
        name: this.data.device_name
      }
    }).then((e) => {
      wx.hideLoading()
      wx.navigateBack({
        delta: 1
      })
    })
  }
})