const app = getApp()
Page({
  data: {
    telephone: '',
    nickName: ''
  },
  onLoad: function (options) {
  },
  bindGetUserInfo(e) {
    this.data.userInfo = e.detail.userInfo
    if (this.data.userInfo) {
      this.setData({
        nickName: this.data.userInfo.nickName
      })
    }
  },
  test() {
    let TEL_REGEXP = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
    if (TEL_REGEXP.test(this.data.telephone)) {
      return true
    }
    return false
  },
  bindTelInput: function (e) {
    this.data.telephone = e.detail.value
  },
  bindUsernameInput: function (e) {
    this.data.nickName = e.detail.value
  },
  goNext:function() {
    if (!this.data.nickName) {
      wx.showModal({
        title: '提示',
        content: '请输入姓名',
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
    if (!this.test()) {
      wx.showModal({
        title: '提示',
        content: '您输入的手机号码不正确',
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
    let peopleList = wx.getStorageSync('peopleList') || []
    peopleList.push({
      id: 2,
      name: this.data.nickName,
      imgUrl: ''
    })
    wx.setStorageSync('peopleList', peopleList)
    wx.navigateBack({
      delta: 1
    })
  },
  onShow: function () {
  }
})