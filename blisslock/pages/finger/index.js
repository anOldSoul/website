// pages/newHome/index.js
const app = getApp()
let isSycBack = false
let isAddBack = false
Page({
  data: {
    pwArr: [],
    connected: false,
    chs: []
  },
  manage_password() {
    wx.redirectTo({
      url: '/pages/addFinger/index'
    })
    // app.util.doBLEConnection('addFinger')
  },
  sync_password() {
    wx.navigateTo({
      url: `/pages/activateDevice/index?func=syncFinger`
    })
  },
  formatFinger: function () {
    let str = wx.getStorageSync('fingerData')
    var strArr = [];
    var n = 8;
    for (var i = 0, l = str.length; i < l / n; i++) {
      var a = str.slice(n * i, n * (i + 1));
      strArr.push(a);
    }
    let delFinger = wx.getStorageSync('delFinger')
    let index = strArr.indexOf(delFinger);
    if (index > -1) {
      strArr.splice(index, 1);
    }
    let formatPwArr = strArr.map((item, index) => {
      let result = {}
      let pwArr = wx.getStorageSync('fingerArr') || []
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
    wx.setStorageSync('fingerArr', formatPwArr)
    this.setData({
      pwArr: wx.getStorageSync('fingerArr')
    })
  },
  onLoad: function (options) {
  },
  onShow: function () {
    wx.hideLoading()
    isSycBack = wx.getStorageSync('isFingerSycBack')
    wx.setStorageSync('isFingerSycBack', false)
    if (isSycBack) {
      let title
      if (isSycBack === 'noData') {
        title = '指纹用户为空'
      } else {
        title = '同步成功'
      }
      wx.showToast({
        title: title,
        icon: 'none',
        duration: 2000
      })
    }
    isSycBack = false
    if (wx.getStorageSync('addFinger').result && wx.getStorageSync('addFinger').id) {
      let status = wx.getStorageSync('addFinger').result
      let title
      if (status === '31') {
        title = '注册失败'
      }
      if (status === '32') {
        title = '指纹已满'
      }
      if (status === '30') {
        title = '添加成功'
        let pwArr = wx.getStorageSync('fingerArr') || []
        pwArr.push({
          id: wx.getStorageSync('addFinger').id,
          name: wx.getStorageSync('addFinger').name
        })
        wx.setStorageSync('fingerArr', pwArr)
      }     
      wx.showToast({
        title: title,
        icon: 'success',
        duration: 2000
      })
      wx.setStorageSync('addFinger', {})
    }
    if (wx.getStorageSync('delFinger')) {
      wx.setStorageSync('delFinger', false)
      wx.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 2000
      })
    }
    this.formatFinger()
  },
  goDetail: function (e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/goodDetail/index?goodsId=${item.id}&eventType=selected_hot`
    })
  }
})