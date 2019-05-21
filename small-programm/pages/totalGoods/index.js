var app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    orderId: '',
    showAfterSaleApplyButton: '',
    totalNum: 0,
    list: []
  },
  onLoad: function (option) {
    console.log(option.showAfterSaleApplyButton)
    this.setData({
      orderId: option.orderId,
      showAfterSaleApplyButton: option.showAfterSaleApplyButton === '1' ? true : false
    })
  },
  onShow: function() {
    this.getData()
  },
  getData: function() {
    let data = {
      orderId: this.data.orderId
    }
    app.post(app.Apis.GET_ORDER_DETAIL, data, result => {
      if (result.success) {
        result.dataList.forEach((item, index) => {
          item.imgUrl = JSON.parse(item.imageUrl).baseUrl + JSON.parse(item.imageUrl).bannerName[0]
        })
        this.setData({
          list: result.dataList
        })
        this.handleTotal()
      }
    })
  },
  handleChase: function() {
    wx.navigateTo({
      url: '/pages/status/index?orderId=' + this.data.orderId
    })
  },
  handleAfterApply: function (e) {
    wx.navigateTo({
      url: `/pages/refunds/index?orderId=${this.data.orderId}`
    })
  },
  handleTotal: function() {
    let totalNum = 0
    this.data.list.forEach((item, index) => {
      totalNum += parseInt(item.goodsNumber)
    })
    this.setData({
      totalNum: totalNum
    })
  }
})
