// pages/admPw/index.js
Page({
  data: {
    userName: '',
    password: ''
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
    if (this.data.password.length < 6) {
      wx.showToast({
        title: '请输入6-12位数字密码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.navigateTo({
      url: `/pages/activateDevice/index?func=addPw&pw=${this.data.password}`
    })
  },
  bindUserNameInput: function(e) {
    this.data.userName = e.detail.value
  },
  bindKeyInput: function (e) {
    this.data.password = e.detail.value
  },
  onShow: function () {

  }
})