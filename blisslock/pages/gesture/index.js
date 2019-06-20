Page({
  data: {
    title: '',
    data: [],
    toUrl: '',
    errMsg: '',
    newGes: [],
    password: [1, 2, 3, 6, 9]
  },
  onLoad: function (options) {
    let gesturePw = wx.getStorageSync('gesturePw')
    this.data.password = gesturePw.length ? gesturePw : [1, 2, 3, 4, 5, 6]
    this.data.toUrl = options.url
    if (this.data.toUrl === 'member') {
      this.setData({
        title: '请输入旧手势密码'
      })
    } else {
      this.setData({
        title: '请输入手势密码'
      })
    }
  },
  onEnd(data) {
    console.log(this.data.toUrl)
    let endGesture = data.detail.toString()
    if (this.data.toUrl === 'setNew') {
      this.data.newGes = data.detail
      this.data.toUrl = 'setNewAgain'
      this.setData({
        title: '请再次输入新手势密码'
      })
    } else if (this.data.toUrl === 'setNewAgain') {
      if (endGesture === this.data.newGes.toString() && this.data.newGes.length) {
        wx.setStorageSync('gesturePw', this.data.newGes)
        wx.showModal({
          title: '提示',
          content: '设置成功',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        this.data.toUrl = 'setNew'
        this.data.newGes = []
        this.setData({
          title: '两次输入不一致，请重新设置'
        })
      }
    } else {
      if (endGesture === this.data.password.toString()) {
        if (this.data.toUrl === 'checkAdmPw') {
          wx.setStorageSync('showAdmPw', true)
          wx.navigateBack({
            delta: 1
          })
        } else if (this.data.toUrl === 'member') {
          this.data.toUrl = 'setNew'          
          this.setData({
            title: '请输入新手势密码'
          })
        } else {
          wx.redirectTo({
            url: `/pages/${this.data.toUrl}/index`
          })
        }
      } else {
        this.setData({
          errMsg: '手势密码错误，请重新输入'
        })
        setTimeout(() => {
          this.setData({
            errMsg: ''
          })
        }, 2000)
      }
    }
  }
})