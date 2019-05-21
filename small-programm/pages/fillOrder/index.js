var app = getApp()

Page({
  data: {
    orderType: '',
    activeIndex: 0,
    eventType: '',
    defaultAddress: '',
    orderList: [],
    orderList1: '',
    totalPoint: 0,
    totalNum: 0,
    storeId: '',
    userId: '',
    coupon: '',
    originPrice: '',
    addressListDeliveryMode: '',
    defaultAddressRemark: '',
    remarks: '',
    privilage: '',
    isDiscount: false,
    giftData: {},
    longitude: '',
    latitude: ''
  },
  formSubmit: function (e) {
    app.functions.getFormId(e.detail.formId)
  },
  computePrice: function() {
    let totalPoint = this.data.originPrice    
    if (this.data.originPrice >= this.data.coupon.minConsumption) {
      totalPoint = (totalPoint - this.data.coupon.faceValue).toFixed(2)
    }
    if (this.data.isDiscount) {
      totalPoint = totalPoint - this.data.privilage.exchangeableMoneyValue
    }
    if (totalPoint < 0) {
      totalPoint = 0
    }
    if (this.data.activeIndex >= 0 && this.data.privilage.deliveryModeList) {
      totalPoint = Number(totalPoint) + Number(this.data.privilage.deliveryModeList[this.data.activeIndex].carriage)
    }
    this.setData({
      totalPoint: parseFloat(totalPoint).toFixed(2)
    })
  },
  onShow: function () {
    this.data.coupon = wx.getStorageSync('SELECT_COUPON')
    this.setData({
      coupon: this.data.coupon
    })    
    if (this.data.orderType === 'gift') {
      this.getAddress()
      this.computePrice()
    } else {
      this.getDiscount()
    }  
  },
  onLoad: function (option) {
    wx.setStorageSync('SELECT_COUPON', '')
    this.setData({
      eventType: option.eventType || '',
      orderType: option.orderType || '',
      giftId: option.giftId || ''
    })
    new app.ToastPannel()
    if (this.data.orderType === 'gift') {
      this.getGift()
    } else {
      let orderList = JSON.parse(option.info)
      let orderList1 = []
      orderList.forEach((item, index) => {
        orderList1.push({
          "unitPrise": item.presentPrice,
          "goodsId": item.goodsId,
          "goodsNumber": item.goodsNumber,
          "eventType": item.eventType || ''
        })
      })
      this.data.totalPoint = option.totalPoint
      if (option.groupPurchaseId && option.groupPurchaseId != 'undefined') {
        this.data.groupPurchaseId = option.groupPurchaseId
      }
      this.setData({
        buyType: option.buyType || '',
        orderList: orderList,
        orderList1: JSON.stringify(orderList1),
        totalNum: option.totalNum,
        originPrice: option.totalPoint,
        storeId: wx.getStorageSync('YJF_STORE_ID'),
        userId: wx.getStorageSync('YJF_UERID')
      })
    }
  },
  clickTap(e) {
    this.setData({
      activeIndex: e.currentTarget.dataset.index
    })
    this.getAddress3()
    this.computePrice()
  },
  getGift: function () {
    let data = {
      giftId: this.data.giftId,
      userId: wx.getStorageSync('YJF_UERID')
    }
    app.post(app.Apis.GET_GIFT_DETAIL, data, result => {
      if (result.success) {
        console.log(result)
        let totalNum = 0
        let orderList = result.data.onlineMallGiftCartAndGoodsList.map((item, index) => {
          totalNum += item.goodsNumber
          item.imgUrl = item.bannerUrl
          return item
        })
        this.setData({          
          orderList: orderList,
          totalNum: totalNum,
          giftData: result.data
        })
      }
    })
  },
  switchChange: function(e) {
    this.setData({
      isDiscount: !this.data.isDiscount
    })
    this.computePrice()
  },
  getDiscount: function() {
    let data = {
      storeId: this.data.storeId,
      userId: this.data.userId,
      orderItemList: this.data.orderList1
    }
    app.post(app.Apis.POST_ORDER_PRIVILEDGES, data, result => {
      if (result.success) {
        this.setData({
          privilage: result.data
        })
        if (result.data.hintDescr) {
          wx.showModal({
            title: '提示',
            content: result.data.hintDescr,
            showCancel: false,
            confirmText: '知道了'
          })
        }
        this.computePrice()
        this.getAddress3()
      }
    })
  },
  bindRemarkInput: function(e) {
    this.data.remarks = e.detail.value
  },
  handleBalance: function () {
    if (this.data.activeIndex < 0) {
      this.show('请选择配送方式')
      return
    }
    if (!this.data.defaultAddress || !this.data.defaultAddress.receiverName) {
      this.show('请填写收货地址')
      return
    }
    let data = {
      storeId: this.data.storeId,
      userId: this.data.userId,
      receiverName: this.data.defaultAddress.receiverName,
      receiverPhone: this.data.defaultAddress.receiverPhone,
      orderItemList: this.data.orderList1,
      couponId: this.data.coupon.id,
      remarks: this.data.remarks,
      isGroupPurchase: false,
      immediatePurchase: false,
      healthCurrencyMoneyPrice: this.data.isDiscount ? this.data.privilage.exchangeableMoneyValue : 0
    } 
    if (this.data.orderType !== 'gift') {
      data.deliveryMode = this.data.privilage.deliveryModeList[this.data.activeIndex].ruleCode
      data.carriagePrise = Number(this.data.privilage.deliveryModeList[this.data.activeIndex].carriage)
      data.longitude = this.data.longitude
      data.latitude = this.data.latitude
    }
    if (this.data.defaultAddress.receiveStoreId) {
      data.receiveStoreId = this.data.defaultAddress.receiveStoreId
      data.receiveStoreName = this.data.defaultAddress.receiveStoreName
      data.address = this.data.defaultAddress.receiveStoreAddress
    } else {
      data.address = (this.data.defaultAddress.province || '') + (this.data.defaultAddress.city || '') + (this.data.defaultAddress.district || '') + (this.data.defaultAddress.placeLocation || '') + this.data.defaultAddress.detailAddress
    }
    if (this.data.eventType === 'group_purchase' && this.data.buyType === 'pintuan') {
      data.isGroupPurchase = true
      if (this.data.groupPurchaseId) {
        data.groupPurchaseId = this.data.groupPurchaseId
      }
    }
    if (this.data.orderType === 'immediatePurchase') {
      data.immediatePurchase = true
    }
    data.headImageUrl = wx.getStorageSync('avatarUrl')
    data.nickName = wx.getStorageSync('nickName')
    app.post(app.Apis.POST_ORDER, data, result => {
      if (result.success) {
        wx.setStorageSync('SELECT_COUPON', '')
        if (this.data.totalPoint > 0) {
          this.getPayParams(result.id)
        } else {
          wx.hideLoading()
          wx.redirectTo({
            url: `../payResult/index?result=1&price=${this.data.totalPoint}`
          })
        }
      }
    })
  },
  sendGift() {
    if (!this.data.defaultAddress || !this.data.defaultAddress.receiverName) {
      this.show('请填写收货地址')
      return
    }
    let data = {
      giftId: this.data.giftId,
      receiverUserId: wx.getStorageSync('YJF_UERID'),
      receiverName: this.data.defaultAddress.receiverName,
      receiverPhone: this.data.defaultAddress.receiverPhone,
    }                                                                                                                                                                          
    if (this.data.defaultAddress.receiveStoreId) {
      data.receiveStoreId = this.data.defaultAddress.receiveStoreId
      data.receiveStoreName = this.data.defaultAddress.receiveStoreName
      data.address = this.data.defaultAddress.receiveStoreAddress
    } else {
      data.address = (this.data.defaultAddress.province || '') + (this.data.defaultAddress.city || '') + (this.data.defaultAddress.district || '') + (this.data.defaultAddress.placeLocation || '') + this.data.defaultAddress.detailAddress
    }
    app.post(app.Apis.PUT_GIFT_ORDER, data, result => {
      if (result.success) {
        if (result.id) {
          wx.reLaunch({
            url: `../payResult/index?result=3`
          })
        } else {         
          wx.reLaunch({
            url: `/pages/givingGifts/index?giftId=${this.data.giftId}&giverUserId=${wx.getStorageSync('YJF_UERID')}`
          })
        }
      }
    })
  },
  getPayParams: function (outTradeNo) {
    let data = {
      orderId: outTradeNo
    }
    app.post(app.Apis.GET_PAY_CONDITION, data, result => {
      if (result.data.validTypeEnum === 'CAN_PURCHASE') {
        let groupPurchaseId = result.data.groupPurchaseId
        let data = {
          wechatId: app.globalData.wechatId,
          openId: wx.getStorageSync('TMM_OPENID'),
          totalFee: this.data.totalPoint * 100,
          outTradeNo: outTradeNo,
          body: '见订单详情'
        }
        app.post(app.Apis.POST_PREPAYID, data, result => {
          if (result.success) {
            wx.requestPayment({
              'timeStamp': result.data.timeStamp,
              'nonceStr': result.data.nonceStr,
              'package': 'prepay_id=' + result.data.prepareId,
              'signType': result.data.signType,
              'paySign': result.data.paySign,
              'success': (res) => {
                if (this.data.eventType === 'group_purchase') {
                  wx.redirectTo({
                    url: `../groupBuy/index?groupPurchaseId=${groupPurchaseId}`
                  })
                } else {
                  let goodsIds = this.data.orderList.map((item, index) => {
                    return item.goodsId
                  }).toString()
                  wx.redirectTo({
                    url: `../payResult/index?result=1&price=${this.data.totalPoint}&goodsIds=${goodsIds}`
                  })
                }
              },
              'fail': (res) => {
                app.post(app.Apis.PUT_ORDER_FAIL, {
                  orderId: outTradeNo
                }, result => {
                  if (result.success) {
                    wx.redirectTo({
                      url: '../payResult/index?result=0&price=' + this.data.totalPoint
                    })
                  }
                })
              }
            })
          }
        })
      } else {
        wx.redirectTo({
          url: `../groupBuy/index?groupPurchaseId=${this.data.groupPurchaseId}`
        })
      }
    })
  },
  getAddress3() {
    let ruleCode = this.data.privilage.deliveryModeList[this.data.activeIndex].ruleCode
    wx.showLoading({
      title: '加载中',
    })
    let data = {
      storeId: this.data.storeId,
      userId: this.data.userId,
      deliveryMode: ruleCode
    }
    app.post(app.Apis.GET_DEFAULT3, data, result => {
      wx.hideLoading()
      let defaultAddress = result.data !== null ? result.data.pointMallUserAndStoreAddress : {}
      if (defaultAddress) {
        let receiverPhone = defaultAddress && defaultAddress.receiverPhone || ''
        defaultAddress.phone = receiverPhone.substring(0, 3) + '****' + receiverPhone.substring(7, 11)
      }
      this.setData({
        defaultAddress: defaultAddress,
        addressListDeliveryMode: result.data.addressListDeliveryMode || '',
        defaultAddressRemark: result.data.defaultAddressRemark || ''
      })
      if (ruleCode === 'RAPID_ARRIVAL') {
        this.getNearStore()
      }
    })
  },
  getNearStore() {
    let data = {
      mainStoreId: this.data.storeId,
      address: (this.data.defaultAddress.province || '') + (this.data.defaultAddress.city || '') + (this.data.defaultAddress.district || '') + (this.data.defaultAddress.placeLocation || '') + this.data.defaultAddress.detailAddress
    }    
    app.post(app.Apis.GET_NEAR_BRANCH, data, result => {
      if (!result.data) {
        this.show('您的地址超出2小时达配送范围，请选择次日达或门店自提！')
        this.setData({
          activeIndex: -1
        })
      } else {
        this.data.longitude = result.data.longitude
        this.data.latitude = result.data.latitude
      }
    })
  },
  getAddress: function () {
    wx.showLoading({
      title: '加载中',
    })
    let goodsIds = this.data.orderList.map(item => {
      return item.goodsId
    }).join(',')
    let data = {
      storeId: this.data.storeId,
      userId: this.data.userId,
      goodsIds,
      xcxTypeEnum: 'TAO_MAMA'
    }
    app.post(app.Apis.GET_DEFAULT, data, result => {
      wx.hideLoading()
      console.log(typeof result.data)
      let defaultAddress = result.data !== null ? result.data.pointMallUserAndStoreAddress : ''
      if (defaultAddress) {
        let receiverPhone = defaultAddress.receiverPhone
        defaultAddress.phone = receiverPhone.substring(0, 3) + '****' + receiverPhone.substring(7, 11)
        this.setData({
          defaultAddress: defaultAddress,
          addressListDeliveryMode: result.data.addressListDeliveryMode || '',
          defaultAddressRemark: result.data.defaultAddressRemark || ''
        })
      }
    })
  },
  chooseAddress() {
    let _this = this
    wx.chooseAddress({
      success(res) {
        let data = {
          storeId: _this.data.storeId,
          userId: _this.data.userId,
          receiverName: res.userName,
          receiverPhone: res.telNumber,
          isDefaultAddress: 1,
          province: res.provinceName,
          city: res.cityName,
          district: res.countyName,
          detailAddress: res.detailInfo,
          deliveryModeEnum: 'DELIVER_TO_HOME'
        }
        app.post(app.Apis.POST_ADDRESS, data, result => {
          if (result.success && result.id) {
            _this.getAddress()
          }
        })
      },
      fail(res) {
        let data = {
          storeId: wx.getStorageSync('YJF_STORE_ID'),
          userId: wx.getStorageSync('YJF_UERID'),
          receiverName: '',
          receiverPhone: '',
          isDefaultAddress: 1,
          province: '',
          city: '',
          district: '',
          detailAddress: '',
          deliveryModeEnum: 'DELIVER_TO_HOME'
        }
        app.post(app.Apis.POST_ADDRESS, data, result => {
          if (result.success && result.id) {
            _this.getAddress()
          }
        })
      }
    })
  },
  handleChangeAddress() {
    let deliveryMode = this.data.addressListDeliveryMode
    if (deliveryMode === 'PICKUP_STORE') {
      wx.navigateTo({
        url: '/pages/addresses/index',
      })
    } else {
      let _this = this
      wx.getSetting({
        success(res) {
          let scopeAddress = res.authSetting['scope.address']
          if (!scopeAddress) {
            if (scopeAddress === undefined) {
              wx.authorize({
                scope: 'scope.address',
                success: () => {
                  _this.chooseAddress()
                }
              })
            } else {
              wx.showModal({
                title: '信息授权提示',
                content: '需要访问您的通讯地址，请到小程序的设置中打开通讯地址授权',
                confirmText: '去设置',
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting()
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          } else {
            _this.chooseAddress()
          }
        }
      })
    }
  }
})
