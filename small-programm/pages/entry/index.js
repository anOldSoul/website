const MD5 = require('../../utils/md5.min.js')
var app = getApp()
Page({
  data: {
    chooseIndex: 0,
    ifZoom: false,
    inputName: '',
    inputChainName: '',
    inputStoreName: '',
    telInput: '',
    cardInput: '',
    ifSend: true,
    inputCodeValue1: '',
    inputCodeValue: '',
    countDown: 0,
    inputValue: '',
    uuid: '',
    inviter: '',
    stepInviteeUserId: '',
    inviteType: ''
  },
  getImgCode: function() {
    wx.showLoading({
      title: '加载中',
    })
    this.data.uuid = MD5(Math.random())
    let data = {
      uuId: this.data.uuid,
      height: 60,
      width: 140
    }
    app.post(app.Apis.GET_VERIFYIMG, data, result => {
      if (result.success) {
        this.setData({
          codeImg: result.data
        })
        wx.hideLoading()
      }
    })
  },
  bindCodeInput: function(e) {
    let value = e.detail.value
    this.setData({
      inputCodeValue: value
    })
  },
  bindCodeInput1: function(e) {
    let value = e.detail.value
    this.setData({
      inputCodeValue1: value
    })
  },
  bindSendCode: function() {
    var self = this
    if (this.data.countDown !== 0) {
      return
    } else if (!this.data.inputValue || !this.data.inputValue.match(/^1\d{10}$/)) {
      this.show('请输入手机号码！')
      return
    } else if (!this.data.inputCodeValue) {
      this.show('请输入图形验证码！')
      return
    }
    let data = {
      verifyCodeId: MD5(app.globalData.vCode + this.data.uuid + 'web' + 'web'),
      verifyCode: this.data.inputCodeValue,
      userName: this.data.inputValue,
      captchaType: 'WECHAT_LOGIN'
    }
    app.post(app.Apis.SEND_MESSAGE, data, result => {
      if (result.success) {
        this.show('验证码已发送，请注意查收！')
        var tempInterval
        var countNum = 60
        this.setData({
          ifSend: false
        })
        self.data.countDown = countNum
        tempInterval = setInterval(function() {
          if (countNum === 0) {
            clearInterval(tempInterval)
            countNum = 60
            return
          }
          countNum -= 1
          self.setData({
            countDown: countNum
          })
        }, 1000)
      } else {
        this.show('图形验证码错误，请重新输入！')
      }
    })
  },
  onLoad: function(options) {
    console.log(options)
    new app.ToastPannel()
    wx.getSystemInfo({
      success: (res) => {
        if (res.model == 'M2 E') {
          this.setData({
            ifZoom: true
          })
        }
      }
    })
    if (options.inviter && options.inviter != 'undefined') {
      this.data.inviter = options.inviter
    }
    if (options.inviteType && options.inviteType != 'undefined') {
      this.data.inviteType = options.inviteType
      this.data.stepInviteeUserId = options.inviterUserId
    }
    let storeId = wx.getStorageSync('YJF_STORE_ID') || app.globalData.storeId
    this.data.mainStoreId = options.mainStoreId || storeId || app.globalData.storeId
    this.data.storeId = storeId
    this.getImgCode()
    this.getBanner()
  },
  getUserAccount: function () {
    wx.login({
      success: (res) => {
        let data = {
          code: res.code,
          wechatId: app.globalData.wechatId,
          mainStoreId: wx.getStorageSync('YJF_STORE_ID'),
          userName: this.data.inputValue
        }
        app.post(app.Apis.POST_WECHAT_USER_ACCOUNT, data, result => {
          if (result.success && result.error === 200) {
            wx.setStorageSync('YJF_UERID', result.data.userId)
            wx.setStorageSync('TMM_OPENID', result.data.openId)
            wx.setStorageSync('PHONENUMBER', this.data.inputValue)
            if (this.data.inviter) {
              this.getInviteRel(this.data.inviter, result.data.userId)
            }
            if (result.data.isNewUser) {
              wx.setStorageSync('isNewUser', 1)
              if (this.data.inviteType === 'step') {
                this.postInviteStep()
              }
            }
            if (result.data.mainStoreId) {
              wx.setStorageSync('YJF_STORE_ID', result.data.mainStoreId)
            } else {
              wx.setStorageSync('YJF_STORE_ID', app.globalData.storeId)
            }
            wx.setStorageSync('YJF_LOGIN_STATUS', 1)
            wx.switchTab({
              url: '/pages/shopping/index'
            })
          }
        })
      },
      fail: function (err) {
        console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
      }
    })
  },
  postInviteStep: function () {
    let data = {
      inviterUserId: this.data.stepInviteeUserId,
      inviteeUserId: wx.getStorageSync('YJF_UERID'),
      storeId: wx.getStorageSync('YJF_STORE_ID'),
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
  getInviteRel: function (inviterUserId, userId) {
    let data = {
      inviterUserId: inviterUserId,
      inviteeUserId: userId,
      storeId: this.data.mainStoreId
    }
    app.post(app.Apis.POST_INVITEE_REL, data, result => {
      if (result.success) {
        console.log('关联成功')
      }
    })
  },
  getBanner: function() {
    let data = {
      storeId: wx.getStorageSync('YJF_STORE_ID')
    }
    app.post(app.Apis.GET_BANNER, data, result => {
      if (result.success) {       
        this.setData({
          bannerImg: result.data.bannerName[0]
        })
      }
    })
  },
  bindNameInput: function(e) {
    this.data.inputName = e.detail.value
  },
  bindStoreNameInput: function(e) {
    this.data.inputStoreName = e.detail.value
  },
  bindCardInput: function(e) {
    this.data.cardInput = e.detail.value
  },
  bindTelInput: function(e) {
    this.data.telInput = e.detail.value
  },
  goCardMiniProgram() {
    wx.navigateToMiniProgram({
      appId: 'wx955dcd947cb51da0',
      path: '/pages/entry/index',
      envVersion: 'trial', // develop---trial
      extraData: {
        'ms': this.data.mainStoreId,
        'memberApplyFromType': 'POINT_XCX'
      },
      success: function () { },
      fail: function () { },
      complete: function () { }
    })
  },
  bindCheckAccount: function() {
    if (this.data.inputValue == '18686125452') {
      this.getUserAccount()
    } else {
      if (this.data.inputValue && this.data.inputCodeValue && this.data.inputCodeValue1) {
        wx.showLoading({
          title: '加载中',
        })
        let data = {
          userName: this.data.inputValue,
          captchaType: 'WECHAT_LOGIN',
          captcha: this.data.inputCodeValue1
        }
        app.post(app.Apis.CAPTCHA_CHECK, data, result => {
          if (result.success && result.data) {
            this.getUserAccount()
          } else {
            this.show('验证码不正确，请重新输入！')
          }
        })
      }
    }
  },
  bindKeyInput: function(e) {
    let value = e.detail.value
    this.data.inputValue = value
    this.setData({
      inputValue: value
    })
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  }
})