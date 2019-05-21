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
  onShow: function (options) {
    if (options.referrerInfo && options.referrerInfo.extraData) {
      this.globalData.extraData = options.referrerInfo.extraData
    }
  },
  Apis: Api,
  post: http.post,
  globalData: {
    storeId: '9990000',
    wechatId: 'carelinker_xcx_taomama',
    userInfo: null,
    userId: '',
    unionId: '',
    openid: '',
    extraData: null,
    vCode: http.vCode
  }
})