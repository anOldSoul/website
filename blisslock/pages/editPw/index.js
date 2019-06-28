// pages/newHome/index.js
const app = getApp()
Page({
  data: {
    pw: '',
    id: ''
  },
  onLoad: function (options) {
    this.setData({
      pw: options.pw,
      id: options.id
    })
    console.log(this.data.pw)
  },
  onShow: function () {
  }
})