// pages/newHome/index.js
const app = getApp()
Page({
  data: {
    pwArr: [],
    connected: false,
    chs: []
  },
  manage_password() {
    app.util.doBLEConnection('addFinger')
  },
  sync_password() {
    return new Promise((resolve, reject) => {
      app.util.doBLEConnection('syncFinger', resolve)
    }).then(() => {
      console.log('监听成功')
      console.log(wx.getStorageSync('fingerData'))
      let str = wx.getStorageSync('fingerData')
      console.log('-------------')
      console.log(str)
      var strArr = [];
      var n = 8;
      for (var i = 0, l = str.length; i < l / n; i++) { 
        var a = str.slice(n * i, n * (i + 1));
        strArr.push(a); 
      }
      console.log(strArr)
      this.setData({
        pwArr: strArr
      })
    })
  },
  onLoad: function (options) {
    let msg
    let delResult = options.result
    if (delResult === '30') {
      msg = '删除成功'
    }
    if (delResult === '31') {
      msg = '本地指纹ID不存在'
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
    this.setData({
      pwArr: wx.getStorageSync('fingerData')
    })
  },
  onShow: function () {
  },
  goDetail: function (e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/goodDetail/index?goodsId=${item.id}&eventType=selected_hot`
    })
  }
})