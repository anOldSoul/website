//app.js
const Api = require('./config')
const http = require("./utils/http.js");
const util = require("./utils/util.js");
const Moment = require('./utils/moment.min.js')
App({
  util: util,
  Moment: Moment,
  onLaunch: function (options) {
  },
  Apis: Api,
  post: http.post,
  globalData: {
  }
})