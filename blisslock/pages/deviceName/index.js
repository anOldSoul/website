const app = getApp()
Page({
  data: {
    device_name: '',
    placeholder: '',
    pagetype: ''
  },
  onLoad: function (options) {
    this.setData({
      pagetype: options.type
    })
    // if (options.type !== 'updateName') {
    //   wx.showToast({
    //     title: '绑定成功',
    //     icon: 'none',
    //     duration: 2000
    //   })
    // }
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
    let deviceList = wx.getStorageSync('deviceList') || []
    if (this.data.pagetype === 'updateName') {
      deviceList[wx.getStorageSync('currentDeviceIndex')].device_name = this.data.device_name || this.data.placeholder
    } else {
      let deviceItem = {
        type: wx.getStorageSync('_deviceType'),
        device_name: this.data.device_name || this.data.placeholder,
        _deviceId: wx.getStorageSync('_deviceId'),
        _serviceId: wx.getStorageSync('_serviceId'),
        _characteristicId: wx.getStorageSync('_characteristicId'),
        admPw: wx.getStorageSync('admPw'),
        seedA: wx.getStorageSync('seedA'),
        seedB: wx.getStorageSync('seedB'),
        seedC: wx.getStorageSync('seedC'),
        bindCode: wx.getStorageSync('bindCode')
      }
      let isExist = deviceList.find((it, index) => {
        it.index = index
        return (it._deviceId === wx.getStorageSync('_deviceId'))
      })
      if (isExist) {
        deviceList[isExist.index] = deviceItem
      } else {
        deviceList.push(deviceItem)
      }
    }
    console.log(deviceList)
    wx.setStorageSync('deviceList', deviceList)
    wx.removeStorageSync('seedA')
    wx.removeStorageSync('seedB')
    wx.removeStorageSync('seedC')
    // wx.removeStorageSync('_deviceId')
    // wx.removeStorageSync('_serviceId')
    // wx.removeStorageSync('_characteristicId')
    wx.reLaunch({
      url: '/pages/index/index',
    })
  }
})