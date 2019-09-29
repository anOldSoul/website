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
  bindUserNameInput: function (e) {
    this.data.pw = e.detail.value
  },
  handleSave: function () {
    if (!this.data.pw) {
      wx.showToast({
        title: '请输入名称',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let pwArr = app.util.getDeviceItem('pwArr') || []
    pwArr.forEach((item, index) => {
      if (item.id === this.data.id) {
        item.name = this.data.pw
      }
    })
    app.util.updateDeviceList('pwArr', pwArr)
    wx.navigateBack({
      delta: 1
    })
  },
  onShow: function () {
  }
})