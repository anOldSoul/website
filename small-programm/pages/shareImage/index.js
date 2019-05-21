var app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    imageUrl: '',
    codeImg: ''
  },
  onLoad: function () {
    this.getImageUrl()
  },
  onShow: function() {
    this.getCodeImgUrl()
  },
  getCodeImgUrl: function () {
    let data = {
      mainStoreId:wx.getStorageSync('YJF_STORE_ID'),
      userId: wx.getStorageSync('YJF_UERID'),
      wechatId: app.globalData.wechatId
    }
    app.post(app.Apis.GET_CODE_SHARE, data, result => {
      if (result.success) {
        this.setData({
          codeImg: result.data
        })
      }
    })
  },
  getImageUrl: function() {
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID')
    }
    app.post(app.Apis.GET_BACKGROUND_URL, data, result => {
      if (result.success) {
        this.setData({
          imageUrl: result.data
        })
      }
    })
  }
})
