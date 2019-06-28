// pages/index/index.js
const app = getApp()
Page({
  data: {
    userInfo: {},
    code: '',
    deviceList: [],
    showAuthen: false,
    hasPhone: false
  },
  onLoad: function (options) {
    wx.getSetting({
      success: (res) => {
        let hasUserInfo = res.authSetting['scope.userInfo']
        if (!hasUserInfo) {
          this.setData({
            showAuthen: true
          })
        }
      }
    })
  },
  onShow: function () {
    let deviceList = wx.getStorageSync('deviceList') || []
    this.setData({
      deviceList: deviceList,
      hasPhone: wx.getStorageSync('phone') || false
    })
  },
  getPhoneNumber(e) {
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
              this.goHomePage()
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  goHomePage: function() {
    wx.navigateTo({
      url: `/pages/addDevice/index`
    })
  },
  bindGetUserInfo(e) {
    this.setData({
      showAuthen: false
    })
    console.log(e.detail.userInfo)
    this.data.userInfo = e.detail.userInfo
  }
})