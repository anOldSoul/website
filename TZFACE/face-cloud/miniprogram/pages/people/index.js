//index.js
//获取应用实例
const app = getApp()
var img = ''

Page({
  data: {
    showBack: false,
    percent: 20,
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
  handleAddPhoto(e) {
    console.log(e)
    this.data.currentIndex = e.currentTarget.dataset.index
    wx.showActionSheet({
      itemList: ['录入人脸', '查看员工详情', '删除'],
      success: (res) => {
        let tapIndex = res.tapIndex
        if (tapIndex === 0) {
          app.globalData._id = e.currentTarget.dataset._id
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
      sn: wx.getStorageSync('sn'),
      faceid: { "$exists": true }
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
  updateFace(fileID, id) {
    wx.cloud.callFunction({
      name: 'sum',
      data: {
        docid: id,
        fileID: fileID
      }
    }).then((e) => {
      console.log(e)
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
    let that = this;
    app.watch(that.watchBack)
  },
  watchBack: function (name) {
    console.log('this.name==' + name)
    if (name === 'Enroll_Finish_ack') {
      this.onQuery()
    }
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
          this.updateFace(res.fileID, app.globalData._id)
          let msg = { "func": "postImgUrl", "sn": wx.getStorageSync('sn'), "fileid": res.fileID, wxid: app.globalData._id }
          console.log(msg)
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
        }
      })
    }
  }
})
