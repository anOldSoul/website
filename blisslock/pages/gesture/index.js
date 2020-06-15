const app = getApp()
Page({
  data: {
    title: '',
    data: [],
    toUrl: '',
    errMsg: '',
    newGes: [],
    password: [],
    noForget: false
  },
  onLoad: function (options) {
    let gesturePw = wx.getStorageSync('gesturePw')
    this.setData({
      password: gesturePw.length ? gesturePw : [1, 2, 3, 4, 5, 6]
    })
    this.data.toUrl = options.url
    if (this.data.toUrl === 'member') {
      this.setData({
        title: '请输入旧手势密码',
        noForget: true
      })
    } else if (this.data.toUrl === 'init') {
      this.setData({
        title: '请设置手势密码',
        noForget: false
      })
    } else {
      this.setData({
        title: '请输入手势密码',
        noForget: true
      })
    }
  },
  handleForgerPw() {
    wx.showModal({
      title: '重置手势密码',
      content: '重置后会清空已绑定设备，需重新绑定后使用',
      confirmText: '重置',
      confirmColor: '#16BF98',
      success(res) {
        if (res.confirm) {
          let currentDeviceIndex = wx.getStorageSync('currentDevice')
          let deviceList = wx.getStorageSync('deviceList') || []
          let newDeviceList = deviceList.filter((item, index) => {
            return index !== currentDeviceIndex
          })
          wx.setStorageSync('deviceList', newDeviceList || [])
          wx.setStorageSync('gesturePw', [])
          wx.reLaunch({
            url: `/pages/index/index`
          })
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onEnd(data) {
    console.log(this.data.toUrl)
    let endGesture = data.detail.toString()
    if (this.data.toUrl === 'setNew' || this.data.toUrl === 'init') {
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
          app.util.updateDeviceList('showAdmPw', true)
          wx.navigateBack({
            delta: 1
          })
        } else if (this.data.toUrl === 'member') {
          this.data.toUrl = 'setNew'          
          this.setData({
            title: '请输入新手势密码',
            noForget: false
          })
        } else if (this.data.toUrl === 'unlockAtOnce') {
          app.util.doBLEConnection('unlockAtOnce')
        } else if (this.data.toUrl === 'lockAtOnce') {
          app.util.doBLEConnection('lockAtOnce')
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