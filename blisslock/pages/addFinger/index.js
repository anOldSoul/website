// pages/admPw/index.js
Page({
  data: {
    userName: '',
    password: ''
  },
  onLoad: function (options) {

  },
  bindKeyInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  onShow: function () {

  }
})