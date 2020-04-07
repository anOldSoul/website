// pages/index/index.js
const app = getApp()
Page({
  data: {
    deviceList: [],
    showAuthen: false
  },
  onShareAppMessage: function (res) {
    return {
      title: '快来和我一起打开智能生活的大门吧！'
    }
  },
  onLoad: function (options) {
    wx.getSetting({
      success: (res) => {
        if (!wx.getStorageSync('gesturePw').length) {
          wx.navigateTo({
            url: `/pages/gesture/index?url=init`
          })
        }
      }
    })
  },
  onBind: function(status) {
    console.log(status)
  },
  onShow: function () {
    let deviceList = wx.getStorageSync('deviceList') || []
    this.setData({
      deviceList: deviceList
    })
  },
  goAddDevicePage: function() {
    wx.navigateTo({
      url: `/pages/admPw/index`
    })
  },
  goHomePage: function (e) {
    console.log(e)
    let selectIndex = e.currentTarget.dataset.index
    wx.setStorageSync('currentDeviceIndex', selectIndex)
    wx.navigateTo({
      url: `/pages/shopping/index`
    })
  },
  bindGetUserInfo(e) {
    this.data.userInfo = e.detail.userInfo
    if (this.data.userInfo) {
      this.setData({
        showAuthen: false
      })
      wx.navigateTo({
        url: `/pages/gesture/index?url=init`
      })
    }
  }
})