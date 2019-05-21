var app = getApp()

Page({
  data: {
    totalChecked: true,
    list: [],
    storeId: '',
    userId: '',
    delBtnWidth: 132,
    startX: 0
  },
  onShow: function() {
    this.getData()
  },
  onLoad: function () {
    this.initEleWidth()
    this.setData({
      storeId: wx.getStorageSync('YJF_STORE_ID'),
      userId: wx.getStorageSync('YJF_UERID')
    })
  },
  touchS: function (e) {
    if (e.touches.length == 1) {
      //设置触摸起始点水平方向位置
      this.data.startX = e.touches[0].clientX
    }
  },
  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = ""
      if (disX == 0 || disX < 0) {
        //如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px"
      } else if (disX > 0) {
        //移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px"
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px"
        }
      }
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index
      var list = this.data.list
      list[index].txtStyle = txtStyle
      //更新列表的状态
      this.setData({
        list: list
      })
    }
  },
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX
      var delBtnWidth = this.data.delBtnWidth
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > (delBtnWidth / 2) ? "left:-" + delBtnWidth + "px" : "left:0px"
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index
      var list = this.data.list
      list[index].txtStyle = txtStyle
      //更新列表的状态
      this.setData({
        list: list
      })
    }
  },
  getEleWidth: function (w) {
    var real = 0
    try {
      var res = wx.getSystemInfoSync().windowWidth
      var scale = (750 / 2) / (w / 2) //以宽度750px设计稿做宽度的自适应
      // console.log(scale)
      real = Math.floor(res / scale)
      return real
    } catch (e) {
      return false
      // Do something when catch error
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth)
    this.data.delBtnWidth = delBtnWidth
  },
  editAddress: function(e) {
    wx.navigateTo({
      url: '/pages/addAddress/index?item=' + JSON.stringify(e.currentTarget.dataset.item)
    })
  },
  handleDelete: function(e) {
    wx.showModal({
      title: '提示',
      content: '确认删除该地址吗',
      confirmText: '确定',
      confirmColor: '#FB6FAD',
      showCancel: true,
      success: (res) => {
        if (res.confirm) {
          this.deleteData(e.currentTarget.dataset.item.id)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  deleteData: function(id) {
    let data = {
      addressId: id
    }
    app.post(app.Apis.DELETE_ADDRESS, data, result => {
      this.getData()
    })
  },
  getData: function() {
    wx.showLoading({
      title: '加载中'
    })
    let data = {
      storeId: this.data.storeId,
      userId: this.data.userId,
      delivedryMode: 'PICKUP_STORE'
    }
    app.post(app.Apis.GET_ADDRESS, data, result => {
        wx.hideLoading()
        this.setData({
          list: result.dataList
        })
    })
  },
  checkboxChange: function(e) {
    console.log(e)
    wx.showLoading({
      title: '加载中'
    })
    let mode = e.currentTarget.dataset.item
    let data = {}
    console.log(mode)
    this.setData({
      totalChecked: mode.isDefaultAddress == 1 ? false : true
    })
    console.log(this.data.totalChecked)
    if (mode.deliveryMode == 'PICKUP_STORE') {
      data = {
        addressId: mode.id,
        storeId: this.data.storeId,
        userId: this.data.userId,
        receiverName: mode.receiverName,
        receiverPhone: mode.receiverPhone,
        deliveryModeEnum: 'PICKUP_STORE',
        receiveStoreId: mode.receiveStoreId,
        isDefaultAddress: this.data.totalChecked ? 1 : 0
      }
    } else {
      data = {
        addressId: mode.id,
        storeId: this.data.storeId,
        userId: this.data.userId,
        receiverName: mode.receiverName,
        receiverPhone: mode.receiverPhone,
        placeLocation: mode.placeLocation,
        detailAddress: mode.detailAddress,
        isDefaultAddress: this.data.totalChecked ? 1 : 0,
        deliveryModeEnum: 'DELIVER_TO_HOME'
      }
    }
    app.post(app.Apis.POST_ADDRESS, data, result => {
      if (result.success && result.id) {
        this.getData()
      }
    })
  }
})
