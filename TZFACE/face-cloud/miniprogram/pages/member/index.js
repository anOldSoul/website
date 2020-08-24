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
  loginout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.clearStorage()
          this.setData({
            hasLogin: wx.getStorageSync('TZFACE-userid') ? true : false
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onShow: function() {
    this.setData({
      hasLogin: wx.getStorageSync('TZFACE-userid') ? true : false
    })
  }
})
