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
    wx.checkIsSupportSoterAuthentication({
      success: (res) => {
        console.log(res)
        let supportMode = res.supportMode
        if (supportMode.includes('fingerPrint')) {
          wx.startSoterAuthentication({
            requestAuthModes: ['fingerPrint'],
            challenge: '123456',
            authContent: '请用指纹解锁',
            success(res) {
              let selectIndex = e.currentTarget.dataset.index
              wx.setStorageSync('currentDeviceIndex', selectIndex)
              wx.navigateTo({
                url: `/pages/shopping/index`
              })
            }
          })
        }
        if (supportMode.includes('facial')) {
          wx.startSoterAuthentication({
            requestAuthModes: ['facial'],
            challenge: '123456',
            authContent: '请用人脸解锁',
            success(res) {
              let selectIndex = e.currentTarget.dataset.index
              wx.setStorageSync('currentDeviceIndex', selectIndex)
              wx.navigateTo({
                url: `/pages/shopping/index`
              })
            }
          })
        }
      }
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