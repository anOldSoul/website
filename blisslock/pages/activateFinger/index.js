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
    if (func === 'unlockRecord') {
      app.util.doBLEConnection('unlockRecord')
    }
  },
  handleClose: function() {
    wx.navigateBack({
      delta: 1
    })
  }
})