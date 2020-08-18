//app.js
App({
  onShow: function () {
    wx.getNetworkType({
      success: (res) => {
        console.log(res)
        this.globalData.networkType = res.networkType
      }
    })
    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
        this.globalData.platform = res.platform
      }
    })
    wx.onNetworkStatusChange(function (res) {
      this.globalData.networkType = res.networkType
      console.log(res.isConnected)
      console.log(res.networkType)
    })
  },
  sendUdp(udp, test, ip = '') {
    udp.send({
      address: ip,
      port: 6125,
      message: JSON.stringify(test)
    })
  },
  ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  },
  globalData: {
    networkType: '',
    platform: '',
    userInfo: null
  }
})