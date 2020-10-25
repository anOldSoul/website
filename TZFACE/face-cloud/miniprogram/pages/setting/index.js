const app = getApp()
var udp
Page({
  data: {
    deviceName: ''
  },
  onShow: function () {
    this.getDevice()
  },
  getDevice() {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('devices').where({
      sn: wx.getStorageSync('sn')
    }).get({
      success: res => {
        console.log(res)
        this.setData({
          deviceName: res.data[0].name
        })
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
  goName() {
    wx.navigateTo({
      url: `/pages/deviceName/index?name=${this.data.deviceName}`
    })
  },
  goNetwork() {
    wx.navigateTo({
      url: `/pages/status/index`
    })
  },
  unbind() {
    wx.showModal({
      title: '提示',
      content: '帐号解绑后，门禁本地数据保留，可以使用其他帐号或此帐号重新扫码绑定门锁，请确认',
      success: (res) => {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.cloud.callFunction({
            name: 'updateDevice',
            data: {
              sn: wx.getStorageSync('sn'),
              userid: ''
            }
          }).then((e) => {
            wx.hideLoading()
            wx.switchTab({
              url: '/pages/device/index',
              success: () => {
                wx.showToast({
                  title: '解绑成功',
                  icon: 'none'
                })
              }
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})
