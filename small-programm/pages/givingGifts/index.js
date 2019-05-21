var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    autoplay: true,
    interval: 5000,
    duration: 500,
    indicatorDots: false,
    giftId: '',
    givingId: '',
    blessings: ''
  },
  onShareAppMessage: function (res) {
    return {
      title: '送你一份甄选健康好礼，填写地址就送货到家哦！',
      path: `/pages/givingGifts/index?giftId=${this.data.giftId}&giverUserId=${wx.getStorageSync('YJF_UERID')}`
    }
  },
  onLoad: function (option) {
    this.data.giftId = option.giftId
    this.data.giverUserId = option.giverUserId || ''
    let userId = wx.getStorageSync('YJF_UERID')
    if (!userId) {
      wx.navigateTo({
        url: `../index/index`
      })
      return
    }    
  },
  onShow() {
    this.getData()
  },
  onChangeBanner: function (e) {
    this.setData({
      current: e.detail.current
    })
  },
  handlebtn() {
    if (this.data.giftData.jumpPageEnum === 'GIFT_GIVING') {
      wx.navigateTo({
        url: `../gifts/index`
      })
      return
    }
    if (this.data.giftData.jumpPageEnum === 'FILL_IN_ADDRESS') {
      wx.navigateTo({
        url: `../fillOrder/index?giftId=${this.data.giftId}&orderType=gift`
      })
      return
    }
  },
  getData: function() {
    let data = {
      giftId: this.data.giftId,
      userId: wx.getStorageSync('YJF_UERID'),
    }
    if (this.data.giverUserId) {
      data.giverUserId = this.data.giverUserId
    }
    app.post(app.Apis.GET_GIFT_DETAIL, data, result => {
      if (result.success) {
        this.setData({
          giftData: result.data
        })
      }
    })
  }
})