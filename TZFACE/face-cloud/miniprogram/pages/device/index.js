// pages/index/index.js
const app = getApp()
Page({
  data: {
    networkType: '',
    deviceList: []
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
    if (!wx.getStorageSync('TZFACE-userid')) {
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
    this.getList()
  },
  getList() {
    console.log(wx.getStorageSync('TZFACE-userid'))
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('devices').where({
      userid: wx.getStorageSync('TZFACE-userid')
    }).get({
      success: res => {
        console.log(res)
        this.setData({
          deviceList: res.data
        })
        wx.stopPullDownRefresh()
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  goAddDevicePage: function() {
    wx.navigateTo({
      url: `/pages/admPw/index`
    })
  },
  goHomePage: function (e) {
    console.log(e)
    let selectIndex = e.currentTarget.dataset.index
    wx.setStorageSync('sn', this.data.deviceList[selectIndex].sn)
    if (app.globalData.wifissid === this.data.deviceList[selectIndex].SSID) {
      wx.navigateTo({
        url: `/pages/index/index`
      })
    } else {
      wx.showModal({
        title: '提示',
        content: `请连接设备对应网络${this.data.deviceList[selectIndex].SSID}`,
        showCancel: false,
        success(res) {
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