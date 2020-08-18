//index.js
//获取应用实例
const app = getApp()
var img = ''
var udp

Page({
  data: {
    peopleList: [],
    motto: 'Hello World',
    userInfo: {},
    ip: '',
    id: '',
    hasUserInfo: false,
    currentIndex: 0,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  selectPhoto() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log(res)
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0]

        wx.getFileSystemManager().readFile({
          filePath: tempFilePaths,
          encoding: 'hex',
          success: res => {
            console.log(res)
            img = res.data
            this.udpStart(tempFilePaths)
            //返回临时文件路径
          },
          fail: (errMsg) => {
            console.log(errMsg)
          }
        })
      }
    })
  },
  handleAddPhoto(e) {
    console.log(e)
    this.data.currentIndex = e.currentTarget.dataset.index
    this.data.id = e.currentTarget.dataset.id
    wx.showActionSheet({
      itemList: ['录入人脸', '查看员工详情', '删除'],
      success: (res) => {
        let tapIndex = res.tapIndex
        if (tapIndex === 0) {
          wx.navigateTo({
            url: `/pages/copper/index`
          })
        }
        if (tapIndex === 1) {
          let imgHead = { "func": "GetLog" }
          console.log('-----------')
          this.sendUdp(udp, imgHead)
        }
        if (tapIndex === 2) {
          let imgHead = { "func": "DeleteUserAll"}
          console.log('-----------')
          this.sendUdp(udp, imgHead)
        }
      }
    })
  },
  // ArrayBuffer转为字符串，参数为ArrayBuffer对象
  ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  },
  sendUdp(udp, test, ip) {
    udp.send({
      address: ip || this.data.ip,
      port: 6125,
      message: JSON.stringify(test)
    })
  },
  udpStart(tempFilePaths) {
    app.globalData.imgSrc = ''
    wx.showLoading({
      title: '上传中',
    })
    let test = { func: "GetIP" }
    
    let pack = 0
    
    if (img.length % 1024 !== 0) {
      pack = Math.floor(img.length / 1024) + 1
    } else {
      pack = Math.floor(img.length / 1024)
    }
    console.log('包长度~~~' + pack)

    let imgHead = { func: "StartTransfer", imgcnt: 1, width: 320, heigh: 240, type: "RGB888" }
    this.sendUdp(udp, imgHead, this.data.ip)

  },
  goAdd() {
    wx.navigateTo({
      url: `/pages/add/index`
    })
  },
  onLoad() {
  },
  onShow: function () {
    let interval = 0
    let interfunc = null
    let buffseq = ''
    let i = 0
    udp = wx.createUDPSocket()
    console.log(udp)
    udp.bind()
    let imgHead = { func: "GetIP" }
    console.log('-----------')
    this.sendUdp(udp, imgHead, '255.255.255.255')
    udp.onListening((res) => {
      console.log('监听中...')
      console.log(res)
    })
    udp.onClose((res) => {
      console.log('监听关闭事件...')
      console.log(res)
    })
    udp.onError((res) => {
      console.log('监听错误事件...')
      console.log(res)
    })
    udp.onMessage((res) => {
      if (res.message) {
        let testStr = ''
        if (app.globalData.platform === 'devtools') {
          testStr = this.ab2str(res.message.data)
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
          this.sendUdp(udp, imgHead)
        }
        if (aa.func === 'StartTransfer' && aa.status === 'ok') {
          console.log(img.length)
          let imgHead = { "func": "TransferImgHead", "imgseq": 1, "role": 0, "totalsize": img.length, "buffsize": 10240 }
          this.sendUdp(udp, imgHead)
        }
        if (aa.func === 'TransferImgHead' && aa.status === 'ok') {
          interfunc = setInterval(() => {
            interval++
            console.log(interval)
            if (interval > 3) {
              interval = 0
              let resend = { "func": "BUFReSend", "id": parseInt(buffseq) + 1 }
              console.log(resend)
              this.sendUdp(udp, resend)
            }
          }, 1000)
          udp.send({
            address: this.data.ip,
            port: 6125,
            message: img.slice(0, 1024)
          })
        }
        if (aa.func === 'GetDeviceInfo' && aa.status === 'ok') {

        }
        if (aa.func === 'BUFReSend') {
          udp.send({
            address: this.data.ip,
            port: 6125,
            message: img.slice(i * 1024, (i + 1) * 1024)
          })
        }
        if (aa.func === 'Nextpic') {
          buffseq = aa.buffseq
          i++
          interval = 0
          udp.send({
            address: this.data.ip,
            port: 6125,
            message: img.slice(i * 1024, (i + 1) * 1024)
          })
        }
        if (aa.func === 'TransferImgEnd') {
          console.log('099767896789tg=============')
          clearInterval(interfunc)
          this.data.peopleList[this.data.currentIndex].imgUrl = tempFilePaths
          wx.setStorageSync('peopleList', this.data.peopleList)
          this.setData({
            peopleList: this.data.peopleList
          })
          wx.hideLoading()
        }
        if (aa.func === 'DeleteUser' && aa.status === 'ok') {
          console.log(this.data.currentIndex)
          this.data.peopleList.splice(this.data.currentIndex, 1)
          this.setData({
            peopleList: this.data.peopleList
          })
          wx.setStorageSync('peopleList', this.data.peopleList)
        }
      }
    })
    this.setData({
      peopleList: wx.getStorageSync('peopleList') || [{
        id: 1,
        name: '张三',
        imgUrl: ''
      }, {
        id: 2,
        name: '李四',
        imgUrl: ''
      }]
    })

    const tempFilePaths = app.globalData.imgSrc
    if (tempFilePaths) {
      wx.getFileSystemManager().readFile({
        filePath: tempFilePaths,
        encoding: 'hex',
        success: res => {
          console.log(res)
          img = res.data
          this.udpStart(tempFilePaths)
          //返回临时文件路径
        },
        fail: (errMsg) => {
          console.log(errMsg)
        }
      })
    }
  }
})
