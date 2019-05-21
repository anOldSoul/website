var app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    eventType: '',
    isSelect: true,
    isDownPrice: false,
    isUpPrice: false,
    tip: '',
    inputSearch: '',
    rangeList: [],
    tips: '',
    categoryId: '',
    orderBy: 'payUserCount',
    activeIndex: 0,
    goodList: []
  },
  onShow() {
    this.setData({
      activeIndex: wx.getStorageSync('CATEGORY_INDEX') || 0
    })
    wx.setStorageSync('CATEGORY_INDEX', '')
    if (this.data.rangeList.length) {
      this.getGoodsData()
    }
  },
  clickSeachBarAction() {
    wx.navigateTo({
      url: `/pages/search/index`
    })
  },
  onLoad: function () {
    this.getCategory()
  },
  formSubmit: function (e) {
    app.functions.getFormId(e.detail.formId)
  },
  handleFilterBySale() {
    this.setData({
      isSelect: true,
      isDownPrice: false,
      isUpPrice: false
    })
  },
  handleFilterByPrice() {
    this.data.isSelect = false
    if (this.data.isSelect) {
      this.setData({
        isUpPrice: true,
        isDownPrice: false,
        isSelect: false
      })
    } else {
      if (this.data.isUpPrice) {
        this.data.orderBy = 'presentPrice'
        this.setData({
          isUpPrice: false,
          isDownPrice: true,
          isSelect: false
        })
      } else {
        this.data.orderBy = '-presentPrice'
        this.setData({
          isUpPrice: true,
          isDownPrice: false,
          isSelect: false
        })
      }
    }
    this.getGoodsData()
  },
  goDetail: function (e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/goodDetail/index?goodsId=' + item.id
    })
  },
  getGoodsData: function () {
    wx.showLoading({
      title: '加载中',
    })
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID') || app.globalData.storeId,
      eventType: this.data.rangeList[this.data.activeIndex].eventType,
      orderBy: this.data.orderBy
    }
    app.post(app.Apis.GET_CATEGORY_GOODS, data, result => {
      if (result.success) {
        wx.hideLoading()
        let tempGoodList = result.dataList
        if (tempGoodList.length == 0) {
          this.setData({
            tips: '很抱歉，暂无符合要求商品哦！'
          })
        }
        this.setData({
          goodList: tempGoodList
        })
        wx.hideLoading()
      }
    })
  },
  getCategory: function() {
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID') || app.globalData.storeId
    }
    app.post(app.Apis.GET_CATEGORY, data, result => {
      if (result.success) {
        this.setData({
          rangeList: result.dataList
        })
        this.getGoodsData()
      }
    })
  },
  handleTabClick: function(e) {
    this.setData({
      activeIndex: e.currentTarget.dataset.index
    })
    this.getGoodsData()
  }
})
