var app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    inputSearch: '',
    searchResult: []
  },
  onShow() {
    this.setData({
      activeIndex: wx.getStorageSync('CATEGORY_INDEX') || 0
    })
    wx.setStorageSync('CATEGORY_INDEX', '')
  },
  onLoad: function () {
  },
  goDetail: function (e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/goodDetail/index?goodsId=' + item.id
    })
  },
  handleCancel: function () {
    this.setData({
      inputSearch: '',
      searchResult: [],
      tip: ''
    })
  },
  bindblur: function (e) {
    var value = e.detail.value
    this.setData({
      inputSearch: e.detail.value
    })
    if (value) {
      wx.showLoading({
        title: '加载中',
      })
      let data = {
        storeId: wx.getStorageSync('YJF_STORE_ID'),
        searchTerms: value
      }
      app.post(app.Apis.GET_SEARCH, data, result => {
        if (result.success) {
          if (result.dataList.length > 0) {
            this.setData({
              searchResult: result.dataList
            })
          } else {
            this.setData({
              searchResult: [],
              tip: '未搜索到符合商品'
            })
          }
          wx.hideLoading()
        }
      })
    } else {
      this.setData({
        searchResult: []
      })
    }
  }
})
