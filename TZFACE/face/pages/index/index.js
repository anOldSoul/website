//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  selectPhoto() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
      }
    })
  },
  // ArrayBuffer转为字符串，参数为ArrayBuffer对象
  ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  },
  onLoad: function () {
    const udp = wx.createUDPSocket()
    let test = { func: "StartTransfer", imgcnt: 1, width: 320, heigh: 240, type: "RGB888" }
    udp.bind()
    udp.onListening(function (res) {
      console.log('监听中...')
      console.log(res)
    })
    udp.onMessage((res) => {
      console.log(res)
      if (res.message) {
        console.log('============')
        let testStr = this.ab2str(res.message.data)
        console.log(testStr)
        var resultStr = testStr.replace(/\s/g, "");
        resultStr = testStr.replace(/[\r\n]/g, "")
        let test1 = `${resultStr}`
        console.log(Object(test1))
        console.log(JSON.parse(test1))
      }
    })
    udp.send({
      address: '192.168.1.109',
      port: 6125,
      message: JSON.stringify(test)
    })
  }
})
