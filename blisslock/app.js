//app.js
const Api = require('./config')
const http = require("./utils/http.js");
const util = require("./utils/util.js");
const Moment = require('./utils/moment.min.js')
App({
  util: util,
  Moment: Moment,
  onLaunch: function (options) {
    wx.onBLEConnectionStateChange(function (res) {
      // 该方法回调中可以用于处理连接意外断开等异常情况
      console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
    })
  },
  Apis: Api,
  post: http.post,
  globalData: {
  }
})