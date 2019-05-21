var app = getApp()

Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    duration: 500,
    bannerImg: '',
    interval: 3500, // 时间间隔
    goodsList: [],
    storeId: '',
    showCoupon: false,
    couponList: [],
    step: '',       
    totalValue: ''
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e)
    console.log(app.globalData.openid)
    let data = {
      wechatId: app.globalData.wechatId,
      openId: wx.getStorageSync('TMM_OPENID'),
      formId: e.detail.formId,
      count: 1
    }
    app.post(app.Apis.POST_USER_FORMID, data, result => {
      if (result.success) {
      }
    })
  },
  goGifts: function() {
    wx.navigateTo({
      url: `/pages/gifts/index`
    })
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },
  onShareAppMessage: function (res) {
    return {
      title: '健康甄选，更多关爱',
      path: '/pages/shopping/index'
    }
  },
  onLoad: function (options) {
    // wx.getLocation({
    //   type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
    //   success(res) {
    //     console.log(res)
    //     const latitude = res.latitude
    //     const longitude = res.longitude
    //     wx.openLocation({
    //       latitude,
    //       longitude,
    //       scale: 18
    //     })
    //   }
    // })
    wx.setStorageSync('YJF_STORE_ID', options.mainStoreId || app.globalData.storeId)
    this.getBanner()
    this.getHotGoods()
  },
  onShow: function() {
    if (wx.getStorageSync('PHONENUMBER')) {
      this.getCoupon()
    }
    wx.getSetting({
      success: (res) => {
          wx.login({
            success: (res) => {
              if (res.code) {
                let code = res.code
                wx.getWeRunData({
                  success: (res) => {
                    const encryptedData = res.encryptedData
                    let data = {
                      code: code,
                      encryptedData: res.encryptedData,
                      iv: res.iv,
                      wechatId: app.globalData.wechatId
                    }
                    app.post(app.Apis.POST_WECHAT_RUN, data, result => {
                      if (result.success) {
                        if (wx.getStorageSync('YJF_UERID')) {
                          this.getMyData(result.data)
                        } else {
                          this.setData({
                            step1: result.data.toLocaleString(),
                            step: result.data
                          })
                        }
                      }
                    })
                  },
                  fail: (res) => {
                  }
                })
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          })
      }
    })
  },
  handleOpenMsg: function () {
    let data = {
      openId: wx.getStorageSync('TMM_OPENID'),
      storeId: wx.getStorageSync('YJF_STORE_ID'),
      wechatId: app.globalData.wechatId
    }
    app.post(app.Apis.PUT_BOOKING_SUCCESS, data, result => {
      if (result.success) {
        this.setData({
          showCoupon: false
        })
      }
    })
  },
  getMyData: function (stepNumber) {
    let data = {
      userId: wx.getStorageSync('YJF_UERID'),
      mainStoreId: wx.getStorageSync('YJF_STORE_ID'),
      stepNumber: stepNumber
    }
    app.post(app.Apis.GET_USER_INFO, data, result => {
      if (result.success) {
        this.setData({
          step1: result.data.totalStepValue.toLocaleString(),
          step: result.data.totalStepValue
        })
      }
    })
  },
  goGroup: function() {
    let userId = wx.getStorageSync('YJF_UERID')
    if (!userId) {
      wx.navigateTo({
        url: `../index/index`
      })
      return
    } else {
      wx.navigateTo({
        url: `/pages/groupGoods/index`
      })
    }
  },
  goBuBu: function() {
    wx.getSetting({
      success: (res) => {
        let authRun = res.authSetting['scope.werun']
        if (!authRun) {
          wx.openSetting()
        } else {
          let userId = wx.getStorageSync('YJF_UERID')
          if (!userId) {
            wx.redirectTo({
              url: `../index/index`
            })
            return
          } else {
            wx.navigateTo({
              url: `/pages/bubu/index?stepNumber=${this.data.step}`
            })
          }
        }
      }
    })
  },
  goTixian: function() {
    let userId = wx.getStorageSync('YJF_UERID')
    if (!userId) {
      // wx.redirectTo({
      //   url: `../index/index`
      // })
      return
    } else {
      wx.navigateTo({
        url: `/pages/invite/index`
      })
    }
  },
  goEventGood: function(e) {
    let tempUrl = e.currentTarget.dataset.item
    let eventType = app.util.getQueryString(tempUrl.split('?')[1], 'event_type')
    let goods_id = app.util.getQueryString(tempUrl.split('?')[1], 'goods_id')
    if (eventType === 'group_purchase') {
      wx.navigateTo({
        url: `/pages/goodDetail/index?goodsId=${goods_id}&eventType=${eventType}`
      })
    } else {
      let data = {
        storeId: wx.getStorageSync('YJF_STORE_ID'),
        eventType: eventType
      }
      app.post(app.Apis.GET_EVENT_GOODS, data, result => {
        if (result.success) {
          let item = result.dataList[0]
          wx.navigateTo({
            url: `/pages/goodDetail/index?goodsId=${item.id}&eventType=${eventType}`
          })
        }
      })
    }
  },
  handleGoUse: function() {
    this.setData({
      showCoupon: false
    })
  },
  goCoupon: function() {
    if (!wx.getStorageSync('YJF_UERID')) {
      wx.redirectTo({
        url: `../index/index`
      })
      return
    } else {
      wx.navigateTo({
        url: `/pages/coupon/list/index?from=shopping`
      })
    }
  },
  getCoupon: function() {
    if (wx.getStorageSync('isNewUser')) {
      let data = {
        storeId: wx.getStorageSync('YJF_STORE_ID'),
        couponClassTypeEnum: 'NEW_MEMBER',
        userId: wx.getStorageSync('YJF_UERID')
      }
      app.post(app.Apis.GET_COUPONS, data, result => {
        wx.removeStorageSync('isNewUser')
        let totalValue = 0
        let couponList = result.dataList.map((item) => {
          totalValue += item.faceValue
          return item
        })
        this.setData({
          showCoupon: true,
          totalValue: totalValue,
          couponList: couponList
        })
      })
    }
  },
  handleGoBuBu: function() {
    wx.navigateTo({
      url: `/pages/bubu/index`
    })
    this.handleClose()
  },
  handleClose() {
    this.setData({
      showCoupon: false
    })
  },
  getBanner: function() {
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID')
    }
    app.post(app.Apis.GET_BANNER, data, result => {
      if (result.success) {       
        this.setData({
          bannerImg: result.data
        })
      }
    })
  },
  getHotGoods: function() {
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID'),
      eventType: 'selected_hot',
      orderBy: 'goodsRemarks'
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
  goDetail: function(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/goodDetail/index?goodsId=${item.id}&eventType=selected_hot`
    })
  }
})
