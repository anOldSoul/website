// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceList: []
  },
  onLoad: function (options) {
    // wx.login({
    //   success(res) {
    //     if (res.code) {
    //       console.log(res.code)
    //     } else {
    //       console.log('登录失败！' + res.errMsg)
    //     }
    //   }
    // })
  },
  onShow: function () {
    let deviceList = wx.getStorageSync('deviceList') || []
    this.setData({
      deviceList: []
    })
  },
  getPhoneNumber(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
  }
})