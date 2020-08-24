const Moment = require('./utils/moment.min.js')
App({
  Moment: Moment,
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }
  },
  onShow: function () {
    wx.getNetworkType({
      success: (res) => {
        console.log(res)
        this.globalData.networkType = res.networkType
        if (res.networkType === 'wifi') {
          console.log('=========')
          wx.getConnectedWifi({
            success: (e) => {
              console.log(e.wifi, 'wifi获取成功')
              this.globalData.wifissid = e.wifi.SSID,
              this.globalData.wifiBssid = e.wifi.BSSID
            },
            fail: function (e) {
              console.log(e, 'wifi获取失败')
            }
          })
        }
      }
    })
    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
        this.globalData.platform = res.platform
      }
    })
    wx.onNetworkStatusChange((res) => {
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
    imgSrc: '',
    networkType: '',
    wifissid: '',
    wifiBssid: '',
    platform: '',
    userInfo: null
  }
})