var app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    orderId: '',
    detailList: []
  },
  onLoad: function (option) {
    this.getData()
  },
  getData: function() {
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID'),
      inviterUserId: wx.getStorageSync('YJF_UERID')
    }
    app.post(app.Apis.GET_REWARD_DETAIL, data, result => {
      if (result.success) {
        this.setData({
          detailList: result.dataList
        })
      }
    })
  },
})
