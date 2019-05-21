var app = getApp()

Page({
  data: {
    cardInfo: {},
    delBtnWidth:180,  //删除按钮宽度单位（rpx）
    totalChecked: false,
    totalNum: 0,
    totalPoint: 0,
    list: [],
    tips: '',
    storeId: '',
    userId: ''
  },
  onPullDownRefresh: function () {
    let p1 = new Promise((resolve, reject) => {
      this.getData(resolve, reject)
    })
    let p2 = new Promise((resolve, reject) => {
      this.getGoodsData(resolve, reject)
    })
    Promise.all([p1, p2]).then((result) => {
      wx.stopPullDownRefresh()
    }).catch((error) => {
      console.log(error)
    })
  },
  onLoad: function () {
    this.initEleWidth()
  },
  onShow: function() {
    let userId = wx.getStorageSync('YJF_UERID')
    if (!userId) {
      wx.redirectTo({
        url: `../index/index`
      })
      return
    }
    this.setData({
      storeId: wx.getStorageSync('YJF_STORE_ID'),
      userId: wx.getStorageSync('YJF_UERID')
    })
    this.getData()
    this.getGoodsData()
  },
  touchS:function(e){
    if(e.touches.length==1){
        //设置触摸起始点水平方向位置
        this.data.startX = e.touches[0].clientX
    }
  },
  cartGoodDetail: function (e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/goodDetail/index?goodsId=${item.goodsId}`
    })
  },
  getGoodsData: function (resolve, reject) {
    let data = {
      storeId: this.data.storeId,
      orderBy: 'goodsRemarks',
      userId: this.data.userId
    }
    app.post(app.Apis.GET_LIKE, data, result => {
      if (result.success) {
        wx.hideLoading()
        if (resolve) {
          resolve()
        }
        let tempGoodList = result.dataList
        if (tempGoodList.length == 0) {
          this.setData({
            tips: '很抱歉，暂无符合要求商品哦！'
          })
        } else {          
          tempGoodList.forEach((item, index) => {
            let imageUrl = JSON.parse(item.imageUrl)
            item.imgUrl = imageUrl.baseUrl + imageUrl.bannerName[0]
          })
          this.setData({
            rangeGoodsList: tempGoodList
          })
        }
      }
    })
  },
  delItem: function(e) {
    wx.showModal({
      title: '提示',
      content: '确定删除该商品?',
      success: (res) => {
        if (res.confirm) {
          let goodsId = this.data.list[e.currentTarget.dataset.index].goodsId
          let eventType = this.data.list[e.currentTarget.dataset.index].eventType
          let data = {
            storeId: this.data.storeId,
            userId: this.data.userId,
            goodsId: goodsId,
            eventType: eventType
          }
          app.post(app.Apis.DELETE_ITEM, data, result => {
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
  getData: function (resolve, reject) {
    wx.showLoading({
      title: '加载中',
    })
    let data = {
      storeId: this.data.storeId,
      userId: this.data.userId
    }
    app.post(app.Apis.GET_CART, data, result => {
      if (result.success) {
        result.dataList.forEach((item, index) => {
          item.goodsName = item.goodsName.length > 16 ? item.goodsName.substring(0, 16) + '...' : item.goodsName
          item.checked = true
          let imageUrl = JSON.parse(item.imageUrl)
          item.imgUrl = imageUrl.baseUrl + imageUrl.bannerName[0]
        })
        wx.hideLoading()
        this.setData({
          list: result.dataList,
          tips: '您的购物车空空如也，快去买买买吧！'
        })
        if (resolve) {
          resolve()
        }
        this.handleTotal()
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
      this.handleTotal()
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
    this.handleTotal()
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
      this.handleTotal()
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
    app.post(app.Apis.POST_CART, data, result => {
      if (result.success) {
        wx.hideLoading()
        if (result.data.addSuccess) {         
          new Promise((resolve, reject) => {
            this.getData(resolve)
          }).then(()=> {
            wx.showToast({
              title: '加入购物车成功',
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
  handleTotal: function() {
    let tempTotal = 0
    let tempTotalNum = 0
    let totalNum = 0
    this.data.list.forEach((item, index) => {
      totalNum += parseInt(item.goodsNumber)
      if (item.checked) {
        let presentPrice = item.presentPrice.toString()
        let tempPrice = presentPrice.length - presentPrice.indexOf('.') - 1
        tempTotal += Math.round(Math.pow(10, tempPrice)*item.presentPrice)* parseInt(item.goodsNumber)/Math.pow(10, tempPrice)
        tempTotalNum += parseInt(item.goodsNumber)
      }
    })
    if (tempTotalNum == totalNum) {
      this.data.totalChecked = true
    } else {
      this.data.totalChecked = false
    }
    this.setData({
      totalPoint: tempTotal.toFixed(2),
      totalNum: tempTotalNum,
      totalChecked: this.data.totalChecked
    })
  },
  handleCheckbox: function(e) {
    let tempIndex = e.currentTarget.id
    this.data.list[tempIndex].checked = !this.data.list[tempIndex].checked
    this.setData({
      list: this.data.list
    })
    this.handleTotal()
  },
  checkboxChange: function(e) {
    this.data.totalChecked = !this.data.totalChecked
    let tempCheck
    if (this.data.totalChecked) {
      tempCheck = true
    } else {
      tempCheck = false
    }
    this.data.list.forEach((item, index) => {
      this.data.list[index].checked = tempCheck
    })
    this.setData({
      list: this.data.list,
      totalChecked: this.data.totalChecked
    })
    this.handleTotal()
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
  handleBalance: function() {
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
      wx.setStorageSync('SELECT_COUPON', '')
      let orderItemList = []
      this.data.list.forEach((item, index) => {
        if (item.checked) {
          orderItemList.push({
            presentPrice: item.presentPrice,
            goodsId: item.goodsId,
            goodsNumber:item.goodsNumber,
            imgUrl: item.imgUrl,
            eventType: item.eventType
          })
        }
      })
      wx.navigateTo({
        url: '/pages/fillOrder/index?totalNum=' + this.data.totalNum + '&totalPoint=' + this.data.totalPoint + '&info=' + JSON.stringify(orderItemList)
      })
    }
  }
})
