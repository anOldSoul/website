var dateTimePicker = require('../../utils/dateTimePicker.js')
const app = getApp()
var isInit1 = true
var isInit2 = true
Page({
  data: {
    percent: 0,
    showBack: true,
    fileID: '',
    isShare: false,
    deviceList: [],
    publishList: [],
    publishIndex: 0,
    name: '',
    nickName: ''
  },
  onLoad: function (options) {
    this.setData({
      nickName: options.nickName,
      fileID: options.fileID
    })
    this.getList()
  },
  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)

    const deviceList = this.data.deviceList
    const values = e.detail.value
    for (let i = 0, lenI = deviceList.length; i < lenI; ++i) {
      deviceList[i].checked = false
      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (deviceList[i].sn === values[j]) {
          deviceList[i].checked = true
          break
        }
      }
    }
    this.setData({
      deviceList
    })
  },
  getList() {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('devices').where({
      userid: wx.getStorageSync('TZFACE-userid')
    }).get({
      success: res => {
        this.setData({
          deviceList: res.data
        })
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
  bindTelInput: function(e) {
    this.data.name = e.detail.value
  },
  changeDateTime1(e) {
    this.setData({
      dateTime1: e.detail.value
    });
  },
  changeDateTime2(e) {
    this.setData({
      dateTime2: e.detail.value
    });
  },
  changeDateTimeColumn2(e) {
    isInit2 = false
    var arr = this.data.dateTime2, dateArr = this.data.dateTimeArray2;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({
      dateTimeArray2: dateArr,
      dateTime2: arr
    });
  },
  changeDateTimeColumn1(e) {
    isInit1 = false
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  },
  bindPickerValidChange: function (e) {
    this.setData({
      validIndex: e.detail.value
    })
  },
  onShareAppMessage: function (res) {
    console.log(wx.getStorageSync('currentKeyId'))
    return {
      title: '芝麻开门！',
      path: `/pages/createTemp/index?tempPw=${this.data.tempPw}&keyId=${wx.getStorageSync('currentKeyId')}`
    }
  },
  bindKeyInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  watchBack: function (name) {
    console.log('this.name==' + name)   
    if (name === 'visitor_finish_ack') {
      if ((this.data.publishIndex + 1) < this.data.publishList.length) {
        this.data.publishIndex ++
        this.setData({
          publishIndex: this.data.publishIndex,
          percent: 0
        })
        this.postVistor()
      } else {
        wx.navigateBack({
          delta: 1,
          success: () => {
            wx.showLoading({
              title: '录入成功',
            })
          }
        })
      }
    } else if (name === 'finish_timeout') {
      this.setData({
        showBack: true
      })
      wx.showModal({
        title: '提示',
        content: `设备${this.data.publishList[this.data.publishIndex]}上传失败，请重新录入`,
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else if (name && name !== 'undefined') {
      let result = JSON.parse(name)
      wx.hideLoading({
        fail: () => { }
      })
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
  handleAddPhoto(e) {
    console.log(e)
    wx.navigateTo({
      url: `/pages/copper/index`
    })
  },
  goNext: function() {
    if (!this.data.name) {
      wx.showToast({
        icon: 'none',
        title: '请输入访客姓名'
      })
      return
    }
    if (!this.data.fileID) {
      wx.showToast({
        icon: 'none',
        title: '请录入人脸照片'
      })
      return
    }
    let filterList = this.data.deviceList.filter((item, index) => {
      return item.checked
    })
    this.data.publishList = filterList.map((item, index) => {
      return item.sn
    })
    if (this.data.publishList.length === 0) {
      wx.showToast({
        icon: 'none',
        title: '请选择授权设备'
      })
      return
    }
    wx.showLoading({
      title: '请稍后'
    })
    this.postVistor()
  },
  postVistor() {
    this.data.publishList.forEach((item, index) => {
      const db = wx.cloud.database()
      db.collection('faces').add({
        data: {
          name: this.data.nickName,
          sn: item,
          status: 1
        },
        success: res => {
          console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
          let msg = { "func": "postImgUrl", "sn": wx.getStorageSync('sn'), "fileid": res.fileID, wxid: app.globalData._id, userid: wx.getStorageSync('TZFACE-userid') }
          console.log(msg)
          app.publishImg(msg)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增记录失败'
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
    })
  },
  onShow: function () {
    this.data.initTime = app.Moment().format('YYYYMMDDHHmm')
    const tempFilePaths = app.globalData.imgSrc
    if (tempFilePaths) {
      wx.showLoading({
        title: '上传中',
      })
      const filePath = tempFilePaths
      // 上传图片
      const cloudPath = wx.getStorageSync('TZFACE-userid') + app.Moment().format('YYYYMMDDHHmm') + filePath.match(/\.[^.]+?$/)[0]
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: res => {
          app.globalData.imgSrc = ''
          this.setData({
            fileID: res.fileID
          })
          console.log('[上传文件] 成功：', res)
        },
        fail: e => {
          console.error('[上传文件] 失败：', e)
          wx.showToast({
            icon: 'none',
            title: '上传失败',
          })
        },
        complete: () => {
          wx.hideLoading({
            fail: () => { }
          })
        }
      })
    }
    let that = this;
    app.watch(that.watchBack)
  }
})