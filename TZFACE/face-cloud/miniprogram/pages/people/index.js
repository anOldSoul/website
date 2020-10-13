//index.js
//获取应用实例
const app = getApp()
var img = ''

Page({
  data: {
    informCount: 0,
    peopleList: [],
    userInfo: {},
    id: '',
    _id: '',
    hasUserInfo: false,
    currentIndex: 0,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  getInformCount: function () {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('waitFace').where({
      status: 1,
      sn: wx.getStorageSync('sn')
    }).get({
      success: res => {
        if (res.data.length > 0) {
          this.setData({
            informCount: res.data.length
          })
        }
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
  onShareAppMessage() {
    return {
      title: `管理员${wx.getStorageSync('nickName')}邀请您录入门禁信息`,
      imageUrl: '/images/bg2.png',
      path: `pages/newFace/index?sn=${wx.getStorageSync('sn')}`
    }
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
    this.data._id = e.currentTarget.dataset._id
    console.log(this.data.id)
    wx.showActionSheet({
      itemList: ['录入人脸', '查看员工详情', '删除'],
      success: (res) => {
        let tapIndex = res.tapIndex
        if (tapIndex === 0) {
          wx.navigateTo({
            url: `/pages/copper/index`
          })
        }
      }
    })
  },
  // ArrayBuffer转为字符串，参数为ArrayBuffer对象
  ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  },
  goAdd() {
    wx.navigateTo({
      url: `/pages/add/index`
    })
  },
  goWaitList() {
    wx.navigateTo({
      url: `/pages/waitFaces/index`
    })
  },
  onQuery: function () {
    wx.showLoading()
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('faces').where({
      sn: wx.getStorageSync('sn')
    }).get({
      success: res => {
        this.setData({
          peopleList: res.data
        })
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
    this.getInformCount()
  },
  onUnload() {
  },
  onShow: function () {
    this.onQuery()

    const tempFilePaths = app.globalData.imgSrc
    if (tempFilePaths) {
      wx.showLoading({
        title: '上传中',
      })
      const filePath = tempFilePaths
      // 上传图片
      const cloudPath = Math.random().toString(36).substr(2) + filePath.match(/\.[^.]+?$/)[0]
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: res => {
          console.log('[上传文件] 成功：', res)
          app.globalData.imgSrc = ''
          let msg = { "func": "postImgUrl", "sn": "TZFACEV320200924", "fileid": res.fileID }
          app.publishImg(msg)
        },
        fail: e => {
          console.error('[上传文件] 失败：', e)
          wx.showToast({
            icon: 'none',
            title: '上传失败',
          })
        },
        complete: () => {
          wx.hideLoading()
        }
      })
    }
  }
})
