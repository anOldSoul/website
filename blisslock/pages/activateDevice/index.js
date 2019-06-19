// pages/index/index.js
const app = getApp()
Page({
  data: {
  },
  onLoad: function (options) {
    let func = options.func
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
    wx.navigateBack({
      delta: 1
    })
  }
})