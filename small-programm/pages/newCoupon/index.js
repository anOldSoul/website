var app = getApp()
Page({
  data: {
    sliderOffset: 0,
    unclaimedList: [],
    bannerImg: []
  },
  getBanner: function() {
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID')
    }
    app.post(app.Apis.GET_BANNER, data, result => {
      if (result.success) {       
        this.setData({
          bannerImg: result.data
        })
      }
    })
  },
  // 待领取
  getUnclaimedList() {
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID'),
      couponClassTypeEnum: 'SELF_RECEIVE',
      userId: wx.getStorageSync('YJF_UERID')
    }
    app.post(app.Apis.GET_COUPONS, data, result => {
      wx.hideLoading()
      this.setData({
        unclaimedList: result.dataList
      })
    })
  },
  getData() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    this.getUnclaimedList()
  },
  afterGetData() {
    wx.hideLoading()
    wx.stopPullDownRefresh()
  },
  // 立即领取
  handleToReceive(e) {
    let id = e.currentTarget.id
    wx.showLoading({
      title: '领取中...',
      mask: true
    })
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID'),
      userId: wx.getStorageSync('YJF_UERID'),
      classId: id
    }
    app.post(app.Apis.POST_COUPON, data, result => {
      wx.hideLoading()
      if (result.data) {
        wx.showToast({
          title: '领取成功!',
          duration: 2000,
          success: () => {
            // this.getData()
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '您已经领过该券，不可重复领取哦!',
          showCancel: false
        })
      }
    })
  },
  // 立即使用
  handleGoDetail(e) {
    let btnType = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '/pages/coupon/detail/index',
      success: () => {
      }
    })
  },
  onLoad: function () {
    this.getBanner()
  },
  onPullDownRefresh() {
    this.getData()
  },
  onShow() {
    this.getData()
  }
})