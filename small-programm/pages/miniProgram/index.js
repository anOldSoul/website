//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    chooseIndex: 0,
    cardList: [],
    phoneNumber: '',
    userId: '',
    mainStoreId: ''
  },
  onLoad: function () {
    wx.showLoading({
      title: '登录中...',
    })
    if (app.globalData.extraData) {
      let phoneNumber = app.globalData.extraData.userName
      this.setData({
        mainStoreId: app.globalData.extraData.mainStoreId,
        phoneNumber,
        userId: app.globalData.extraData.userId
      })
      wx.setStorageSync('PHONENUMBER', phoneNumber)
      this.checkStoreIsOpen()
    } else {
      console.log('缺少参数')
    }
  },
  checkStoreIsOpen() {
    let data = {
      groupId: 'WECHAT',
      belongToId: this.data.mainStoreId
    }
    app.post(app.Apis.GET_CONFIGS, data, result => {
      if (result.success) {
        let item = result.dataList.filter(item => item.key === 'OPEN_TP_MEMBER_POINT_MALL')
        if (item[0].value === 'true') {
          this.getUserAccount()
        } else {
          wx.showModal({
            title: '提示',
            content: '商城升级中，给您带来的不便敬请谅解，如需帮助您可联系药房工作人员。',
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
                // 关闭小程序
                wx.navigateBack({
                  delta: 0
                })
              }
            }
          })
        }
      }
    })
  },
  getUserAccount: function () {
    let data = {
      userName: this.data.phoneNumber
    }
    app.post(app.Apis.POST_WECHAT_USER_ACCOUNT, data, result => {
      if (result.success && result.error === 200) {
        wx.setStorageSync('YJF_UERID', result.data.userId)
        wx.setStorageSync('YJF_HEADIMG', result.data.headImgUrl)
        this.getInfo()
      }
    })
  },
  getInfo: function() {
    let data = {
      userId: wx.getStorageSync('YJF_UERID')
    }
    app.post(app.Apis.GET_CARD, data, result => {
      if (result.success && result.dataList.length > 0) {
        let mainStoreId = this.data.mainStoreId
        let cardList = result.dataList
        let chooseIndex = -1
        let card = {}
        cardList.forEach((item, index) => {
          if (item.storeId === mainStoreId) {
            chooseIndex = index
            card = item
          }
        })
        if (chooseIndex >= 0) {
          wx.setStorageSync('YJF_LOGIN_STATUS', 1)
          wx.setStorageSync('YJF_STORE_ID', mainStoreId)
          wx.setStorageSync('cardInfo', card)
          wx.switchTab({
            url: '/pages/shopping/index'
          })
        } else {
          this.getAuditingStatus()
        }
      } else {
        this.getAuditingStatus()
      }
    })
  },
  getAuditingStatus: function() {
    let data = {
      userId: wx.getStorageSync('YJF_UERID')
    }
    app.post(app.Apis.GET_AUDITING, data, result => {
      if (result.success) {
        if (result.data == 'AUDITING') {   
          wx.showModal({
            title: '提示',
            content: '您的信息正在审核中，请耐心等待',
            showCancel: false
          })
        } else if (result.data == 'NOT_PASS' || !result.data) {
        }
      }
    })
  }
})
