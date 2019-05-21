var app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    totalNum: 0,
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    tips: '',
    categoryId: '',
    activeIndex: 0,
    rangeGoodsList: [],
    rangeList: [],
    list: []
  },
  onLoad: function (option) {
    this.setData({
      activeIndex: option.secondCategory
    })
    this.getData()
    this.getCategory(option.firstCategory, option.secondCategory)
  },
  getCategory: function(index, index1) {
    app.post(app.Apis.GET_CATEGORY, {}, result => {
      if (result.success) {
        // resolve()
        this.setData({
          rangeList: result.dataList[index].onlineMallGoodsCategoryList
        })
        wx.setNavigationBarTitle({
          title: this.data.rangeList[this.data.activeIndex].name
        })
        this.getGoodsData(index1)
      }
    })
  },
  goDetail: function(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/goodDetail/index?goodsId=${item.id}`
    })
  },
  getData: function() {
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID'),
      userId: wx.getStorageSync('YJF_UERID')
    }
    app.post(app.Apis.GET_CART, data, result => {
      if (result.success) {
        this.data.list = result.dataList
        let tempTotalNum = 0
        this.data.list.forEach((item, index) => {
          tempTotalNum += parseInt(item.goodsNumber)
        })
        this.setData({
          totalNum: tempTotalNum
        })
      }
    })
  },
  handleBuy: function(e) {
    let num = 0
    let id = e.currentTarget.dataset.item.id
    this.data.list.forEach((item, index) => {
      if (item.goodsId == id) {
        num = item.goodsNumber
      }
    })
    this.handleJoinIn(num, id)
  },
  handleJoinIn: function(num, id) {
    wx.showLoading({
      title: '加载中'
    })
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID'),
      goodsId: id,
      userId: wx.getStorageSync('YJF_UERID'),
      goodsNumber: num + 1
    }
    app.post(app.Apis.POST_CART, data, result => {
      if (result.success) {
        this.getData()
        wx.hideLoading()
        wx.showToast({
          title: '加入购物车成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  getGoodsData: function(index1) {
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID'),
      categoryId: this.data.rangeList[index1].id,
      orderBy: 'goodsRemarks'
    }
    app.post(app.Apis.GET_CATEGORY_GOODS, data, result => {
      if (result.success) {
        wx.hideLoading()
        let tempGoodList = result.dataList
        if (tempGoodList.length == 0) {
          this.setData({
            tips: '很抱歉，暂无符合要求商品哦！'
          })
        } else {          
          tempGoodList.forEach((item, index) => {
            // item.name = item.name.length > 22 ? item.name.substring(0, 22) + '...' : item.name
            item.imgUrl = JSON.parse(item.imageUrl).baseUrl + JSON.parse(item.imageUrl).bannerName[0]
          })
          this.setData({
            rangeGoodsList: tempGoodList
          })
        }
      }
    })
  },
  goShoppingCart: function() {
    wx.switchTab({
      url: '/pages/shoppingCart/index'
    })
  },
  handleTabClick: function(e) {
    this.setData({
      activeIndex: e.currentTarget.dataset.index
    })
    this.getGoodsData(this.data.activeIndex)
  }
})
