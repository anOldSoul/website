//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    isAgree: true,
    ifZoom: false,
    inputName: '',
    telInput: '',
    ifFind: false,
    ifShowBac: true,
    code: '',
    phoneNumber: '',
    mainStoreId: '',
    storeId: '',
    content: {},
    stepInviteeUserId: ''
  },
  getScene: function(id) {
    let data = {
      id: id
    }
    app.post(app.Apis.GET_QR_SCENE, data, result => {
      if (result.success) {
        this.data.content = JSON.parse(result.data.content)
        this.data.mainStoreId = this.data.content.mainStoreId || app.globalData.storeId
        this.data.storeId = this.data.content.mainStoreId || app.globalData.storeId
        wx.setStorageSync('YJF_STORE_ID', this.data.mainStoreId)
        this.checkStoreIsOpen()
      }
    })
  },
  onLoad: function (options) {
    wx.login({
      success: (res) => {
        this.setData({
          code: res.code
        })
        if (options.inviteType) {
          this.data.inviteType = options.inviteType
          this.data.stepInviteeUserId = options.inviterUserId
        }
        if (options.scene) {
          var scene = decodeURIComponent(options.scene)
          this.data.scene = scene
          this.getScene(scene)
        } else {
          let storeId = wx.getStorageSync('YJF_STORE_ID') || app.globalData.storeId
          this.data.mainStoreId = options.mainStoreId || storeId || app.globalData.storeId
          this.data.storeId = storeId
          wx.setStorageSync('YJF_STORE_ID', this.data.mainStoreId)
          this.checkStoreIsOpen()
        }
        wx.getSystemInfo({
          success: (res) => {
            if (res.model == 'M2 E') {
              this.setData({
                ifZoom: true
              })
            }
          }
        })
        new app.ToastPannel()
      },
      fail: function (err) {
        console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
      }
    })
  },
  checkStoreIsOpen() {
    this.getBanner(this.data.mainStoreId)
    let data = {
      groupId: 'XCX_ONLINE_MALL',
      belongToId: this.data.mainStoreId
    }
    app.post(app.Apis.GET_CONFIGS, data, result => {
      if (result.success) {
        let item = result.dataList.filter(item => item.key === 'OPEN_XCX_ONLINE_MALL')
        if (item[0].value === 'true') {
          this.checkUserLoginStatus()
          // this.login()
        } else {
          wx.showModal({
            title: '提示',
            content: '商城升级中，给您带来的不便敬请谅解，如需帮助您可联系药房工作人员。',
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
                // 关闭小程序
                wx.navigateBack({
                  delta: 0
                })
              }
            }
          })
        }
      }
    })
  },
  // 检查是否登录平台
  checkUserLoginStatus: function () {
    let LOGIN_STATUS = wx.getStorageSync('YJF_LOGIN_STATUS') || false
    if (LOGIN_STATUS) {
      this.userLogin()
    }
  },
  goAgree: function() {
    wx.navigateTo({
      url: '../consent/index'
    })
  },
  userLogin: function () {
    wx.switchTab({
      url: `../shopping/index`
    })
  },
  loginByPhone: function() {
    if(!this.data.isAgree) {
      this.show('请阅读并同意用户知情同意书！')
    } else {
      wx.navigateTo({
        url: `../entry/index?mainStoreId=${this.data.mainStoreId}&inviter=${this.data.content.userId}&inviteType=${this.data.inviteType}&inviterUserId=${this.data.stepInviteeUserId}`
      })
    }
  },
  alertAgree: function() {
    this.show('请阅读并同意用户知情同意书！')
  },
  checkboxChange: function(e) {
    this.setData({
      isAgree: !this.data.isAgree
    })
  },
  getPhoneNumber: function (e) {
    if (e.detail.encryptedData && e.detail.iv) {
      this.getUserPhonenum(e.detail.encryptedData, e.detail.iv)
    } else {
      wx.navigateTo({
        url: `../entry/index?mainStoreId=${this.data.mainStoreId}&inviter=${this.data.content.userId || ''}`
      })
    }
  },
  getUserPhonenum: function (encryptedData, iv) {
    if (this.data.code && this.data.mainStoreId) {
      let data = {
        code: this.data.code,
        encryptedData: encryptedData,
        iv: iv,
        wechatId: app.globalData.wechatId,
        mainStoreId: this.data.mainStoreId
      }
      app.post(app.Apis.POST_WECHAT_INFO, data, result => {
        if (result.success && result.data.userName) {
          let phoneNumber = result.data.userName
          wx.setStorageSync('TMM_OPENID', result.data.openId)
          app.globalData.openid = result.data.openId
          app.globalData.unionId = result.data.unionId
          wx.setStorageSync('YJF_UERID', result.data.userId)
          wx.setStorageSync('PHONENUMBER', phoneNumber)
          if (result.data.isNewUser) {
            wx.setStorageSync('isNewUser', 1)
            if (this.data.inviteType === 'step') {
              this.postInviteStep()
            }
          }
          if (this.data.scene) {
            this.getInviteRel(this.data.content.userId)
          }
          wx.setStorageSync('YJF_LOGIN_STATUS', 1)
          this.setData({
            phoneNumber: phoneNumber
          })
          let page = getCurrentPages()
          if (page.length > 1) {
            wx.navigateBack({
              delta: 1
            })
          } else {
            wx.switchTab({
              url: '/pages/shopping/index'
            })
          }
        } else {
          wx.navigateTo({
            url: `../entry/index?mainStoreId=${this.data.mainStoreId}&inviter=${this.data.content.userId || ''}`
          })
        }
        wx.login({
          success: (res) => {
            this.data.code = res.code
          },
          fail: function (err) {
            console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          }
        })
      })
    } else {
      wx.login({
        success: (res) => {
          this.data.code = res.code
        },
        fail: function (err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
        }
      })
    }
  },
  postInviteStep: function () {
    let data = {
      inviterUserId: this.data.stepInviteeUserId,
      inviteeUserId: wx.getStorageSync('YJF_UERID'),
      storeId: this.data.mainStoreId,
      isNewUser: 1
    }
    app.post(app.Apis.POST_INVITE_STEP, data, result => {
      if (result.success) {
        console.log(result)
        console.log('==============')
        console.log('关联成功')
      }
    })
  },
  getInviteRel: function(inviterUserId) {
    let data = {
      inviterUserId: inviterUserId,
      inviteeUserId: wx.getStorageSync('YJF_UERID'),
      storeId: this.data.mainStoreId
    }
    app.post(app.Apis.POST_INVITEE_REL, data, result => {
      if (result.success) {
        console.log('关联成功')
      }
    })
  },
  getBanner: function(storeId) {
    let data = {
      storeId: storeId
    }
    app.post(app.Apis.GET_BANNER, data, result => {
      if (result.success) {       
        this.setData({
          bannerImg: result.data.bannerName[0]
        })
      }
    })
  }
})
