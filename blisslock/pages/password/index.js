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
  },
  formatPw: function() {
    let str = wx.getStorageSync('pwData')
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
    let formatPwArr = strArr.map((item, index) => {
      let result = {}
      let pwArr = wx.getStorageSync('pwArr') || []
      let exist = pwArr.find((item1, index) => {
        if (item1) {
          return item === item1.id
        }
      })
      if (exist) {
        result.id = exist.id
        result.name = exist.name
      } else {
        result.id = item
        result.name = '匿名'
      }
      return result
    })
    wx.setStorageSync('pwArr', formatPwArr)
    this.setData({
      pwArr: wx.getStorageSync('pwArr')
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
    if (wx.getStorageSync('addPw').result && wx.getStorageSync('addPw').id) {
      let status = wx.getStorageSync('addPw').result
      let title
      if (status === '31') {
        title = '注册失败'
      }
      if (status === '32') {
        title = '密码已满'
      }
      if (status === '30') {
        title = '添加成功'
        let pwArr = wx.getStorageSync('pwArr') || []
        pwArr.push({
          id: wx.getStorageSync('addPw').id,
          name: wx.getStorageSync('addPw').name
        })
        wx.setStorageSync('pwArr', pwArr)
      }
      wx.showToast({
        title: title,
        icon: 'success',
        duration: 2000
      })
      wx.setStorageSync('addPw', {})
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