var app = getApp()
Page({
  data: {
    reasonArray: [{
      type: '仅退款（无需退货）',
      reason: ['多拍，拍错，不想要', '未按约定时间发货', '协商一致退款', '发货慢', '其他']
      },
      {
        type: '退货退款',
        reason: ['卖家发错货', '包装破损', '少件漏发', '商品质量问题', '其他']
      }, {
        type: '其他问题反馈',
        reason: ['其他']
      }
    ],
    index: '',
    reasonIndex: '',
    inputValue1: '',
    orderId: '',
    content: ''
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },
  onLoad: function(option) {
    this.data.orderId = option.orderId
  },
  makeSure:function() {
    if (!this.data.index) {
      wx.showToast({
        title: '请选择申请类型',
        image: '/images/icon_tishi1.png',
        duration: 2000
      })
    } else if (!this.data.reasonIndex) {
      wx.showToast({
        title: '请选择申请原因',
        image: '/images/icon_tishi1.png',
        duration: 2000
      })
    } else if (!this.data.inputValue1) {
      wx.showToast({
        title: '请填写申请说明',
        image: '/images/icon_tishi1.png',
        duration: 2000
      })
    } else {
      let data = {
        orderId: this.data.orderId,
        applyType: this.data.reasonArray[this.data.index].type,
        applyReason: this.data.reasonArray[this.data.index].reason[this.data.reasonIndex],
        applyExplain: this.data.inputValue1
      }
      app.post(app.Apis.POST_AFTER_SALE, data, result => {
        if (result.success) {
          wx.showToast({
            title: '已提交!',
            duration: 2000
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          },1000)
        }
      })
    }
  },
  bindPickerReasonChange: function(e) {
    this.setData({
      reasonIndex: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      reasonIndex: ''
    })
  },
  bindContentInput: function(e) {
    this.setData({
      inputValue1: e.detail.value
    })
  }
})

