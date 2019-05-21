var app = getApp()
Page({
  data: {
    activeIndex: 0,
    eventTypeList: [],
    goodsList: []
  },
  onLoad() {
    this.getCategory()
  },
  handleTabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.dataset.index
    })
    this.data.eventType = this.data.eventTypeList[this.data.activeIndex].eventType
    this.getHotGoods()
  },
  getCategory: function () {
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID') || app.globalData.storeId,
      eventClassEnum: 'GIFT_GIVING'
    }
    app.post(app.Apis.GET_CATEGORY, data, result => {
      if (result.success) {
        this.setData({
          eventTypeList: result.dataList,
          eventType: result.dataList[0].eventType
        })
        this.getHotGoods()
      }
    })
  },
  getHotGoods: function () {
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID') || app.globalData.storeId,
      eventType: this.data.eventType
    }
    app.post(app.Apis.GET_EVENT_GOODS, data, result => {
      if (result.success) {
        let tempGoodList = result.dataList.map((item, index) => {
          item.name1 = item.name
          item.imgUrl = JSON.parse(item.imageUrl).baseUrl + JSON.parse(item.imageUrl).bannerName[0]
          return item
        })
        this.setData({
          goodsList: tempGoodList
        })
      }
    })
  },
  goDetail: function (e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/goodDetail/index?goodsId=${item.id}&tuanType=gift`
    })
  }
})