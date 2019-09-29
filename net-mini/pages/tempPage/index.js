// pages/index/index.js
const app = getApp()
Page({
  data: {
  },
  onLoad: function (options) { 
  },
  goUnlockRecord: function (e) {
    wx.navigateTo({
      url: `/pages/unlockRecord/index?type=cloud`
    })
  }
})