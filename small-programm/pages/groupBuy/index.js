var app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    groupPurchaseId: '',
    countDown: '',
    minutes: '',
    hours: '',
    imgUrls: '',
    resultData: '',
    goodInfo: '',
    memberList: [1,2,3]
  },
  onShareAppMessage: function (res) {
    return {
      title: `【我已领，手慢无】${this.data.goodInfo.name}`,
      path: `/pages/groupBuy/index?groupPurchaseId=${this.data.groupPurchaseId}`
    }
  },
  goDetail: function() {
    let tuanType
    if (this.data.resultData.jumpButtonDesc === '我要参团') {
      tuanType = 'cantuan'
    } else {
      tuanType = 'kaituan'
    }
    wx.navigateTo({
      url: `/pages/goodDetail/index?goodsId=${this.data.goodInfo.id}&eventType=group_purchase&tuanType=${tuanType}&groupPurchaseId=${this.data.groupPurchaseId}`
    })
  },
  carculate: function (leftTime) {
    let tempInterval = setInterval(() => {
      if (leftTime === 0) {
        clearInterval(tempInterval)
        return
      }
      var hours = parseInt(leftTime / 60 / 60, 10); //计算剩余的小时
      var minutes = parseInt((leftTime - hours * 60 * 60) / 60);//计算剩余的分钟
      var seconds = leftTime - minutes * 60 - hours * 60 * 60;//计算剩余的秒数
      hours = this.checkTime(hours);
      minutes = this.checkTime(minutes);
      seconds = this.checkTime(seconds);
      this.data.countDown = seconds
      this.setData({
        countDown: seconds,
        minutes: minutes,
        hours: hours
      })
      leftTime--
    }, 1000)
  },
  handlePintuan: function() {
    let tuanType = ''
    if (this.data.resultData.jumpButtonDesc === '我也要开团') {
      tuanType = 'kaituan'
    }
    if (this.data.resultData.jumpButtonDesc === '我要参团') {
      tuanType = 'cantuan'
    }
    wx.navigateTo({
      url: `/pages/goodDetail/index?tuanType=${tuanType}&groupPurchaseId=${this.data.groupPurchaseId}&goodsId=${this.data.goodInfo.id}&eventType=group_purchase`
    })
  },
  handleGoOrder: function() {
    wx.navigateTo({
      url: `/pages/order/index`
    })
  },
  checkTime: function(i) { //将0-9的数字前面加上0，例1变为01
    if(i < 10) {
      i = "0" + i;
    }
    return i;
  },
  getGroupData: function() {
    let data = {
      userId: wx.getStorageSync('YJF_UERID'),
      groupPurchaseId: this.data.groupPurchaseId
    }
    app.post(app.Apis.GET_GROUP_DETAIL, data, result => {
      if (result.success) {
        let resultData = result.data
        let goodInfo = resultData.onlineMallGoodsInfo
        let bannerList = []
        let imgUrls = JSON.parse(goodInfo.imageUrl)
        let memberList = resultData.inviteeUsersInfoList
        let tempNum = goodInfo.groupPurchaseNumber - resultData.inviteeUsersInfoList.length
        for (let i = 0; i < tempNum; i++) {
          memberList.push(i)
        }
        this.setData({
          memberList: memberList,
          goodInfo: goodInfo,
          resultData: resultData,
          imgUrls: imgUrls.baseUrl + imgUrls.bannerName[0]
        })
        this.carculate(resultData.countDownSecond)
      }
    })
  },
  onLoad: function (option) {
    this.data.groupPurchaseId = option.groupPurchaseId
    this.getGroupData()
  }
})
