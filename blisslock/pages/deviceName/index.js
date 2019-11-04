const app = getApp()
Page({
  data: {
    device_name: '',
    placeholder: ''
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
    this.setData({
      placeholder: app.util.getDeviceItem('device_name') || '智能锁'
    })
  },
  bindKeyInput: function(e) {
    this.setData({
      device_name: e.detail.value
    })
  },
  handleComplete: function() {
    let deviceItem = {
      type: wx.getStorageSync('_deviceType'),
      device_name: this.data.device_name || this.data.placeholder,
      _deviceId: wx.getStorageSync('_deviceId'),
      _serviceId: wx.getStorageSync('_serviceId'),
      _characteristicId: wx.getStorageSync('_characteristicId'),
      admPw: wx.getStorageSync('admPw')
    }
    let deviceList = wx.getStorageSync('deviceList') || []
    let isExist = deviceList.find((it, index) => {
      it.index = index
      return (it._deviceId === wx.getStorageSync('_deviceId'))
    })
    if (isExist) {
      deviceList[isExist.index]['device_name'] = deviceItem['device_name']
      deviceList[isExist.index]['admPw'] = deviceItem['admPw']
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