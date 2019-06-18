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
    return new Promise((resolve, reject) => {
      app.util.doBLEConnection('syncPass', resolve)
      wx.navigateTo({
        url: `/pages/activateDevice/index`
      })
    }).then(() => {
      console.log('监听成功')
      isBack = true
      console.log(wx.getStorageSync('pwData'))
      this.formatPw()
    })
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
    let msg
    let delResult = options.result
    if (delResult === '30') {
      msg = '删除成功'
    }
    if (delResult === '31') {
      msg = '本地密码ID不存在'
    }
    if (delResult === '32') {
      msg = '删除失败'
    }
    if (msg) {
      wx.showToast({
        title: msg,
        icon: 'success',
        duration: 2000
      })
    }
  },
  onShow: function () {
    if (isBack) {
      wx.showToast({
        title: '同步成功',
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