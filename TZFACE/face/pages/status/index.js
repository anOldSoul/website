const app = getApp()
var udp
Page({
  data: {
    mac: '',
    wifi: '',
    ip: '',
    pagetype: ''
  },
  onLoad: function (options) {
    this.startUdp()
  },
  onShow: function () {
  },
  startUdp() {
    udp = wx.createUDPSocket()
    udp.bind()
    let imgHead = { func: "GetIP" }
    app.sendUdp(udp, imgHead, '255.255.255.255')
    udp.onListening((res) => {
      console.log('监听中...')
      console.log(res)
    })
    udp.onClose((res) => {
      console.log('监听关闭事件...')
      udp = wx.createUDPSocket()
    })
    udp.onError((res) => {
      console.log('监听错误事件...')
      udp = wx.createUDPSocket()
    })
    udp.onMessage((res) => {
      console.log(res)
      if (res.message) {
        let testStr = ''
        if (app.globalData.platform === 'devtools') {
          testStr = app.ab2str(res.message.data)
        } else {
          // 将 ArrayBuffer类型的res.message取出来
          let unit8Arr = new Uint8Array(res.message)
          let encodedString = String.fromCharCode.apply(null, unit8Arr)
          let decodedString = decodeURIComponent(escape((encodedString)))//没有这一步中文会乱码
          console.log('message:' + decodedString)
          testStr = decodedString
        }
        let remoteInfo = res.remoteInfo.address
        console.log(testStr)
        let aa = JSON.parse(testStr)
        if (aa.func === 'GetIP') {
          this.data.ip = remoteInfo
          let imgHead = { "func": "GetDeviceInfo", "timestamp": "202007202222" }
          app.sendUdp(udp, imgHead, this.data.ip)
        }
        if (aa.func === 'GetDeviceInfo' && aa.status === 'ok') {
          this.setData({
            ip: this.data.ip,
            mac: aa.macaddr,
            wifi: aa.SSID
          })
        }
      }
    })
  }
})