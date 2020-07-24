//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function() {
    const udp = wx.createUDPSocket()
    let test = { func: "StartTransfer", imgcnt: 1, width: 320, heigh: 240, type: "RGB888" }
    udp.bind()
    udp.onListening(function (res) {
      console.log('监听中...')
      console.log(res)
    })
    let that = this
    udp.onMessage(function (res) {
      console.log(res)
    })
    udp.send({
      address: '192.168.1.105',
      port: 6125,
      message: JSON.stringify(test)
    })
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
