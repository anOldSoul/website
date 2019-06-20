// pages/addDevice/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasChecked: false
  },
  checkboxChange: function () {
    this.data.hasChecked = !this.data.hasChecked
  },
  goNext: function() {
    if (!this.data.hasChecked) {
      wx.showModal({
        title: '提示',
        content: '请确认已完成上述操作',
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
    wx.navigateTo({
      url: `/pages/admPw/index`
    })
  }
})