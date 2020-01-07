var app = getApp()

Page({
  data: {
    userInfo: {},
    code: '',
    hasLogin: false
  },
  onLoad: function () {
    this.setData({
      hasLogin: wx.getStorageSync('phone')
    })
  },
  getPhoneNumber(e) {
    if (e.detail.iv) {
      wx.login({
        success: (res) => {
          if (res.code) {
            this.data.code = res.code
            let userInfo = {
              nickName: this.data.userInfo.nickName,
              avatarUrl: this.data.userInfo.avatarUrl,
              gender: this.data.userInfo.gender,
              city: this.data.userInfo.city,
              province: this.data.userInfo.province,
              language: this.data.userInfo.language,
            }
            let data = {
              code: this.data.code,
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv,
              userInfo: userInfo
            }
            app.post(app.Apis.POST_WECHAT_INFO, data, result => {
              if (result.errno === 0) {
                wx.setStorageSync('phone', true)
                this.setData({
                  hasLogin: wx.getStorageSync('phone')
                })
                wx.showToast({
                  title: '登录成功',
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }
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
