// pages/index/index.js
const app = getApp()
Page({
  data: {
  },
  closeConnection() {
    wx.setStorageSync('isConnecting', false)
    wx.hideLoading()
    wx.closeBLEConnection({
      deviceId: app.util.getDeviceItem('_deviceId'),
      success(res) {
        console.log('蓝牙连接断开成功')
      }
    })
  },
  onLoad: function (options) {
    let func = options.func
    if (func === 'syncFinger') {
      return new Promise((resolve, reject) => {
        app.util.doBLEConnection('syncFinger', resolve)
      }).then(() => {
        console.log('监听成功')
        console.log('同步成功')
        this.closeConnection()
      })
    }
    if (func === 'syncPw') {
      return new Promise((resolve, reject) => {
        app.util.doBLEConnection('syncPass', resolve)
      }).then(() => {
        console.log('监听成功')
        console.log('同步成功')
        this.closeConnection()
      })
    }
    if (func === 'addPw') {
      app.util.doBLEConnection('addPass', '', { pw: options.pw, name: options.name, userType: options.userType, validDate: options.validDate})
    }
    if (func === 'delPw') {
      app.util.updateDeviceList('delPassId', options.pw)
      app.util.doBLEConnection('delPass')
    }
    if (func === 'unlockRecord') {
      app.util.doBLEConnection('unlockRecord')
    }
    if (func === 'addFinger') {
      app.util.doBLEConnection('addFinger', '', { name: options.name, userType: options.userType, validDate: options.validDate })
    }
    if (func === 'delFinger') {
      app.util.updateDeviceList('delFingerId', options.pw)
      app.util.doBLEConnection('delFinger')
    }
    if (func === 'airQuality') {
      app.util.doBLEConnection('airQuality')
    } 
    if (func === 'unlockAtOnce') {
      app.util.doBLEConnection('unlockAtOnce')
    }
    this.setData({
      deviceType: app.util.getDeviceItem('type')
    })
  },
  handleClose: function() {
    this.closeConnection()
    wx.navigateBack({
      delta: 1
    })
  }
})