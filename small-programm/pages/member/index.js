var app = getApp()

Page({
  data: {
    addressListDeliveryMode: '',
    profit: '',
    healthMoney: '',
    couponNum: '',
    step: '',
    ifNavigateTo: false
  },
  onLoad: function () {
  },
  onPullDownRefresh() {
    this.init()
  },
  onShow: function() {
    this.init()
  },
  init() {
    let userId = wx.getStorageSync('YJF_UERID')
    if (this.data.ifNavigateTo) {
      wx.switchTab({
        url: '../shopping/index'
      })
      this.data.ifNavigateTo = false
      return
    }
    if (!userId) {
      this.data.ifNavigateTo = true
      wx.navigateTo({
        url: `../index/index`
      })
      return
    }
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
                  this.setData({
                    step1: result.data.toLocaleString(),
                    step: result.data
                  })
                }
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
    wx.showLoading({
      title: '加载中',
    })
    let p1 = new Promise((resolve, reject) => {
      this.getAddress(resolve, reject)
    })
    let p2 = new Promise((resolve, reject) => {
      this.getMyInfo(resolve, reject)
    })
    Promise.all([p1, p2]).then((result) => {
      wx.stopPullDownRefresh()
      wx.hideLoading()
    }).catch((error) => {
      console.log(error)
    })
  },
  getMyInfo: function (resolve) {
    let data = {
      userId: wx.getStorageSync('YJF_UERID'),
      mainStoreId: wx.getStorageSync('YJF_STORE_ID')
    }
    app.post(app.Apis.GET_MY_INFO, data, result => {
      this.setData({
        profit: result.data.healthCurrencyValue,
        healthMoney: result.data.moneyValue,
        couponNum: result.data.couponNumber
      })
      if (resolve) {
        resolve()
      }
    })
  },
  getAddress: function (resolve) {
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID')
    }
    app.post(app.Apis.GET_DELIVERY, data, result => {
      this.setData({
        addressListDeliveryMode: result.dataList[0]
      })
      if (resolve) {
        resolve()
      }
    })
  },
  chooseAddress() {
    let _this = this
    wx.chooseAddress({
      success(res) {
        let data = {
          storeId: wx.getStorageSync('YJF_STORE_ID'),
          userId: wx.getStorageSync('YJF_UERID'),
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
        })
      }
    })
  },
  goBuBu: function () {
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
  handleAddressManage: function() {
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
                title: '提示',
                content: '用户拒绝授权，请删除小程序后重新进入获取授权以便更改收货地址。',
                showCancel: false
              })
            }
          } else {
            _this.chooseAddress()
          }
        }
      })
    }
  },
  makeSure: function() {
    wx.showModal({
      title: '提示',
      content: '确定退出登录?',
      success: function(res) {
        if (res.confirm) {
          wx.setStorageSync('YJF_LOGIN_STATUS', 0)
          wx.setStorageSync('YJF_UERID', '')
          wx.switchTab({
            url: '../shopping/index'
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 问题反馈
   */
  clickIssueFeedbackAction(){
    wx.navigateTo({
      url: '../issueFeedback/index',
    })
  }

})
