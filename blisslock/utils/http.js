
const MD5 = require("./md5.min.js");
const Api = require('../config')
var vType = 'web'
var vCode = 116
var token = '000'
var platform = 'web'
var apiEntry = "https://app.openn.cn"
var _request = function (method, api, data, success, fail) {
  wx.showLoading({
    title: '加载中',
  })
  wx.request({
    url: apiEntry + api[1],
    method: api[0],
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