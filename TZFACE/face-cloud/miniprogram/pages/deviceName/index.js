const app = getApp()
Page({
  data: {
    device_name: '',
    placeholder: '请设置设备名称',
    pagetype: ''
  },
  onLoad: function (options) {
    this.data.pagetype = options.pagetype
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
      if (this.data.pagetype === 'addDevice') {
        let msg = { "func": "GetDeviceInfo", "sn": wx.getStorageSync('sn'), userid: wx.getStorageSync('TZFACE-userid') }
        wx.showLoading({
          title: '',
        })
        app.publish(msg)
      } else {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  }
})