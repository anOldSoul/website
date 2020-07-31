//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  goPeople() {
    wx.navigateTo({
      url: `/pages/people/index`
    })
  },
  goChart() {
    wx.navigateTo({
      url: `/pages/logs/logs`
    })
  },
  onLoad: function () {
  }
})
