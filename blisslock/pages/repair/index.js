const app = getApp()
Page({
  data: {
    repaireDesc: '',
    chooseAddress: '',
    repaireType: '',
    items: [
      { name: '指纹开不了锁', value: '指纹开不了锁' },
      { name: '密码开不了锁', value: '密码开不了锁' },
      { name: '锁体没有电了', value: '锁体没有电了' },
      { name: '其他故障描述', value: '其他故障描述' }
    ]
  },
  radioChange(e) {
    this.data.repaireType = e.detail.value
  },
  bindKeyInput: function (e) {
    this.data.repaireDesc = e.detail.value
  },
  onLoad() {
    this.setData({
      chooseAddress: wx.getStorageSync('chooseAddress')
    })
  },
  handleText: function() {
    if (!this.data.repaireType) {
      wx.showToast({
        title: '请选择故障类型',
        icon: 'none',
        duration: 2000
      })
      return
    }
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
          guaranteeType: this.repaireType,
          productType: app.util.getDeviceItem('type'),
          guaranteeDesc: this.data.repaireDesc,
          latitude: res.latitude,
          longitude: res.longitude
        }
        app.post(app.Apis.POST_REPAIRE, data, result => {
          if (result.errno === 0) {
            wx.navigateBack({
              delta: 1
            })
            app.util.updateDeviceList('showRepair', true)
          }
        })
      }
    })
    // wx.makePhoneCall({
    //   phoneNumber: '4001191196',
    // })
  }
})