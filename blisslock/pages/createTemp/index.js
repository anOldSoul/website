// pages/admPw/index.js
const app = getApp()
Page({
  data: {
    userName: '',
    createText: '开始创建',
    tempPw: ''
  },
  onLoad: function (options) {
    
  },
  getTempPwd: function () {
    if (!this.data.userName) {
      if (!this.data.userName) {
        wx.showToast({
          title: '请输入用户名',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }
    if (this.data.tempPw) {
      this.setData({
        createText: '开始创建',
        tempPw: '',
        userName: ''
      })
    } else {
      let pwd = app.util.getTempPassword()
      this.setData({
        createText: '继续创建',
        tempPw: pwd
      })
      let tempPw = wx.getStorageSync('tempPw') || []
      tempPw.push({
        userName: this.data.userName,
        tempPw: pwd,
        time: app.Moment().format('YYYY-MM-DD HH:mm:ss')
      })
      tempPw.reverse()
      tempPw = tempPw.slice(0, 200)
      wx.setStorageSync('tempPw', tempPw)
      wx.showToast({
        title: '创建成功',
        icon: 'none',
        duration: 2000
      })
    }
  },
  bindKeyInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  goRecord: function() {
    wx.navigateTo({
      url: `/pages/tempRecord/index`
    })
  },
  onShow: function () {
  }
})