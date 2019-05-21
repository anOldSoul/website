var app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    seviceList: {}
  },
  onLoad: function () {
    this.getService()
  },
  getService: function() {
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID')
    }
    app.post(app.Apis.GET_SERVICE, data, result => {
      if (result.success) {
        this.setData({
          seviceList: result.data
        })
      }
    })
  }
})
