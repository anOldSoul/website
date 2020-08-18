// pages/index/index.js
const app = getApp()
Page({
  data: {
    networkType: '',
    deviceList: [{
      model: 'TZFACE',
      network: '',
      sn: '0001'
    }]
  },
  onShareAppMessage: function (res) {
    return {
      title: '快来和我一起打开智能生活的大门吧！'
    }
  },
  onPullDownRefresh: function () {
    this.getList()
  },
  addDevice() {
    if (!wx.getStorageSync('userid')) {
      wx.navigateTo({
        url: `/pages/login/index`
      })
    } else {
      if (this.data.deviceList.length === 3) {
        wx.showModal({
          title: '提示',
          content: '您已经绑定了3把门锁，可更换其他微信号绑定。',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        wx.navigateTo({
          url: `/pages/install/index`
        })
      }
    }
  },
  onLoad: function (options) {
    wx.getNetworkType({
      success: (res) => {
        this.setData({
          networkType: res.networkType
        })
      }
    })
  },
  onBind: function(status) {
    console.log(status)
  },
  onShow: function () {
  },
  getList() {
    let config = app.Apis.GET_DEVICES
    let config1 = Object.assign([], config);
    let userid = wx.getStorageSync('userid')
    config1[1] = `${config1[1]}/${userid}`
    app.post(config1, {}, result => {
      if (result.errno === 0) {
        wx.stopPullDownRefresh()
        this.setData({
          deviceList: result.data
        })
      }
    })
  },
  goAddDevicePage: function() {
    wx.navigateTo({
      url: `/pages/admPw/index`
    })
  },
  goHomePage: function (e) {
    wx.navigateTo({
      url: `/pages/index/index`
    })
  }
})