var app = getApp()

Page({
  data: {
    detailList: [],
    imgUrls: [],
    autoplay: false,
    interval: 5000,
    duration: 500,
    indicatorDots: true,
    goodInfo: {},
    cart_num: 0,
    myHealthMoney: '',
    currentNum: 0
  },
  onShareAppMessage: function (res) {
    return {
      title: '健康甄选，更多关爱',
      path: '/pages/shopping/index'
    }
  },
  onLoad: function (option) {
    this.data.myHealthMoney = option.myHealthMoney
    let info = JSON.parse(option.item)
    let imgUrls = JSON.parse(info.imageUrl)
    let bannerList = []
    let detailList = []
    imgUrls.bannerName.forEach((item, index) => {
      bannerList.push(imgUrls.baseUrl + item)
    })
    imgUrls.detailName.forEach((item, index) => {
      detailList.push(imgUrls.baseUrl + item)
    })
    this.setData({
      goodInfo: info,
      imgUrls: bannerList,
      detailList: detailList
    })
  },
  onShow: function() {
  },
  handleExchange: function() {
    if (parseInt(this.data.myHealthMoney) < parseInt(this.data.goodInfo.healthCurrencyPrice)) {
      wx.showModal({
        title: '提示',
        content: '您的健康币不足',
        showCancel: false,
        confirmText: '知道了',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      let info = JSON.stringify([{
        "presentPrice": this.data.goodInfo[this.data.goodInfo.pricePattern],
        "goodsId": this.data.goodInfo.id,
        "goodsNumber": 1,
        "imgUrl": this.data.imgUrls[0]
      }])
      wx.navigateTo({
        url: `../fillOrder/index?info=${info}&totalPoint=0&totalNum=1&orderType=exchange`
      })
    }
  }
})
