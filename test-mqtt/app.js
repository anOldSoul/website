//app.js
var MQTT = require('./utils/paho-mqtt.js') //根据自己存放的路径修改
App({
  onLaunch: function () {
    console.log('33333333333')
    this.connectMq()
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onLoad() {
    console.log('2222222')
    this.connectMq()
  },
  connectMq() {
    console.log('111111')
    // 连接选项
    const options = {
      connectTimeout: 4000, // 超时时间
      // 认证信息 按自己需求填写
      clientId: '',
      username: 'xxx',
      password: 'xxx',
    }
    let phone = this.globalData.myInfo.TelPhone;
    const client = new MQTT.Client('wss://tzface.openn.cn', 8083, '')
    client.connect(options)
    client.on('reconnect', (error) => {
      console.log('正在重连:', error)
    })
    client.on('error', (error) => {
      console.log('连接失败:', error)
    })
    client.on('connect', (e) => {
      console.log('成功连接服务器111')
      //订阅一个主题
      client.subscribe('phone_' + phone, { qos: 0 }, function (err) {
        if (!err) {
          //client.publish('123', 'Hello mqtt')
          console.log("订阅成功")
        }
      })
    })
    //监听mq的返回
    client.on('message', function (topic, message, packet) {
      // message is Buffer
      console.log("packet", packet.payload.toString())
      client.end()
    })
  },
  globalData: {
    myInfo: {
      TelPhone: ''
    },
    userInfo: null
  }
})