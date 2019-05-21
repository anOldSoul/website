var app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    exchangeList: []
  },
  onShow: function() {
  },
  onLoad: function (option) {
    this.getExchangeList()
  },
  onShareAppMessage: function (res) {
    return {
      title: '健康甄选，更多关爱',
      imageUrl: '../../images/share_step.png',
      path: `/pages/index/index?inviteType=step&inviterUserId=${wx.getStorageSync('YJF_UERID')}`
    }
  },
  goDetail: function (e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/goodDetail/index?goodsId=${item.id}&eventType=group_purchase`
    })
  },
  getExchangeList: function() {
    let data = {
      userId: wx.getStorageSync('YJF_UERID'),
      storeId: wx.getStorageSync('YJF_STORE_ID'),
      eventType: 'group_purchase',
      orderBy: 'groupPurchasePrice',
      isDesc: false
    }
    app.post(app.Apis.GET_EVENT_GOODS, data, result => {
      if (result.success) {
        this.setData({
          exchangeList: result.dataList.map((item, index) => {
            item.imgUrl = JSON.parse(item.imageUrl).baseUrl + JSON.parse(item.imageUrl).bannerName[0]
            return item
          })
        })
      }
    })
  }
})
