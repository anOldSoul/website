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
  },
  sync_password() {
    wx.navigateTo({
      url: `/pages/activateDevice/index?func=syncFinger`
    })
  },
  formatFinger: function () {
    let str = app.util.getDeviceItem('fingerData') || ''
    var strArr = [];
    var n = 8;
    for (var i = 0, l = str.length; i < l / n; i++) {
      var a = str.slice(n * i, n * (i + 1));
      strArr.push(a);
    }
    let delFinger = app.util.getDeviceItem('delFinger')
    let index = strArr.indexOf(delFinger);
    if (index > -1) {
      strArr.splice(index, 1);
    }
    let formatPwArr = strArr.map((item, index) => {
      let result = {}
      let pwArr = app.util.getDeviceItem('fingerArr')|| []
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
    app.util.updateDeviceList('fingerArr', formatPwArr)
    this.setData({
      pwArr: app.util.getDeviceItem('fingerArr')
    })
  },
  onLoad: function (options) {
  },
  onShow: function () {
    wx.hideLoading()
    isSycBack = app.util.getDeviceItem('isFingerSycBack')
    app.util.updateDeviceList('isFingerSycBack', false)
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
    let addFinger = app.util.getDeviceItem('addFinger') || {}
    if (addFinger.result && addFinger.id) {
      let status = addFinger.result
      let title = ''
      if (status === '31') {
        title = '注册失败'
      }
      if (status === '32') {
        title = '指纹已满'
      }
      if (status === '30') {
        title = '添加成功'
        let pwArr = app.util.getDeviceItem('fingerArr') || []
        pwArr.push({
          id: addFinger.id,
          name: addFinger.name
        })
        app.util.updateDeviceList('fingerArr', pwArr)
      }     
      wx.showToast({
        title: title,
        icon: 'none',
        duration: 2000
      })
      app.util.updateDeviceList('addFinger', {})
    }
    if (app.util.getDeviceItem('delFinger')) {
      let status = app.util.getDeviceItem('delFinger')
      let title = ''
      if (status === '30') {
        title = '删除成功'
      }
      if (status === '31') {
        title = '删除失败'
      }
      if (status === '32') {
        title = '删除本地指纹ID不存在'
      }
      wx.showToast({
        title: title,
        icon: 'none',
        duration: 2000
      })
      app.util.updateDeviceList('delFinger', false)
    }
    this.formatFinger()
  }
})