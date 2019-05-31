//app.js
const Api = require('./config')
const http = require("./utils/http.js");
const util = require("./utils/util.js");
const Moment = require('./utils/moment.min.js')
import Functions from './common/common.js'
import { ToastPannel } from './component/toast/toast'
App({
  util: util,
  Moment: Moment,
  ToastPannel,
  functions: Functions,
  onLaunch: function (options) {
    console.log(options)
  },
  watch: function (method) {
    var obj = this.globalData;
    Object.defineProperty(obj, "name", {
      configurable: true,
      enumerable: true,
      set: function (value) {
        this._name = value;
        console.log('是否会被执行2')
        method(value);
      },
      get: function () {
        // 可以在这里打印一些东西，然后在其他界面调用getApp().globalData.name的时候，这里就会执行。
        return this._name
      }
    })
  },
  onShow: function (options) {
    if (options.referrerInfo && options.referrerInfo.extraData) {
      this.globalData.extraData = options.referrerInfo.extraData
    }
  },
  Apis: Api,
  post: http.post,
  globalData: {
    name: 'msr',
    userInfo: null,
    userId: '',
    unionId: '',
    openid: '',
    extraData: null,
    vCode: http.vCode
  }
})