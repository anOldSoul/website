//index.js
//获取应用实例
const app = getApp()
var img = ''
var udp
// img = img.slice(0, 2048)

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
      sizeType: ['original', 'compressed'],
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
          this.selectPhoto()
        }
        if (tapIndex === 2) {
          let test = { func: "GetIP" }
          // let test = { func: "DeleteUser", id: this.data.id }
          this.sendUdp(udp, test, '192.168.1.255')
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
    wx.showLoading({
      title: '上传中',
    })
    let test = { func: "GetIP" }
    let i = 0
    let pack = 0
    let buffseq = ''
    if (img.length % 1024 !== 0) {
      pack = Math.floor(img.length / 1024) + 1
    } else {
      pack = Math.floor(img.length / 1024)
    }
    console.log('包长度~~~' + pack)
    let interval = 0
    let interfunc = null


    this.sendUdp(udp, test, '255.255.255.255')
    udp.onMessage((res) => {
      if (res.message) {
        let testStr = this.ab2str(res.message.data)
        let remoteInfo = res.remoteInfo.address
        console.log(testStr)
        console.log(res.message)
        let aa = JSON.parse(testStr)
        if (aa.func === 'GetIP') {
          let imgHead = { func: "StartTransfer", imgcnt: 1, width: 320, heigh: 240, type: "RGB888" }
          this.data.ip = remoteInfo
          this.sendUdp(udp, imgHead, this.data.ip)
        }
        if (aa.func === 'StartTransfer' && aa.status === 'ok') {
          console.log(img.length)
          let imgHead = { "func": "TransferImgHead", "imgseq": 1, "role": 0, "totalsize": img.length, "buffsize": 10240 }
          this.sendUdp(udp, imgHead)
        }
        if (aa.func === 'TransferImgHead' && aa.status === 'ok') {
          let imgHead = { "func": "GetDeviceInfo", "timestamp": "202007202222" }
          this.sendUdp(udp, imgHead)
        }
        if (aa.func === 'GetDeviceInfo' && aa.status === 'ok') {
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
          this.setData({
            peopleList: this.data.peopleList.slice(this.data.currentIndex)
          })
          wx.setStorageSync('peopleList', this.data.peopleList)
        }
      }
    })
  },
  goAdd() {
    wx.navigateTo({
      url: `/pages/add/index`
    })
  },
  onShow: function () {
    udp = wx.createUDPSocket()
    udp.bind()
    console.log('===========')
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
  }
})
