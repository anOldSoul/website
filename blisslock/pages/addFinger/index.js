// pages/admPw/index.js
const app = getApp()
Page({
  data: {
    userName: ''
  },
  onLoad: function (options) {
    
  },
  goNext: function() {
    if (!this.data.userName) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.redirectTo({
      url: '/pages/activateDevice/index?func=addFinger'
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  onShow: function () {

  }
})