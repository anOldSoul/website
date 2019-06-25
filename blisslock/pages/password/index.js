// pages/newHome/index.js
const app = getApp()
let isBack = false
Page({
  data: {
    pwArr: [],
    connected: false,
    chs: []
  },
  manage_password() {
    app.util.doBLEConnection('addPass')
  },
  sync_password() {
    wx.navigateTo({
      url: `/pages/activateDevice/index?func=syncPw`
    })
    // return new Promise((resolve, reject) => {
    //   app.util.doBLEConnection('syncPass', resolve)
    //   wx.navigateTo({
    //     url: `/pages/activateDevice/index`
    //   })
    // }).then(() => {
    //   console.log('监听成功')
    //   isBack = true
    //   console.log(wx.getStorageSync('pwData'))
    //   this.formatPw()
    // })
  },
  formatPw: function() {
    let str = wx.getStorageSync('pwData')
    console.log(str)
    var strArr = [];
    var n = 8;
    for (var i = 0, l = str.length; i < l / n; i++) {
      var a = str.slice(n * i, n * (i + 1));
      strArr.push(a);
    }
    let delPass = wx.getStorageSync('delPass')
    let index = strArr.indexOf(delPass);
    if (index > -1) {
      strArr.splice(index, 1);
    }
    this.setData({
      pwArr: strArr
    })
  },
  onLoad: function (options) {
  },
  onShow: function () {
    wx.hideLoading()
    isBack = wx.getStorageSync('isPwSycBack')
    wx.setStorageSync('isPwSycBack', false)
    if (isBack) {
      let title
      if (isBack === 'noData') {
        title = '密码用户为空'
      } else {
        title = '同步成功'
      }
      wx.showToast({
        title: title,
        icon: 'none',
        duration: 2000
      })
    }
    isBack = false
    if (wx.getStorageSync('addPw')) {
      let status = wx.getStorageSync('addPw')
      let title
      if (status === '31') {
        title = '注册失败'
      }
      if (status === '32') {
        title = '密码已满'
      }
      if (status === '30') {
        title = '添加成功'
      }
      wx.showToast({
        title: title,
        icon: 'success',
        duration: 2000
      })
      wx.setStorageSync('addPw', false)
    }
    if (wx.getStorageSync('delPw')) {
      wx.setStorageSync('delPw', false)
      wx.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 2000
      })
    }
    this.formatPw()
  },
  goDetail: function (e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/goodDetail/index?goodsId=${item.id}&eventType=selected_hot`
    })
  }
})