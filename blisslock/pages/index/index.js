// pages/index/index.js
const app = getApp()
Page({
  data: {
    code: '',
    deviceList: []
  },
  onLoad: function (options) {
    console.log(app.util.generate3MinToSecond())
    wx.login({
      success: (res) => {
        if (res.code) {
          this.data.code = res.code
          // console.log(res.code)
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  onShow: function () {
    let deviceList = wx.getStorageSync('deviceList') || []
    this.setData({
      deviceList: deviceList
    })
  },
  getPhoneNumber(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    let userInfo = { 
      nickName: '9',
      avatarUrl: 'a',
      gender: 1,
      city: 'a',
      province: 'a',
      language: 'a'
    }
    let data = {
      code: this.data.code,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
      userInfo: userInfo
    }
    app.post(app.Apis.POST_WECHAT_INFO, data, result => {})
  },
  goHomePage: function() {
    wx.navigateTo({
      url: `/pages/shopping/index`
    })
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
  }
})