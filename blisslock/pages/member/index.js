var app = getApp()

Page({
  data: {
    userInfo: {},
    code: ''
  },
  onLoad: function () {
  },
  goIntroduction() {
    wx.navigateTo({
      url: `/pages/introduction/index`
    })
  },
  goAbout: function() {
    wx.navigateTo({
      url: `/pages/about/index`
    })
  },
  goGesture: function() {
    wx.navigateTo({
      url: `/pages/gesture/index?url=member`
    })
  },
  onShow: function() {
  }
})
