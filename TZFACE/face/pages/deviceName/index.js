const app = getApp()
Page({
  data: {
    device_name: '',
    placeholder: '',
    pagetype: ''
  },
  onLoad: function (options) {
  },
  onShow: function () {
  },
  bindKeyInput: function(e) {
    this.setData({
      device_name: e.detail.value
    })
  },
  handleComplete: function() {
  }
})