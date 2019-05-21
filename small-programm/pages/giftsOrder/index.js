var app = getApp()

Page({
  data: {
    delBtnWidth:180,  //删除按钮宽度单位（rpx）
    totalNum: 0,
    totalPrice: 0,
    list: [],
    blessings: '',
    tips: '',
    storeId: '',
    userId: ''
  },
  onPullDownRefresh: function () {
    this.getData()
  },
  onLoad: function () {
    wx.setStorageSync('SELECT_BLESSING', '')
    this.initEleWidth()
  },
  onShow: function() {
    let userId = wx.getStorageSync('YJF_UERID')
    if (wx.getStorageSync('SELECT_BLESSING')) {
      this.setData({
        blessings: wx.getStorageSync('SELECT_BLESSING')
      })
    }
    this.setData({
      storeId: wx.getStorageSync('YJF_STORE_ID'),
      userId: wx.getStorageSync('YJF_UERID')
    })
    this.getData()
  },
  touchS:function(e){
    if(e.touches.length==1){
        //设置触摸起始点水平方向位置
        this.data.startX = e.touches[0].clientX
    }
  },
  goBlessing() {
    wx.navigateTo({
      url: '/pages/wishing/index'
    })
  },
  addGift() {
    wx.navigateTo({
      url: '/pages/gifts/index'
    })
  },
  delItem: function(e) {
    wx.showModal({
      title: '提示',
      content: '确定删除该商品?',
      success: (res) => {
        if (res.confirm) {
          let goodsId = this.data.list[e.currentTarget.dataset.index].goodsId
          let data = {
            storeId: this.data.storeId,
            userId: this.data.userId,
            goodsId: goodsId
          }
          app.post(app.Apis.DELETE_CART_GIFT, data, result => {
            if (result.success) {
              this.getData()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  getData: function(resolve) {
    wx.showLoading({
      title: '加载中',
    })
    let data = {
      storeId: this.data.storeId,
      userId: this.data.userId
    }
    app.post(app.Apis.GET_GIFT_CART, data, result => {
      if (result.success) {
        wx.hideLoading()
        this.setData({
          list: result.data.onlineMallGiftCartAndGoodsList,
          tips: '您的购物车空空如也，快去买买买吧！',
          totalNum: result.data.totalNumber,
          totalPrice: result.data.totalPrice
        })
        if (resolve) {
          resolve()
        }
      }
    })
  },
  touchM:function(e){
    if(e.touches.length==1){
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = ""
      if(disX == 0 || disX < 0){
        //如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px"
      }else if(disX > 0 ){
        //移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-"+ disX + "px"
        if(disX >= delBtnWidth){
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
  touchE:function(e){
   if(e.changedTouches.length == 1){
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
       list:list
     })
   }
  },
  getEleWidth:function(w){
    var real = 0
    try{
      var res = wx.getSystemInfoSync().windowWidth
      var scale = (750/2)/(w/2) //以宽度750px设计稿做宽度的自适应
      // console.log(scale)
      real = Math.floor(res/scale)
      return real
    } catch (e) {
      return false
     // Do something when catch error
    }
  },
  initEleWidth:function(){
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth)
    this.data.delBtnWidth = delBtnWidth
  },
  handleSubtract: function(e) {
    var index = e.currentTarget.dataset.index
    if (this.data.list[index].goodsNumber > 1) {
      var list = this.data.list
      list[index].goodsNumber--
      this.setData({
        list:list
      })
      this.handleJoinIn(list[index].goodsNumber, list[index].goodsId, list[index].eventType)
    }
  },
  handleAdd: function(e) {
    var index = e.currentTarget.dataset.index
    var list = this.data.list
    list[index].goodsNumber++
    this.setData({
      list:list
    })
    this.handleJoinIn(list[index].goodsNumber, list[index].goodsId, list[index].eventType)
  },
  handleBuy: function(e) {
    let num = 0
    let id = e.currentTarget.dataset.item.id
    this.data.list.forEach((item, index) => {
      if (item.goodsId == id) {
        num = item.goodsNumber + 1
      }
    })
    if (num == 0) {
      num = 1
    }
    this.handleJoinIn(num, id)
  },
  bindInputValue: function(e) {
    if (!e.detail.value || e.detail.value == 0) {
      this.setData({
        list: this.data.list
      })
      wx.showToast({
        title: '数量超出范围',
        image : '../../images/error.png',
        duration: 2000
      })
    } else {
      let index = e.currentTarget.dataset.index
      this.data.list[index].goodsNumber = parseInt(e.detail.value)
      this.handleJoinIn(this.data.list[index].goodsNumber, this.data.list[index].goodsId, this.data.list[index].eventType)
    }
  },
  handleJoinIn: function(num, id, eventType='') {
    wx.showLoading({
      title: '加载中',
    })
    let data = {
      storeId: this.data.storeId,
      goodsId: id,
      userId: this.data.userId,
      goodsNumber: num,
      eventType
    }
    app.post(app.Apis.POST_GIFT_CART, data, result => {
      if (result.success) {
        wx.hideLoading()
        if (result.data.addSuccess) {
          new Promise((resolve, reject) => {
            this.getData(resolve)
          }).then(()=> {
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 2000
            })
          })
        } else {
          this.getData()
          wx.showModal({
            title: '提示',
            content: result.data.addFailureReason,
            showCancel: false,
            confirmText: '知道了',
            success: function(res) {
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
  goDetail: function(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/goodDetail/index?goodsId=' + item.id
    })
  },
  handleTabClick: function(e) {
    this.setData({
      activeIndex: e.currentTarget.id
    })
  },
  bindBlessingsInput: function(e) {
    this.setData({
      blessings: e.detail.value
    })
  },
  goGift: function() {
    if (this.data.totalNum == 0) {
      wx.showModal({
        title: '提示',
        content: '您还没有选择商品哦！',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#ff4400',
        success: function(res) {
          if (res.confirm) {
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      let orderItemList = []
      this.data.list.forEach((item, index) => {
        orderItemList.push({
          unitPrise: item.presentPrice,
          goodsId: item.goodsId,
          goodsNumber:item.goodsNumber
        })
      })
      let data = {
        storeId: wx.getStorageSync('YJF_STORE_ID'),
        userId: wx.getStorageSync('YJF_UERID'),
        orderItemList: JSON.stringify(orderItemList),
        nickName: wx.getStorageSync('nickName'),
        headImageUrl: wx.getStorageSync('avatarUrl'),      
        blessings: this.data.blessings.substring(0, 50) || '一声问候，带去你的关心和祝福。'
      }
      app.post(app.Apis.POST_GIFT_ORDER, data, result => {
        if (result.success) {
          let giftId = result.data.giftId
          let data = {
            wechatId: app.globalData.wechatId,
            openId: wx.getStorageSync('TMM_OPENID'),
            totalFee: parseInt(this.data.totalPrice * 100),
            outTradeNo: result.data.orderId,
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
                'success': (res) => {
                  wx.redirectTo({
                    url: '/pages/givingGifts/index?giftId=' + giftId
                  })
                },
                'fail': (res) => {
                  wx.redirectTo({
                    url: '../payResult/index?result=0&price=' + this.data.totalPrice
                  })
                }
              })
            }
          })
        }
      })
    }
  }
})
