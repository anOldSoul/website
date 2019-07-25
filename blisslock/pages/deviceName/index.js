// pages/admPw/index.js
Page({
  data: {
    device_name: ''
  },
  onLoad: function (options) {
    if (options.type !== 'updateName') {
      wx.showToast({
        title: '绑定成功',
        icon: 'none',
        duration: 2000
      })
    }
  },
  onShow: function () {
  },
  bindKeyInput: function(e) {
    this.setData({
      device_name: e.detail.value
    })
  },
  handleComplete: function() {
    let deviceItem = {
      type: wx.getStorageSync('_deviceType'),
      device_name: this.data.device_name || 'M6智能锁',
      _deviceId: wx.getStorageSync('_deviceId'),
      _serviceId: wx.getStorageSync('_serviceId'),
      _characteristicId: wx.getStorageSync('_characteristicId'),
      admPw: wx.getStorageSync('admPw')
    }
    console.log(deviceItem)
    let deviceList = wx.getStorageSync('deviceList') || []
    let isExist = deviceList.find((it, index) => {
      it.index = index
      return (it._deviceId === deviceItem._deviceId)
    })
    console.log(isExist)
    if (isExist) {
      deviceList[isExist.index] = deviceItem
    } else {
      deviceList.push(deviceItem)
    }
    console.log(deviceList)
    wx.setStorageSync('deviceList', deviceList)
    // wx.removeStorageSync('_deviceId')
    // wx.removeStorageSync('_serviceId')
    // wx.removeStorageSync('_characteristicId')
    wx.reLaunch({
      url: '/pages/index/index',
    })
  }
})