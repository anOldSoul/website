// pages/newHome/index.js
const app = getApp()
Page({
  data: {
    pw: ''
  },
  onLoad: function (options) {
    this.setData({
      pw: options.pw
    })
  },
  onShow: function () {
  },
  goDetail: function (e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/goodDetail/index?goodsId=${item.id}&eventType=selected_hot`
    })
  }
})