// pages/newHome/index.js
const app = getApp()
Page({
  data: {
    pw: '',
    id: ''
  },
  del_finger() {
    wx.setStorageSync('delFingerId' ,this.data.pw)
    app.util.doBLEConnection('delFinger')
  },
  onLoad: function (options) {
    this.setData({
      pw: options.pw,
      id: options.id
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