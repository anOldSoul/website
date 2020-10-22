const app = getApp()
Page({
  data: {
    telephone: '',
    nickName: ''
  },
  onLoad: function (options) {
  },
  onAdd: function () {
    const db = wx.cloud.database()
    db.collection('faces').add({
      data: {
        name: this.data.nickName,
        sn: wx.getStorageSync('sn'),
        status: 1,
        telephone: this.data.telephone
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        wx.navigateBack({
          delta: 1
        })
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
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
    this.onAdd()
  },
  onShow: function () {
  }
})