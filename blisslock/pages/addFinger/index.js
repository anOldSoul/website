// pages/admPw/index.js
const app = getApp()
Page({
  data: {
    index: '0',
    date: '2016-09-01',
    array: ['普通用户', '防劫持用户'],
    userName: ''
  },
  onLoad: function (options) {
    
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
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
      url: `/pages/activateDevice/index?func=addFinger&name=${this.data.userName}&userType=0${this.data.index}&validDate=${this.data.date}`
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
    console.log(this.data.userName)
  },
  onShow: function () {

  }
})