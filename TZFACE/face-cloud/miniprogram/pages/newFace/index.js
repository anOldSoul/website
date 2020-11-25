const app = getApp()
Page({
  data: {
    submitSuccess: false,
    toSubmit: false,
    hasSubmit: false,
    submitFail: false,
    telephone: '',
    nickName: '',
    fileID: '',
    openid: '',
    sn: ''
  },
  onLoad: function (options) {
    this.data.sn = options.sn
    this.getStatus()
  },
  getStatus() {
    const db = wx.cloud.database()
    wx.cloud.callFunction({
      name: 'getStatus'
    }).then((e) => {
      console.log(e)
      this.data.openid = e.result.openid
      db.collection('waitFace').where({
        openid: e.result.openid
      }).get({
        success: res => {
          console.log(res)
          if (res.data.length > 0) {
            let status = res.data[0].status
            if (status === 1) {
              this.setData({
                hasSubmit: true,
                submitSuccess: false,
                toSubmit: false,
                submitFail: false
              })
            } else if (status === 2) {
              this.setData({
                submitSuccess: true
              })
            } else if (status === 3) {
              this.setData({
                submitFail: true
              })
            } else {
              this.setData({
                toSubmit: true
              })
            }
          } else {
            this.setData({
              toSubmit: true
            })
          }
        },
        fail: err => {
          console.error('[数据库] [查询状态] 失败：', err)
        }
      })
    })
  },
  handleAddPhoto(e) {
    console.log(e)
    wx.navigateTo({
      url: `/pages/copper/index`
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
  bindTelInput: function (e) {
    this.data.telephone = e.detail.value
  },
  bindUsernameInput: function (e) {
    this.data.nickName = e.detail.value
  },
  submit() {
    if (!this.data.fileID) {
      wx.showModal({
        title: '提示',
        content: '请录入人脸',
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
    wx.cloud.callFunction({
      name: 'waitFace',
      data: {
        name: this.data.nickName,
        telephone: this.data.telephone,
        fileID: this.data.fileID,
        sn: this.data.sn,
        status: 1
      }
    }).then((e) => {
      console.log(e)
      this.setData({
        hasSubmit: true,
        toSubmit: false
      })
      wx.showModal({
        title: '提示',
        content: '提交成功，请等待管理员审核',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    })
  },
  onShow: function () {
    const tempFilePaths = app.globalData.imgSrc
    if (tempFilePaths) {
      wx.showLoading({
        title: '上传中',
      })
      const filePath = tempFilePaths
      // 上传图片
      const cloudPath = this.data.openid + filePath.match(/\.[^.]+?$/)[0]
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: res => {
          app.globalData.imgSrc = ''
          this.setData({
            fileID: res.fileID
          })
          console.log('[上传文件] 成功：', res)
        },
        fail: e => {
          console.error('[上传文件] 失败：', e)
          wx.showToast({
            icon: 'none',
            title: '上传失败',
          })
        },
        complete: () => {
          wx.hideLoading({
            fail: () => { }
          })
        }
      })
    }
  }
})