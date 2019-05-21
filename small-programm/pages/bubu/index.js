var app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    hasReceived: false,
    selectId: '',
    resultData: {},
    ifHint: false,
    healthData: {},
    step: '',
    step1: '',
    ifBox: false,
    ifBox1: false,
    exchangeList: []
  },
  onShow: function() {
  },
  onPullDownRefresh() {
    let p1 = new Promise((resolve, reject) => {
      this.getExchangeList(resolve, reject)
    })
    let p2 = new Promise((resolve, reject) => {
      this.getStepNumber(resolve, reject)
    })
    Promise.all([p1, p2]).then((result) => {
      wx.stopPullDownRefresh()
    }).catch((error) => {
      console.log(error)
    })
  },
  onLoad: function () {
    this.getExchangeList()
    this.getStepNumber()
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
  getStepNumber: function (resolve, reject) {
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
                  if (resolve) {
                    resolve()
                  }
                  this.setData({
                    step1: result.data.toLocaleString(),
                    step: result.data
                  })
                  this.getMyData(result.data)
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
  },
  getMyData: function (stepNumber) {
    let data = {
      userId: wx.getStorageSync('YJF_UERID'),
      mainStoreId: wx.getStorageSync('YJF_STORE_ID'),
      stepNumber: stepNumber
    }
    app.post(app.Apis.GET_CURRENCY_INFO, data, result => {
      if (result.success) {
        this.setData({
          healthData: result.data
        })
      }
    })
  },
  handleReturn: function() {
    this.setData({
      ifBox: false,
      ifBox1: false,
      ifHint: false,
      hasReceived: false
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: '我送你200健康币，可以当钱花！',
      imageUrl: '../../images/share_step.png',
      path: `/pages/index/index?inviteType=step&inviterUserId=${wx.getStorageSync('YJF_UERID')}`
    }
  },
  goDetail: function (e) {
    let item = e.currentTarget.dataset.item
    this.data.selectId = item.id
    if (this.data.healthData.totalHealthCurrencyValue >= item.healthCurrencyPrice) {
      this.handleBuyNow()
    } else {
      let data = {
        userId: wx.getStorageSync('YJF_UERID'),
        mainStoreId: wx.getStorageSync('YJF_STORE_ID'),
        goodsId: item.id
      }
      app.post(app.Apis.GET_GOODS_HINT, data, result => {
        if (result.success) {
          this.setData({
            resultData: result.data,
            ifHint: true,
            selectId: item.id
          })
        }
      })
    }
  },
  handleBuyNow: function() {
    wx.navigateTo({
      url: `/pages/goodDetail/index?goodsId=${this.data.selectId}&eventType=health_currency_commodity`
    })
  },
  handleReceive: function() {
    if (this.data.healthData.canReceive) {
      if (this.data.healthData.currentHealthCurrencyValue == 0) {
        this.setData({
          ifBox1: true
        })
      } else {
        this.setData({
          ifBox: true
        })
      }
    } else {
      this.setData({
        hasReceived: true
      })
    }
  },
  handleMakeSure: function() {
    let data = {
      userId: wx.getStorageSync('YJF_UERID'),
      mainStoreId: wx.getStorageSync('YJF_STORE_ID'),
      stepNumber: this.data.step,
      healthCurrencyValue: this.data.healthData.currentHealthCurrencyValue
    }
    app.post(app.Apis.POST_RECEIVE, data, result => {
      if (result.success) {
        wx.showToast({
          title: '领取成功',
          duration: 2000
        })
        this.getStepNumber()
        this.setData({
          ifBox: false
        })
      }
    })
  },
  getExchangeList: function (resolve, reject) {
    let data = {
      userId: wx.getStorageSync('YJF_UERID'),
      storeId: wx.getStorageSync('YJF_STORE_ID'),
      orderBy: 'healthCurrencyPrice',
      eventType: 'health_currency_commodity'
    }
    app.post(app.Apis.GET_EVENT_GOODS, data, result => {
      if (result.success) {
        if (resolve) {
          resolve()
        }
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
