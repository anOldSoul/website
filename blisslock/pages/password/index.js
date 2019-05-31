// pages/newHome/index.js
const app = getApp()
Page({
  data: {
    pwArr: [1111, 1111, 1111, 1111, 1111, 1111, 1111, 1111, 1111, 3444],
    connected: false,
    chs: []
  },
  manage_password() {
    app.util.doBLEConnection('addPass')
  },
  sync_password() {
    return new Promise((resolve, reject) => {
      app.util.doBLEConnection('syncPass', resolve)
    }).then(() => {
      console.log('监听成功')
      console.log(wx.getStorageSync('pwData'))
      let str = wx.getStorageSync('pwData')
      var strArr = [];
      var n = 8;
      for (var i = 0, l = str.length; i < l / n; i++) { 
        var a = str.slice(n * i, n * (i + 1));
        strArr.push(a); 
      }
      this.setData({
        pwArr: strArr
      })
    })
  },
  onLoad: function (options) {
    let that = this;
    app.watch(that.watchBack)
  },
  watchBack: function (name) {
    console.log(22222);
    console.log('this.name==' + name)
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