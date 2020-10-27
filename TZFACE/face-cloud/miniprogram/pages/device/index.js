// pages/index/index.js
const app = getApp()
Page({
  data: {
    mqttconnected: false,
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
  goCreateTemp() {
    if (this.data.deviceList.length === 0) {
      wx.showModal({
        title: '提示',
        content: '您还未绑定设备哦，请先添加设备',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    }
    wx.navigateTo({
      url: `/pages/tempRecord/index`
    })
  },
  addDevice() {
    if (!wx.getStorageSync('TZFACE-userid')) {
      wx.navigateTo({
        url: `/pages/login/index`
      })
    } else {
      if (this.data.deviceList.length === 10) {
        wx.showModal({
          title: '提示',
          content: '您已经绑定了10把门锁，可更换其他微信号绑定。',
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
  },
  watchBack: function (name) {
    console.log('pageDevice监听：。。。。')
    console.log(name)
    if (name === 'mqttconnected') {
      this.data.mqttconnected = true
      wx.hideLoading()
      this.getList()
    } else {
      this.data.deviceList.forEach((item, index) => {
        if (item.sn === name) {
          item.status = '在线'
        } else {
          item.status = ''
        }      
      })
      this.setData({
        deviceList: this.data.deviceList
      })
    }
  },
  onBind: function(status) {
    console.log(status)
  },
  onShow: function () {
    let that = this;
    app.watch(that.watchBack)
    this.getList()
  },
  getList() {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    let userid = wx.getStorageSync('TZFACE-userid')
    console.log(userid)
    if (userid) {
      db.collection('devices').where({
        userid: wx.getStorageSync('TZFACE-userid')
      }).get({
        success: res => {
          let list = res.data
          if (this.data.mqttconnected) {
            list.forEach((item, index) => {
              if (item.sn) {
                let msg = { "func": "GetDeviceInfo", "sn": item.sn, "userid": wx.getStorageSync('TZFACE-userid') }
                console.log(msg)
                app.publish(msg)
              }
            })
          }

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
    }

  },
  handleOpen(e) {
    let selectIndex = e.currentTarget.dataset.index
    let msg = { "func": "RmOpen", "sn": this.data.deviceList[selectIndex].sn, "userid": wx.getStorageSync('TZFACE-userid') }
    console.log(msg)
    app.publish(msg)
    wx.showLoading({
      title: '正在开门',
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
    wx.navigateTo({
      url: `/pages/index/index`
    })
  }
})