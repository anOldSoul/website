var app = getApp()
Page({
  data: {
    activeIndex: '',
    blessing: []
  },
  onLoad: function (option) {
    this.getBlessing()
  },
  getBlessing() {
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID')
    }
    app.post(app.Apis.GET_GIFT_BLESSINGS, data, result => {
      if (result.success) {
        this.setData({
          blessing: result.dataList
        })
      }
    })
  },
  handleTabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.dataset.index
    })
    wx.setStorageSync('SELECT_BLESSING', this.data.blessing[this.data.activeIndex])
    wx.navigateBack({
      delta: 1
    })
  }
})