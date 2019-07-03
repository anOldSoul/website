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
    let str = app.util.getDeviceItem('pwData') || ''
    var strArr = [];
    var n = 8;
    for (var i = 0, l = str.length; i < l / n; i++) {
      var a = str.slice(n * i, n * (i + 1));
      strArr.push(a);
    }
    let delPass = app.util.getDeviceItem('delPass') || ''
    let index = strArr.indexOf(delPass);
    if (index > -1) {
      strArr.splice(index, 1);
    }
    let formatPwArr = strArr.map((item, index) => {
      let result = {}
      let pwArr = app.util.getDeviceItem('pwArr') || []
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
    app.util.updateDeviceList('pwArr', formatPwArr)
    this.setData({
      pwArr: app.util.getDeviceItem('pwArr')
    })
  },
  onLoad: function (options) {
  },
  onShow: function () {
    wx.hideLoading()
    isBack = app.util.getDeviceItem('isPwSycBack')
    app.util.updateDeviceList('isPwSycBack', false)
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
    let addPw = app.util.getDeviceItem('addPw') || {}
    if (addPw.result && addPw.id) {
      let status = addPw.result
      let title
      if (status === '31') {
        title = '注册失败'
      }
      if (status === '32') {
        title = '密码已满'
      }
      if (status === '30') {
        title = '添加成功'
        let pwArr = app.util.getDeviceItem('pwArr')|| []
        pwArr.push({
          id: addPw.id,
          name: addPw.name
        })
        app.util.updateDeviceList('pwArr', pwArr)
      }
      wx.showToast({
        title: title,
        icon: 'none',
        duration: 2000
      })
      app.util.updateDeviceList('addPw', {})
    }
    if (app.util.getDeviceItem('delPw')) {
      let status = app.util.getDeviceItem('delPw')
      let title = ''
      if (status === '30') {
        title = '删除成功'
      }
      if (status === '31') {
        title = '删除失败'
      }
      if (status === '32') {
        title = '删除本地密码ID不存在'
      }
      wx.showToast({
        title: title,
        icon: 'none',
        duration: 2000
      })
      app.util.updateDeviceList('delPw', false)
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