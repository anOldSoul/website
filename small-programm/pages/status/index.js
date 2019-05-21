var app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    isSubmit: false,
    orderId: '',
    statustype: '',
    inputCompany: '',
    inputNum: '',
    statusList: [],
    detailList: []
  },
  onLoad: function (option) {
    new app.ToastPannel()
    let title
    this.setData({
      orderId: option.orderId,
      statustype: option.statustype
    })
    if (this.data.statustype === 'afterSale') {
      title = '售后状态'
      this.getAfterSale()
    } else {
      title = '状态追踪'
      this.getData()
    }
    wx.setNavigationBarTitle({
      title: title
    })
  },
  handleFeedback: function() {
    this.setData({
      isSubmit: true
    })
  },
  handleSubmit: function() {
    if (!this.data.inputCompany) {
      this.show('请填写物流公司')
      return
    }
    if (!this.data.inputNum) {
      this.show('请填写物流单号')
      return
    }
    let data = {
      orderId: this.data.orderId,
      expressCompany: this.data.inputCompany,
      logisticsNumber: this.data.inputNum
    }
    app.post(app.Apis.PUT_RETURN_GOODS, data, result => {
      if (result.success) {
        this.setData({
          isSubmit: false
        })
        this.getAfterSale()
        wx.showToast({
          title: '已提交!',
          duration: 2000
        })
      }
    })
  },
  handleCancel: function() {
    this.setData({
      isSubmit: false
    })
  },
  bindCompanyInput: function (e) {
    this.setData({
      inputCompany: e.detail.value
    })
  },
  bindNumInput: function (e) {
    this.setData({
      inputNum: e.detail.value
    })
  },
  getAfterSale: function() {
    let data = {
      orderId: this.data.orderId
    }
    app.post(app.Apis.GET_AFTER_SALE_STATUS, data, result => {
      if (result.success) {
        this.setData({
          statusList: result.dataList
        })
      }
    })
  },
  getData: function() {
    let data = {
      orderId: this.data.orderId
    }
    app.post(app.Apis.GET_ORDER_STATUS, data, result => {
      if (result.success) {
        this.setData({
          detailList: result.data,
          statusList: result.data.onlineMallUserOrderStatusList
        })
      }
    })
  }
})
