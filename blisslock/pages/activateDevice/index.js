// pages/index/index.js
const app = getApp()
Page({
  data: {
  },
  onLoad: function (options) {
    app.util.doBLEConnection('unlockRecord')
  },
  handleClose: function() {
    wx.navigateBack({
      delta: 1
    })
  }
})