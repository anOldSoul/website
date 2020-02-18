const app = getApp()
Page({
  data: {
    items: [
      { name: 'USA', value: '非常满意', checked: true },
      { name: 'CHN', value: '满意' },
      { name: 'BRA', value: '不满意' },
    ],
    index: '0',
    chooseAddress: {},
    addressStr: '',
    array: [],
    latitude: '',
    longitude: ''
  },
  onLoad: function() {
    this.setData({
      array: [wx.getStorageSync('_deviceType')]
    })
    wx.authorize({
      scope: 'scope.userLocation',
      success() {
      }
    })
    wx.authorize({
      scope: 'scope.address',
      success() {
      },
      fail() {
      }
    })
  },
  bindTelInput(e) {
    this.data.chooseAddress.telNumber = e.detail.value
  },
  bindNameInput(e) {
    this.data.chooseAddress.userName = e.detail.value
  },
  onShow: function (options) {
    let address = wx.getStorageSync('chooseAddress')
    if (address) {
      this.setData({
        chooseAddress: wx.getStorageSync('chooseAddress'),
        addressStr: address.cityName + address.countyName + address.detailInfo
      })
    }
  },
  addAddress: function () {
    wx.getSetting({
      success: (res) => {
        console.log(res)
        if (!res.authSetting['scope.userLocation'] || !res.authSetting['scope.address']) {
          wx.openSetting({
            success: (res) => {
              console.log(res.authSetting)
              res.authSetting = {
                "scope.address": true,
                "scope.userLocation": true
              }
              this.startChoose()
            }
          })
        } else {
          this.startChoose()
        }
      }
    })
  },
  startChoose: function() {
    wx.chooseAddress({
      success: (res) => {
        wx.setStorageSync('chooseAddress', res)
      },
      fail() {
        wx.openSetting({
          success(res) {
            console.log(res.authSetting)
          }
        })
      }
    })
  },
  goNext: function() {
    if (!this.data.addressStr) {
      wx.showToast({
        title: '请添加安装信息',
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
          statisfaction: '1',
          latitude: res.latitude,
          longitude: res.longitude,
          productType: app.util.getDeviceItem('type')
         
        }
        app.post(app.Apis.POST_ADDRESS, data, result => {
          wx.redirectTo({
            url: '/pages/deviceName/index',
          })
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