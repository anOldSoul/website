var app = getApp()

Page({
  data: {
    userInfo: {},
    code: '',
    hasLogin: false
  },
  onLoad: function () {

  },
  goIntroduction() {
    wx.navigateTo({
      url: `/pages/introduction/index`
    })
  },
  getPhoneNumber(e) {   
    wx.navigateTo({
      url: `/pages/login/index`
    })
  },
  goAbout: function() {
    wx.navigateTo({
      url: `/pages/about/index`
    })
  },
  onShow: function() {
    this.setData({
      hasLogin: wx.getStorageSync('TZFACE-userid') ? true : false
    })
  }
})
