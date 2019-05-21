var app = getApp()
Page({
  data: {
    tabs: ['待领取', '已领取'],
    activeIndex: '0',
    sliderWidth: 0,
    sliderLeft: 0,
    sliderOffset: 0,
    unclaimedList: [],
    receivedList: [],
    cPage: 1,
    from: '',
    totalPoint: '',
    orderItemList: ''
  },
  // tab
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      cPage: 1
    })
    this.setTabBar()
    this.getData()
  },
  setTabBar() {
    wx.createSelectorQuery().select('.weui-navbar__item.weui-bar__item_on').boundingClientRect(rect => {
      this.setData({
        sliderOffset: rect.left,
        sliderWidth: rect.width
      })
    }).exec()
  },
  // 待领取
  getUnclaimedList() {
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID'),
      userId: wx.getStorageSync('YJF_UERID')
    }
    app.post(app.Apis.GET_COUPONS_WAIT, data, result => {
      wx.hideLoading()
      this.setData({
        unclaimedList: result.dataList
      })
      this.afterGetData()
    })
  },
  // --已领取
  getReceivedList(cPage) {
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID'),
      userId: wx.getStorageSync('YJF_UERID'),
      size: 10,
      cPage
    }
    if (this.data.from != 'my') {
      data.orderItemList = this.data.orderItemList
    }
    app.post(app.Apis.GET_COUPONS_RECEIVED, data, result => {
      result.dataList.forEach((item, index) => {
        item.startDate = app.Moment(item.startDate).format('YYYY.MM.DD')
        item.endDate = app.Moment(item.endDate).format('YYYY.MM.DD')
        if (item.id == wx.getStorageSync('SELECT_COUPON').id) {
          item.checked = true
        } else {
          item.checked = false
        }
      })
      this.setData({
        receivedList: result.dataList
      })
      this.afterGetData()
    })
  },
  getData() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    switch (this.data.activeIndex) {
      case '0':
        this.getUnclaimedList()
        break;
      case '1':
        this.getReceivedList(1)
        break;
      default:
        this.getUnclaimedList()
    }
  },
  afterGetData() {
    wx.hideLoading()
    wx.stopPullDownRefresh()
  },
  // 立即领取
  handleToReceive(e) {
    let id = e.currentTarget.id
    wx.showLoading({
      title: '领取中...',
      mask: true
    })
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID'),
      userId: wx.getStorageSync('YJF_UERID'),
      classId: id
    }
    app.post(app.Apis.POST_COUPON, data, result => {
      wx.hideLoading()
      if (result.data) {
        wx.showToast({
          title: '领取成功!',
          success: () => {
            this.getData()
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '领取失败，请稍后重试!',
          showCancel: false
        })
      }
    })
  },
  // 立即使用
  handleGoDetail(e) {
    let tempIndex = e.currentTarget.id
    if (this.data.receivedList[tempIndex].canUse) {
      wx.switchTab({
        url: '/pages/shopping/index'
      })
    }
  },
  onLoad: function (option) {
    if (option.totalPoint) {
      this.data.totalPoint = option.totalPoint
    }
    if (option.from == 'my') {
      this.data.activeIndex = '0'
    } else {
      this.data.activeIndex = '1'
    }
    this.setData({
      orderItemList: option.order || '',
      from: option.from,
      totalPoint: this.data.totalPoint,
      activeIndex: this.data.activeIndex
    })
  },
  onReady() {
    this.setTabBar()
  },
  onPullDownRefresh() {
    this.setData({
      cPage: 1
    })
    this.getData()
  },
  handleCheckChange: function(e) {
    let tempIndex = e.currentTarget.id
    if (this.data.receivedList[tempIndex].canUse) {    
      if (this.data.from == 'order') {
        if (this.data.totalPoint >= this.data.receivedList[tempIndex].minConsumption) {
          this.data.receivedList[tempIndex].checked = true
        } else {
          wx.showToast({
            title: `该券须${this.data.receivedList[tempIndex].validCondition}`,
            image : '../../../images/error.png'
          })
        }
      }
      this.setData({
        receivedList: this.data.receivedList
      })
      if (this.data.receivedList[tempIndex].checked) {
        wx.setStorageSync('SELECT_COUPON', this.data.receivedList[tempIndex])
        wx.navigateBack({
          delta: 1
        })
      }
    }
  },
  onReachBottom() {
    let activeIndex = this.data.activeIndex
    if (activeIndex === '1') {
      if (this.data.receivedList.length == 10) {
        wx.showLoading({
          title: '加载中...',
          mask: true
        })
        this.data.cPage ++
        this.getReceivedList(this.data.cPage)
      }
    }
  },
  onShow() {
    this.getData()
  }
})