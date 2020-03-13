const app = getApp()
Page({
  data: {
    userInfo: {
      avatarUrl: '',
      nickName: '',
      gender: ''
    },
    telephone: '',
    nickName: '',
    password: '123456'
  },
  onLoad: function (options) {
    this.setData({
      telephone: wx.getStorageSync('phone')
    })
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
  getPhoneNumber(e) {
    if (e.detail.iv) {
      wx.login({
        success: (res) => {
          if (res.code) {
            this.data.code = res.code
            let data = {
              code: this.data.code,
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv
            }
            app.post(app.Apis.POST_TEL, data, result => {
              if (result.errno === 0) {
                this.setData({
                  telephone: result.data.phone,
                  openId: result.data.openId
                })
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }
  },
  bindKeyInput: function (e) {
    this.data.password = e.detail.value
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
        content: '请输入管理员昵称',
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
    wx.setStorageSync('phone', this.data.telephone)
    wx.setStorageSync('admPw', this.data.password)
    let data = {
      nickName: this.data.nickName || this.data.userInfo.nickName,
      avatarUrl: this.data.userInfo.avatarUrl,
      gender: this.data.userInfo.gender,
      openId: this.data.openId,
      phone: this.data.telephone
    }
    app.post(app.Apis.POST_WECHAT_INFO, data, result => {
      if (result.errno === 0) {
        wx.navigateTo({
          url: `/pages/addDevice/index`
        })
      }
    })
  },
  onShow: function () {
  }
})