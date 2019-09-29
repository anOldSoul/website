// pages/newHome/index.js
const app = getApp()
Page({
  data: {
    pw: '',
    id: ''
  },
  del_finger() {
    app.util.updateDeviceList('delFingerId', this.data.pw)
    app.util.doBLEConnection('delFinger')
  },
  onLoad: function (options) {
    this.setData({
      pw: options.pw,
      id: options.id
    })
  },
  onShow: function () {
  },
  bindUserNameInput: function(e) {
    this.data.pw = e.detail.value
  },
  handleSave: function() {
    if (!this.data.pw) {
      wx.showToast({
        title: '请输入名称',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let fingerArr = app.util.getDeviceItem('fingerArr') || []
    fingerArr.forEach((item, index) => {
      if (item.id === this.data.id) {
        item.name = this.data.pw
      }
    })
    app.util.updateDeviceList('fingerArr', fingerArr)
    wx.navigateBack({
      delta: 1
    })
  }
})