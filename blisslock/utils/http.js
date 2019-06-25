
const MD5 = require("./md5.min.js");
const Api = require('../config')
var vType = 'web'
var vCode = 116
var token = '000'
var platform = 'web'
var apiEntry = "https://app.openn.cn/wx/authsend/login_by_weixin"
var _request = function (method, api, data, success, fail) {
  data.platform = platform
  data.method = api[0]
  data.path = api[1]
  data.sign = MD5(api[0] + api[1] + MD5(vType))
  data.vCode = vCode
  data.vType = vType
  data.token = token
  wx.showLoading({
    title: '加载中',
  })
  wx.request({
    url: apiEntry,
    method: method,
    data: data,
    success: function (res) {
      // console.log(res)
      wx.hideLoading()
      success(res.data)
    },
    fail: fail
  })
}
var get = function(req){
  _request('GET', req)
}
var post = function (api, data, success, fail){
  _request('POST', api, data, success, fail)
}

module.exports = {
  get: get,
  post: post,
  vCode: vCode
}