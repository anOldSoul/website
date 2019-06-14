// pages/admPw/index.js
Page({
  data: {
    password: '123456'
  },
  onLoad: function (options) {
  },
  bindKeyInput: function (e) {
    this.data.password = e.detail.value
  },
  goNext:function() {
    if (this.data.password.length < 6) {
      wx.showModal({
        title: '提示',
        content: '请输入长度为6-12位的数字密码',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    }
    wx.setStorageSync('admPw', this.data.password)
    wx.navigateTo({
      url: `/pages/search/index`
    })
  },
  onShow: function () {
  }
})