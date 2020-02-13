const app = getApp()
Page({
  data: {
    items: [
      { name: 'USA', value: '非常满意' },
      { name: 'CHN', value: '满意' },
      { name: 'BRA', value: '不满意' },
    ],
    index: '0',
    chooseAddress: {},
    array: ['D1', 'V6', 'V8']
  },
  onShow: function (options) {
    this.setData({
      chooseAddress: wx.getStorageSync('chooseAddress')
    })
  },
  addAddress: function () {
    wx.chooseAddress({
      success(res) {
        wx.setStorageSync('chooseAddress', res)
        console.log(wx.getStorageSync('chooseAddress'))
        // console.log(res.userName)
        // console.log(res.postalCode)
        // console.log(res.provinceName)
        // console.log(res.cityName)
        // console.log(res.countyName)
        // console.log(res.detailInfo)
        // console.log(res.nationalCode)
        // console.log(res.telNumber)
      }
    })
  },
  goNext: function() {
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
          statisfaction: '1',
          latitude: res.latitude,
          longitude: res.longitude
        }
        app.post(app.Apis.POST_ADDRESS, data, result => {
        })
      }
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  }
})