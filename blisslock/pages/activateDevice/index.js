// pages/index/index.js
const app = getApp()
Page({
  data: {
  },
  closeConnection() {
    wx.closeBLEConnection({     
      deviceId: app.util.getDeviceItem('_deviceId'),
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
      app.util.doBLEConnection('addPass', '', { pw: options.pw, name: options.name})
    }
    if (func === 'delPw') {
      app.util.updateDeviceList('delPassId', options.pw)
      app.util.doBLEConnection('delPass')
    }
    if (func === 'unlockRecord') {
      app.util.doBLEConnection('unlockRecord')
    }
    if (func === 'addFinger') {
      app.util.doBLEConnection('addFinger', '', { name: options.name })
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
  },
  handleClose: function() {
    this.closeConnection()
    wx.navigateBack({
      delta: 1
    })
  }
})