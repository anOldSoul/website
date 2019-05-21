var app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    payPrise: '',
    seviceList: {},
    goodsIds: '',
    resultFail: false,
    resultSucess: false,
    ifShowBac: false,
    result: 0
  },
  onLoad: function (option) {
    console.log(option)
    this.data.goodsIds = option.goodsIds || ''
    if (option.result == 1) {
      this.setData({
        resultSucess: true,
        payPrise: option.price
      })
      wx.setNavigationBarTitle({
        title: '支付成功'
      })
      this.judgeIsInsurance()
    } else if (option.result == 3) {
      this.setData({
        resultSucess: true,
        result: 3
      })
      wx.setNavigationBarTitle({
        title: '收礼成功'
      })
    } else {
      this.setData({
        resultFail: true,
        payPrise: option.price
      })
      wx.setNavigationBarTitle({
        title: '支付失败'
      })
    }
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID'),
      userId: wx.getStorageSync('YJF_UERID')
    }
    this.getGoodsData(data)
  },
  goGifts() {
    wx.redirectTo({
      url: `../gifts/index`
    })
  },
  closeDialog: function() {
    this.setData({
      ifShowBac: false
    })
    wx.redirectTo({
      url: `../order/index`
    })
  },
  judgeIsInsurance: function() {
    let tempData = {
      goodsIds: this.data.goodsIds,
      storeId: wx.getStorageSync('YJF_STORE_ID')
    }
    app.post(app.Apis.GET_ORDER_JUMP, tempData, result => {
      if (result.data.needPopInsuranceWindow) {
        this.setData({
          ifShowBac: true
        })
      } else {
        // wx.redirectTo({
        //   url: `/pages/order/index`
        // })
      }
    })
  },
  handleViewOrder: function() {
    wx.navigateTo({
      url: '../order/index'
    })
  },
  goDetail: function (e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/goodDetail/index?goodsId=${item.id}`
    })
  }, 
  handleJoinIn: function(e) {
    let item = e.currentTarget.dataset.item
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID'),
      goodsId: item.id,
      userId: wx.getStorageSync('YJF_UERID'),
      goodsNumber: 1
    }
    app.post(app.Apis.POST_CART, data, result => {
      if (result.success) {
        wx.hideLoading()
        if (result.data.addSuccess) {
          this.data.currentNum += 1
          this.setData({
            cart_num: result.data.totalGoodsNumber
          })
          wx.showToast({
            title: '加入购物车成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showModal({
            title: '提示',
            content: result.data.addFailureReason,
            showCancel: false,
            confirmText: '知道了',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
  },
  getGoodsData: function(data) {
    app.post(app.Apis.GET_LIKE, data, result => {
      if (result.success) {
        wx.hideLoading()
        let tempGoodList = result.dataList
        if (tempGoodList.length == 0) {
          this.setData({
            tips: '很抱歉，暂无符合要求商品哦！'
          })
        } else {          
          tempGoodList.forEach((item, index) => {
            item.name = item.name.length > 18 ? item.name.substring(0, 18) + '...' : item.name
            item.imgUrl = JSON.parse(item.imageUrl).baseUrl + JSON.parse(item.imageUrl).bannerName[0]
          })
          this.setData({
            rangeGoodsList: tempGoodList
          })
        }
      }
    })
  }
})
