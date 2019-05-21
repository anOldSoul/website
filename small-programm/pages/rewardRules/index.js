var app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    ruleList: '',
    ruleType: '',
    title: ''
  },
  onLoad: function (option) {
    let title
    this.data.ruleType = option.ruleType
    if (this.data.ruleType == 'bubu') {
      this.getBuBuRules()
      title = '走路赚钱，兑换好礼'
    } else {
      title = '邀请好友下单得现金奖励'
      this.getRules()
    }
    this.setData({
      title: title
    })
  },
  getBuBuRules: function () {
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID')
    }
    app.post(app.Apis.GET_BUBU_RULE, data, result => {
      if (result.success) {
        this.setData({
          ruleList: result.dataList
        })
      }
    })
  },
  getRules: function() {
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID')
    }
    app.post(app.Apis.GET_RULE, data, result => {
      if (result.success) {
        this.setData({
          ruleList: result.dataList
        })
      }
    })
  }
})
