var app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    codeImg: '',
    exchangeMoneyValue: '',
    fans: []
  },
  onLoad: function () { 
  },
  onShow: function() {
    let userId = wx.getStorageSync('YJF_UERID')
    if (!userId) {
      wx.redirectTo({
        url: `../index/index`
      })
      return
    }
    this.getCodeImgUrl()
    this.getService()
    this.getInviteeDetail()
  },
  getCodeImgUrl: function() {
    let data = {
      mainStoreId: wx.getStorageSync('YJF_STORE_ID'),
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
  getInviteeDetail: function() {
    let data = {
      inviterUserId: wx.getStorageSync('YJF_UERID'),
      storeId: wx.getStorageSync('YJF_STORE_ID')
    }
    app.post(app.Apis.GET_INVITEE_DETAIL, data, result => {
      if (result.success) {
        this.setData({
          fans: result.dataList
        })
      }
    })
  },
  goTixian: function() {
    wx.navigateTo({
      url: `/pages/tixian/index?currentPopularityValue=${this.data.exchangeMoneyValue}`
    })
  },
  getService: function() {
    let data = {
      inviterUserId: wx.getStorageSync('YJF_UERID'),
      storeId: wx.getStorageSync('YJF_STORE_ID')
    }
    app.post(app.Apis.GET_INVITER, data, result => {
      if (result.success) {
        this.setData({
          exchangeMoneyValue: result.data.exchangeMoneyValue
        })
      }
    })
  }
})
