var app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    inputValue: '',
    ruleList: ''
  },
  onLoad: function (option) {
    this.setData({
      currentPopularityValue: option.currentPopularityValue
    })
  },
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  handleTixian: function() {
    let money = parseFloat(this.data.currentPopularityValue)
    let inputValue = parseFloat(this.data.inputValue)
    if (inputValue > money) {
      wx.showToast({
        title: '提现金额不足',
        icon: 'success',
        image : '../../images/error.png',
        duration: 2000
      })
    } else if (inputValue < 5 || inputValue % 1 !== 0) {
      wx.showModal({
        title: '提示',
        content: '5元起提，提现金额须为整数',
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
    } else {  
      let data = {
        storeId: wx.getStorageSync('YJF_STORE_ID'),
        userId: wx.getStorageSync('YJF_UERID'),
        openId: wx.getStorageSync('OPENID'),
        withdrawMoney: this.data.inputValue
      }
      app.post(app.Apis.POST_CASH, data, result => {
        if (result.success) {
          wx.showToast({
            title: '提现成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(() => {       
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
        }
      })
    }
  }
})
