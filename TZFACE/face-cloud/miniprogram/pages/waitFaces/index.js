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
    _id: '',
    notEmpty: false,
    empty: false,
    hasUserInfo: false,
    currentIndex: 0,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onShareAppMessage() {
    return {
      title: `${wx.getStorageSync('nickName')}邀请您录入门禁信息`,
      imageUrl: '/images/bg2.png',
      path: 'pages/newFace/index'
    }
  },
  handleCheck(e) {
    this.data.currentIndex = e.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: `确定要通过${this.data.peopleList[this.data.currentIndex].name}的录入信息吗`,
      confirmText: '通过',
      confirmColor: '#012573',
      success: (res) => {
        if (res.confirm) {
          console.log('用户点击确定')
          this.onAdd(this.data.peopleList[this.data.currentIndex])
        } else if (res.cancel) {
          console.log('用户点击取消')
          wx.cloud.callFunction({
            name: 'updateStatus',
            data: {
              docid: this.data.peopleList[this.data.currentIndex]._id,
              status: 3
            }
          }).then((e) => {
            this.onQuery()
          })
        }
      }
    })
  },
  // ArrayBuffer转为字符串，参数为ArrayBuffer对象
  ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  },
  sendUdp(udp, test, ip) {
    console.log(test)
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
  onAdd: function (item) {
    const tempFilePaths = item.fileID
    if (tempFilePaths) {
      let interval = 0
      let interfunc = null
      let buffseq = ''
      let i = 0
      udp = wx.createUDPSocket()
      udp.bind()
      let imgHead = { func: "GetIP" }
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
        udp.close()
        console.log('监听错误事件...')
        console.log(res)
        clearInterval(interfunc)
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
            wx.getFileSystemManager().readFile({
              filePath: tempFilePaths,
              encoding: 'hex',
              success: res => {
                console.log(res)
                img = res.data
                this.udpStart(item.fileID)
                //返回临时文件路径
              },
              fail: (errMsg) => {
                console.log(errMsg)
              }
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
            if (aa.id === 65535) {
              console.log('65535==========')
              wx.showToast({
                icon: 'none',
                title: '上传失败，请重试',
              })
            } else {
              wx.showLoading({
                title: '',
              })
              let item = this.data.peopleList[this.data.currentIndex]
              const db = wx.cloud.database()
              db.collection('faces').add({
                data: {
                  name: item.name,
                  sn: wx.getStorageSync('sn'),
                  telephone: item.telephone,
                  fileID: item.fileID
                },
                success: res => {
                  wx.cloud.callFunction({
                    name: 'updateStatus',
                    data: {
                      docid: item._id,
                      status: 2
                    }
                  }).then((e) => {
                    wx.hideLoading()
                    wx.showToast({
                      title: '已通过',
                    })
                    this.onQuery()
                  })
                },
                fail: err => {
                  wx.showToast({
                    icon: 'none',
                    title: '新增记录失败'
                  })
                  console.error('[数据库] [新增记录] 失败：', err)
                }
              })
            }
          }
          if (aa.func === 'DeleteUser' && aa.status === 'ok') {
            this.deleteFace()
          }
          if (aa.func === 'DeleteUserAll' && aa.status === 'ok') {
            this.deleteFace()
          }
        }
      })
    }
  },
  goAdd() {
    wx.navigateTo({
      url: `/pages/add/index`
    })
  },
  onQuery: function () {
    wx.showLoading()
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('waitFace').where({
      status: 1,
      sn: wx.getStorageSync('sn')
    }).get({
      success: res => {
        if (res.data.length > 0) {
          this.setData({
            peopleList: res.data,
            notEmpty: true,
            empty: false
          })
        } else {
          this.setData({
            peopleList: res.data,
            notEmpty: false,
            empty: true
          })
        }
        wx.hideLoading()
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  update(url, fileID, id) {
    wx.cloud.callFunction({
      name: 'sum',
      data: {
        docid: this.data._id,
        imgId: id,
        imgUrl: url,
        fileID: fileID
      }
    }).then((e) => {
      console.log(e)
      this.onQuery()
    })
  },
  handleDel() {
    wx.showModal({
      title: '提示',
      content: '确定要删除全部人脸吗',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          let imgHead = { "func": "DeleteUserAll" }
          this.sendUdp(udp, imgHead)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  deleteFace() {
    wx.cloud.callFunction({
      name: 'deleteFace',
      data: {
        docid: this.data._id
      }
    }).then((e) => {
      console.log(e)
      this.onQuery()
    })
  },
  onLoad() {
  },
  onUnload() {
    console.log(udp)
    if (udp) {
      udp.close()
    }
  },
  onShow: function () {
    this.onQuery()
  }
})
