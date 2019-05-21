var app = getApp()

Page({
  data: {
    goodDetailTitle: ['商品详情', '购物须知'],
    detailList: [],
    imgUrls: [],
    imgUrls1: [],
    autoplay: false,
    interval: 5000,
    duration: 500,
    indicatorDots: true,
    goodInfo: {},
    goodInfo1: {},
    info: '',
    activeIndex: 0,
    cart_num: 0,
    currentNum: 0,
    eventType: '',
    ruleList: '',
    memberList: [],
    countDown: '',
    minutes: '',
    hours: '',
    resultData: ''
  },
  formSubmit: function (e) {
    app.functions.getFormId(e.detail.formId)
  },
  onShareAppMessage: function (res) {
    if (this.data.tuanType === 'gift') {
      return {
        title: `${wx.getStorageSync('nickName') || '我'}向您求了一份礼物，快帮TA完成心愿吧！`,
        path: `/pages/goodDetail/index?goodsId=${this.data.goodsId}&tuanType=${this.data.tuanType}`
      }
    } else {
      return {
        title: this.data.goodInfo.name,
        path: `/pages/goodDetail/index?goodsId=${this.data.goodsId}&eventType=${this.data.eventType}`
      }
    }
  },
  onLoad: function (option) {
    if (option.eventType) {
      this.setData({
        eventType: option.eventType
      })
    }
    if (option.tuanType) {
      this.setData({
        tuanType: option.tuanType
      })
    }
    this.data.goodsId = option.goodsId
    new app.ToastPannel()
    this.getGoodDetail(option.goodsId)
    this.getServiceRule()
    if (this.data.tuanType === 'cantuan' && option.groupPurchaseId) {
      this.data.groupPurchaseId = option.groupPurchaseId
      this.getGroupData(option.groupPurchaseId)
    }
  },
  onShow: function() {
    if (wx.getStorageSync('YJF_UERID')) {
      this.getData()
    }
  },
  getGroupData: function (groupPurchaseId) {
    let data = {
      userId: wx.getStorageSync('YJF_UERID'),
      groupPurchaseId: groupPurchaseId
    }
    app.post(app.Apis.GET_GROUP_DETAIL, data, result => {
      if (result.success) {
        let resultData = result.data
        let goodInfo = resultData.onlineMallGoodsInfo
        let bannerList = []
        let imgUrls = JSON.parse(goodInfo.imageUrl)
        let memberList = resultData.inviteeUsersInfoList
        let tempNum = goodInfo.groupPurchaseNumber - resultData.inviteeUsersInfoList.length
        for (let i = 0; i < tempNum; i++) {
          memberList.push(i)
        }
        this.setData({
          memberList: memberList,
          goodInfo1: goodInfo,
          resultData: resultData,
          imgUrls1: imgUrls.baseUrl + imgUrls.bannerName[0]
        })
        this.carculate(resultData.countDownSecond)
      }
    })
  },
  carculate: function (leftTime) {
    let tempInterval = setInterval(() => {
      if (leftTime === 0) {
        clearInterval(tempInterval)
        return
      }
      var hours = parseInt(leftTime / 60 / 60, 10); //计算剩余的小时
      var minutes = parseInt((leftTime - hours * 60 * 60) / 60);//计算剩余的分钟
      var seconds = leftTime - minutes * 60 - hours * 60 * 60;//计算剩余的秒数
      hours = this.checkTime(hours);
      minutes = this.checkTime(minutes);
      seconds = this.checkTime(seconds);
      this.data.countDown = seconds
      this.setData({
        countDown: seconds,
        minutes: minutes,
        hours: hours
      })
      leftTime--
    }, 1000)
  },
  checkTime: function (i) { //将0-9的数字前面加上0，例1变为01
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  },
  handleGroupBuy: function(e) {
    let userInfo = e.detail.userInfo
    let buyType = e.target.dataset.buytype
    if (userInfo) {
      if (!wx.getStorageSync('YJF_UERID')) {
        wx.navigateTo({
          url: `../index/index`
        })
        return
      }
      wx.setStorageSync('nickName', userInfo.nickName)
      wx.setStorageSync('avatarUrl', userInfo.avatarUrl)
      if (buyType === 'buyAlone') {
        this.handleBuyNow(this.data.goodInfo.presentPrice, buyType)
      } else {
        this.handleBuyNow(this.data.goodInfo.groupPurchasePrice, buyType)
      }
    }
  },
  getServiceRule: function() {
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID')
    }
    app.post(app.Apis.GET_SHOPPING_NOTES, data, result => {
      if (result.success) {
        this.setData({
          ruleList: result.data
        })
      }
    })
  },
  goShoppingCart: function() {
    wx.switchTab({
      url: '/pages/shoppingCart/index'
    })
  },
  handleTabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id
    })
  },
  handleService: function() {
    wx.showModal({
      title: '提示',
      content: '请拨打客服热线：400-619-0069',
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#FA4B9B',
      success: function(res) {
        if (res.confirm) {
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  previewImg: function (e) {
    let data = e.currentTarget.dataset
    wx.previewImage({
      current: data.item[data.index], // 当前显示图片的http链接
      urls: data.item // 需要预览的图片http链接列表
    })
  },
  getGoodDetail: function(id) {
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID') || app.globalData.storeId,
      goodsId: id
    }
    if (this.data.eventType) {
      data.eventType = this.data.eventType
    }
    app.post(app.Apis.GET_SINGLE_COMMODITY, data, result => {
      if (result.success) {
        let resultData = result.data
        let bannerList = []
        let detailList = []
        let imgUrls = JSON.parse(resultData.imageUrl)
        imgUrls.bannerName.forEach((item, index) => {
          bannerList.push(imgUrls.baseUrl + item)
        })
        imgUrls.detailName.forEach((item, index) => {
          detailList.push(imgUrls.baseUrl + item)
        })
        this.setData({
          goodInfo: result.data,
          imgUrls: bannerList,
          detailList: detailList
        })
        if ((!this.data.tuanType || this.data.tuanType === 'kaituan') && this.data.eventType === 'group_purchase') {
          this.setData({
            memberList: this.data.goodInfo.groupPurchaseNumber
          })
        }
      }
    })
  },
  getData: function() {
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID'),
      userId: wx.getStorageSync('YJF_UERID')
    }
    app.post(app.Apis.GET_CART, data, result => {
      if (result.success) {
        let tempTotalNum = 0
        result.dataList.forEach((item, index) => {
          tempTotalNum += parseInt(item.goodsNumber)
          if (item.goodsId == this.data.goodInfo.id) {
            this.data.currentNum = item.goodsNumber
          }
        })
        this.setData({
          cart_num: tempTotalNum
        })
      }
    })
  },
  goGift: function(e) {
    let userInfo = e.detail.userInfo
    let buyType = e.target.dataset.buytype
    if (userInfo) {
      if (!wx.getStorageSync('YJF_UERID')) {
        wx.navigateTo({
          url: `../index/index`
        })
        return
      }
      wx.setStorageSync('nickName', userInfo.nickName)
      wx.setStorageSync('avatarUrl', userInfo.avatarUrl)
      let data = {
        storeId: wx.getStorageSync('YJF_STORE_ID'),
        goodsId: this.data.goodInfo.id,
        userId: wx.getStorageSync('YJF_UERID'),
        goodsNumber: 1
      }
      app.post(app.Apis.POST_GIFT_CART, data, result => {
        if (result.success) {
          wx.navigateTo({
            url: `../giftsOrder/index`
          })
        }
      })
    }
  },
  handleBuy: function() {
    if (!wx.getStorageSync('YJF_UERID')) {
      wx.navigateTo({
        url: `../index/index`
      })
      return
    }
    this.handleBuyNow()
  },
  handleBuyNow: function(price, buyType='') {
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID'),
      goodsId: this.data.goodInfo.id,
      userId: wx.getStorageSync('YJF_UERID'),
      eventType: this.data.eventType
    }
    app.post(app.Apis.POST_PURCHASE_CONDITION, data, result => {
      if (result.data.canPurchase) {
        let orderItemList = []
        orderItemList.push({
          presentPrice: price || this.data.goodInfo.presentPrice,
          goodsId: this.data.goodInfo.id,
          goodsNumber: 1,
          imgUrl: this.data.imgUrls[0],
          eventType: this.data.eventType
        })
        wx.navigateTo({
          url: `/pages/fillOrder/index?buyType=${buyType}&orderType=immediatePurchase&eventType=${this.data.eventType}&totalNum=1&totalPoint=${price || this.data.goodInfo.presentPrice}&info=${JSON.stringify(orderItemList)}&groupPurchaseId=${this.data.groupPurchaseId}`
        })
      } else {
        wx.showModal({
          title: '提示',
          content: result.data.canNotPurchaseReason,
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
    })
  },
  goShopping: function() {
    wx.switchTab({
      url: `../shopping/index`
    })
  },
  handleJoinIn: function() {
    if (!wx.getStorageSync('YJF_UERID')) {
      wx.navigateTo({
        url: `../index/index`
      })
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID'),
      goodsId: this.data.goodInfo.id,
      userId: wx.getStorageSync('YJF_UERID'),
      goodsNumber: this.data.currentNum + 1
    }
    if (this.data.eventType) {
      data.eventType = this.data.eventType
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
            success: function(res) {
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
  }
})
