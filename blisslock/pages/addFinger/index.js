// pages/admPw/index.js
const app = getApp()
Page({
  data: {
    userName: '',
    password: ''
  },
  onLoad: function (options) {
    
  },
  goNext: function() {
    wx.redirectTo({
      url: '/pages/activateDevice/index?func=addFinger'
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  onShow: function () {

  }
})