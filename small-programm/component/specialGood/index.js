// component/specialGood/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type:String,
      value:''
    },
    isPingTuan:{
      type:Boolean,
      value:false
    },
    // 区分健康精选 实惠拼团  送礼到家
    cardType:{
      type: String,
      value: ''
    },
    goodsListData:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    dataList: [],
    newgoodsListData:[],
    currentPage:0
  },
  attached() {
    this.getEventGoods(this.properties.cardType, 'groupPurchasePrice')
  }, 
  /**
   * 组件的方法列表
   */
  methods: {
    formSubmit: function (e) {
      app.functions.getFormId(e.detail.formId)
    },
    goDetail: function (url) {
      wx.navigateTo({
        url: url
      })
    },
    goGifts: function () {
      wx.navigateTo({
        url: `/pages/gifts/index`
      })
    },
    goGroup: function () {
      let userId = wx.getStorageSync('YJF_UERID')
      if (!userId) {
        wx.navigateTo({
          url: `../index/index`
        })
        return
      } else {
        wx.navigateTo({
          url: `/pages/groupGoods/index`
        })
      }
    },
    getEventGoods: function (eventType, orderBy) {
      let data = {
        storeId: wx.getStorageSync('YJF_STORE_ID') || app.globalData.storeId,
        eventType: eventType,
        orderBy: orderBy
      }
      app.post(app.Apis.GET_EVENT_GOODS, data, result => {
        if (result.success) {
          let tempGoodList = result.dataList.map((item, index) => {
            item.imgUrl = JSON.parse(item.imageUrl).baseUrl + JSON.parse(item.imageUrl).bannerName[0]
            return item
          })
          this.setData({
            dataList: tempGoodList
          })
          this._setNewData()
        }
      })
    },
    // 点击某个商品
    clickItem(e){
      let item = e.currentTarget.dataset.item
      let cardType = this.properties.cardType
      if (cardType === 'sending_parents') {
        this.goDetail(`/pages/goodDetail/index?goodsId=${item.id}&tuanType=gift`)
      }
      if (cardType === 'group_purchase') {
        this.goDetail(`/pages/goodDetail/index?goodsId=${item.id}&eventType=group_purchase`)
      }
      if (this.properties.cardType === 'healthy_selected') {
        this.goDetail(`/pages/goodDetail/index?goodsId=${item.id}&eventType=healthy_selected`)
      }
    },
    // 点击更多
    clickMore(){
      if (this.properties.cardType === 'sending_parents') {
        this.goGifts()
      }
      if (this.properties.cardType === 'group_purchase') {
        this.goGroup()
      }
    },
    // 当超过3个应该分页，并且展示更多
    _setNewData(){
      var pages = 1
      if (this.data.dataList.length > 3){
        pages = Math.ceil(this.data.dataList.length / 3)
      }
      var newArr = new Array() 
      for(var i=0;i<pages;i++){
        var arr = new Array()
        for (var j in this.data.dataList) {
          if (i == Math.floor((Number(j) / 3))){
            arr.push(this.data.dataList[Number(j)])
          }
        }
        newArr.push(arr)
      }
      this.setData({
        newgoodsListData: newArr
      })
    },

    swiperChage(e){
      this.setData({
        currentPage:e.detail.current
      })
    }

  }
})
