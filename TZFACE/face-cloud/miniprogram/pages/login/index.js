const app = getApp()
Page({
  data: {
    userInfo: {
      avatarUrl: '',
      nickName: '',
      gender: ''
    },
    isUpdate: false,
    telephone: '',
    nickName: '',
    password: '123456'
  },
  onLoad: function (options) {
    let type = options.type
    if (type === 'updateAdmin')  {
      wx.setNavigationBarTitle({
        title: '设置管理员信息'
      })
      this.setData({
        isUpdate: true
      })
    }
    this.setData({
      telephone: wx.getStorageSync('phone'),
      password: wx.getStorageSync('adminPw'),
      nickName: wx.getStorageSync('nickName')
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
  bindKeyInput: function (e) {
    this.data.password = e.detail.value
  },
  bindTelInput: function (e) {
    this.data.telephone = e.detail.value
  },
  bindUsernameInput: function (e) {
    this.data.nickName = e.detail.value
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
                  telephone: result.data.phone
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
  goNext:function() {
    if (!this.data.nickName) {
      wx.showModal({
        title: '提示',
        content: '请输入昵称',
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
    wx.setStorageSync('phone', this.data.telephone)
    wx.setStorageSync('nickName', this.data.nickName)
    wx.cloud.callFunction({
      name: 'login',
      data: {
        telephone: this.data.telephone,
        name: this.data.nickName
      },
      success: res => {
        wx.setStorageSync('TZFACE-userid', res.result._id)
        app.globalData.openid = res.result.openid
        wx.switchTab({
          url: '/pages/member/index',
          success: () => {
            wx.showToast({
              icon: 'none',
              title: '登录成功'
            })
          }
        })
      },
      fail: err => {
        console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
      }
    })
    // wx.login({
    //   success: (res) => {
    //     if (res.code) {
    //       let data = {
    //         nickName: this.data.nickName || this.data.userInfo.nickName,
    //         avatarUrl: this.data.userInfo.avatarUrl,
    //         gender: this.data.userInfo.gender,
    //         code: res.code,
    //         phone: this.data.telephone
    //       }
    //       app.post(app.Apis.POST_WECHAT_INFO, data, result => {
    //         wx.setStorageSync('userid', result.data)
    //         if (result.errno === 0) {
    //           if (!wx.getStorageSync('yzx-gesturePw').length) {
    //             wx.redirectTo({
    //               url: `/pages/gesture/index?url=init`
    //             })
    //           }
    //           // wx.switchTab({
    //           //   url: '/pages/member/index'
    //           // })
    //         }
    //       })
    //     } else {
    //       console.log('登录失败！' + res.errMsg)
    //     }
    //   }
    // })
  },
  updateAdm() {
    let desc = {
      pwd: this.data.password
    }
    app.globalData.adminPw = this.data.password
    wx.navigateTo({
      url: `/pages/activateDevice/index?func=updateAdmin&desc=${JSON.stringify(desc)}`
    })
  },
  onShow: function () {
  }
})