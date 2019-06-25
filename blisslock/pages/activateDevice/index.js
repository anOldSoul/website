// pages/index/index.js
const app = getApp()
Page({
  data: {
  },
  closeConnection() {
    wx.closeBLEConnection({
      deviceId: wx.getStorageSync('_deviceId'),
      success(res) {
        console.log('蓝牙连接断开')
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
      app.util.doBLEConnection('addPass', '', options.pw)
    }
    if (func === 'delPw') {
      wx.setStorageSync('delPassId', options.pw)
      app.util.doBLEConnection('delPass')
    }
    if (func === 'unlockRecord') {
      app.util.doBLEConnection('unlockRecord')
    }
    if (func === 'addFinger') {
      app.util.doBLEConnection('addFinger')
    }
    if (func === 'delFinger') {
      wx.setStorageSync('delFingerId', options.pw)
      app.util.doBLEConnection('delFinger')
    }
  },
  handleClose: function() {
    this.closeConnection()
    wx.navigateBack({
      delta: 1
    })
  }
})