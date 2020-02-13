const app = getApp()
Page({
  data: {
    repaireDesc: '',
    chooseAddress: '',
    items: [
      { name: 'USA', value: '指纹开不了锁' },
      { name: 'CHN', value: '密码开不了锁' },
      { name: 'BRA', value: '锁体没有电了' },
      { name: 'BRA', value: '其他故障描述' }
    ]
  },
  bindKeyInput: function (e) {
    this.data.repaireDesc = e.detail.value
  },
  onLoad() {
    this.setData({
      chooseAddress: wx.getStorageSync('chooseAddress')
    })
  },
  callPhone: function() {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        let data = {
          province: this.data.chooseAddress.provinceName,
          city: this.data.chooseAddress.cityName,
          area: this.data.chooseAddress.countyName,
          phone: this.data.chooseAddress.telNumber,
          owner: this.data.chooseAddress.userName,
          InstallationAddress: this.data.chooseAddress.detailInfo,
          guaranteeType: '1',
          guaranteeDesc: this.data.repaireDesc,
          latitude: res.latitude,
          longitude: res.longitude
        }
        app.post(app.Apis.POST_REPAIRE, data, result => {
          if (result.errno === 0) {
            wx.showToast({
              title: '报修成功',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
    // wx.makePhoneCall({
    //   phoneNumber: '4001191196',
    // })
  }
})