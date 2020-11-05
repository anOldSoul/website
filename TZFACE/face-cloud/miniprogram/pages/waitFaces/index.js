//index.js
//获取应用实例
const app = getApp()
var img = ''

Page({
  data: {
    showBack: true,
    peopleList: [],
    id: '',
    _id: '',
    notEmpty: false,
    empty: false,
    percent: 0,
    currentIndex: 0
  },
  watchBack: function (name) {
    console.log('this.name==' + name)
    if (name === 'Enroll_Finish_ack') {
      wx.cloud.callFunction({
        name: 'updateStatus',
        data: {
          docid: this.data.peopleList[this.data.currentIndex]._id,
          status: 2
        }
      }).then((e) => {
        this.setData({
          showBack: true
        })
        this.onQuery()
      })
    } else if (name === 'finish_timeout') {
      this.setData({
        showBack: true
      })
      wx.showToast({
        icon: 'none',
        title: '上传失败，请重新录入',
      })
    } else if (name && name !== 'undefined') {
      let result = JSON.parse(name)
      wx.hideLoading()
      if (result.func === 'enroll_callback') {
        let percent = (Math.round(result.get / result.total * 100))
        console.log(percent)
        this.setData({
          showBack: false,
          percent: percent
        })
      }
    }
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
      content: `确定要通过并录入${this.data.peopleList[this.data.currentIndex].name}的信息吗`,
      confirmText: '通过',
      confirmColor: '#012573',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading()
          console.log('用户点击确定')
          this.handleAdd()
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
  goAdd() {
    wx.navigateTo({
      url: `/pages/add/index`
    })
  },
  handleAdd: function () {
    const db = wx.cloud.database()
    db.collection('faces').add({
      data: {
        name: this.data.peopleList[this.data.currentIndex].name,
        openid: this.data.peopleList[this.data.currentIndex].openid,
        fileID: this.data.peopleList[this.data.currentIndex].fileID,
        appid: this.data.peopleList[this.data.currentIndex].appid,
        sn: wx.getStorageSync('sn'),
        status: 2,
        telephone: this.data.peopleList[this.data.currentIndex].telephone
      },
      success: res => {
        this.onAdd(this.data.peopleList[this.data.currentIndex], res._id)
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  onAdd: function (item, wxid) {
    const fileID = item.fileID
    if (fileID) {
      let msg = { "func": "postImgUrl", "sn": wx.getStorageSync('sn'), "fileid": fileID, wxid: wxid, userid: wx.getStorageSync('TZFACE-userid') }
      console.log(msg)
      app.publishImg(msg)
    }
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
    let that = this;
    app.watch(that.watchBack)
  },
  onShow: function () {
    this.onQuery()
  }
})
