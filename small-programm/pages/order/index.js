var app = getApp()

Page({
  data: {
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    itemsNum: 0,
    list: [],
    status: '',
    cPage: 1
  },
  onShareAppMessage: function (res) {
    let item = res.target.dataset.item
    return {
      title: '送你一份甄选健康好礼，填写地址就送货到家哦！',
      imageUrl: item.onlineMallUserOrderItemList[0].bannerUrl,
      path: `/pages/givingGifts/index?giftId=${item.giftId}&giverUserId=${wx.getStorageSync('YJF_UERID')}`
    }
  },
  onPullDownRefresh() {
    this.getData(this.data.status || '')
  },
  onReachBottom() {
    this.data.cPage = this.data.cPage + 1
    this.getData(this.data.status || '')
  },
  onShow: function() {
    this.getData(this.data.status || '')
  },
  onLoad: function (option) {
    let title
    if (option.status == 'PENDING_PAY') {
      title = '待付款'
    } else if (option.status == 'IN_PROGRESS') {
      title = '进行中'
    } else if (option.status == 'COMPLETED') {
      title = '已完成'
    } else {
      title = '全部订单'
    }
    wx.setNavigationBarTitle({
      title: title
    })
    this.data.status = option.status || ''
  },
  handlePay: function (e) {
    let item = e.currentTarget.dataset.item
    let data = {
      orderId: item.orderId
    }
    app.post(app.Apis.GET_IMMEDIATE_CONDITION, data, result => {
      if (result.success) {
        if (result.data.validTypeEnum === 'CAN_PURCHASE') {
          this.wechatPay(item.orderId, item.totalPrise)
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
      }
    })   
  },
  wechatPay: function(id ,price) {
    let data = {
      orderId: id
    }
    app.post(app.Apis.GET_PAY_CONDITION, data, result => {
      if (result.data.validTypeEnum === 'CAN_PURCHASE') {
        let data = {
          wechatId: app.globalData.wechatId,
          openId: wx.getStorageSync('TMM_OPENID'),
          totalFee: parseInt(price * 100),
          outTradeNo: id,
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
              'success': function (res) {
              },
              'fail': function (res) {
              }
            })
          }
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
  getData: function(status) {
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID'),
      userId: wx.getStorageSync('YJF_UERID'),
      MallStatusEnum: status,
      cPage: this.data.cPage,
      size: 10
    }
    app.post(app.Apis.GET_USER_ORDERS, data, result => {
      if (result.dataList) {
        let list = result.dataList
        if (this.data.cPage === 1) {
          this.setData({
            list: list
          })
        } else {
          if (list.length) {
            this.setData({
              list: this.data.list.concat(list)
            })
          } else {
            this.data.cPage = this.data.cPage - 1
          }
        }
        wx.stopPullDownRefresh()
      } else {
        this.data.cPage = this.data.cPage - 1
      }
    })
  },
  handleShare: function(e) {
    let groupPurchaseId = e.currentTarget.dataset.item.groupPurchaseId
    wx.navigateTo({
      url: `/pages/groupBuy/index?groupPurchaseId=${groupPurchaseId}`
    })
  },
  handleCancel: function(e) {
    let item = e.currentTarget.dataset.item
    wx.showModal({
      title: '提示',
      content: '订单取消后将不可恢复，请确认!',
      success: (res) => {
        if (res.confirm) {
          let data = {
            mallStatusEnum: 'TRANSACTION_CLOSE',
            orderId: item.orderId,
            operatorUserId: wx.getStorageSync('YJF_UERID')
          }
          app.post(app.Apis.PUT_ORDER_STATUS, data, result => {
            if (result.success) {
              this.getData(this.data.status)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  handleReceive: function(e) {
    let item = e.currentTarget.dataset.item
    wx.showModal({
      title: '提示',
      content: '点击确定后订单将完结，请确认您已准确无误收到商品。如有疑问，可咨询就近门店或致电400-619-0069。',
      success: (res) => {
        if (res.confirm) {
          let data = {
            mallStatusEnum: 'RECEIVED_ORDER_COMPLETED',
            orderId: item.orderId,
            operatorUserId: wx.getStorageSync('YJF_UERID')
          }
          app.post(app.Apis.PUT_ORDER_STATUS, data, result => {
            if (result.success) {
              this.getData(this.data.status)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  handleDetail: function(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/totalGoods/index?orderId=${item.orderId}&showAfterSaleApplyButton=${item.showAfterSaleApplyButton}`
    })
  },
  handleChase: function(e) {
    let item = e.currentTarget.dataset.item
    let statustype = e.currentTarget.dataset.statustype
    wx.navigateTo({
      url: `/pages/status/index?orderId=${item.orderId}&statustype=${statustype}`
    })
  }
})
