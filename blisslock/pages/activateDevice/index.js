// pages/index/index.js
const app = getApp()
Page({
  data: {
  },
  onLoad: function (options) {
    let func = options.func
    if (func === 'addPw') {
      app.util.doBLEConnection('addPass', '', options.pw)
    }
    if (func === 'unlockRecord') {
      app.util.doBLEConnection('unlockRecord')
    }
    // if (func === 'syncPw') {
    //   return new Promise((resolve, reject) => {
    //     app.util.doBLEConnection('syncPass', resolve)
    //   }).then(() => {
    //     console.log('监听成功')
    //     console.log(wx.getStorageSync('pwData'))
    //     let str = wx.getStorageSync('pwData')
    //     var strArr = [];
    //     var n = 8;
    //     for (var i = 0, l = str.length; i < l / n; i++) {
    //       var a = str.slice(n * i, n * (i + 1));
    //       strArr.push(a);
    //     }
    //     this.setData({
    //       pwArr: strArr
    //     })
    //   })
    // }
  },
  handleClose: function() {
    wx.navigateBack({
      delta: 1
    })
  }
})