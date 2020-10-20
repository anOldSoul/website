const Moment = require('./utils/moment.min.js')
var MQTT = require("./utils/paho-mqtt.js");
var client = new MQTT.Client("wss://tzface.openn.cn:8091/mqtt", "clientId_" + Math.random().toString(36).substr(2));
App({
  Moment: Moment,
  onHide() {},
  onLaunch: function () {
    this.connectMq()
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }
  },
  onShow: function () {
    
  },
  watch: function (method) {
    var obj = this.sockData;
    Object.defineProperty(obj, "data", {
      configurable: true,
      enumerable: true,
      set: function (value) {
        //console.log("监听数据已修改");
        this._data = value;
        method(value);
      },
      get: function () {
        // 可以在这里打印一些东西，然后在其他界面调用getApp().globalData.name的时候，这里就会执行。
        return this._data;
      }
    })
  },
  connectMq: function () {
    //在按钮上显示加载标志
    wx.showLoading({
      title: '',
    })
    
    var that = this;
    //connect to  MQTT broker
    var connectOptions = {
      timeout: 10,
      useSSL: true,
      cleanSession: true,
      keepAliveInterval: 30,
      reconnect: true,
      onSuccess: () => {
        console.log('connected');

        this.globalData.mqtt_client = client;

        client.onMessageArrived = (msg) => {
          console.log(msg.payloadString)
          let str = msg.payloadString
          str = str.replace(/\s*/g, '');
          str = str.replace(/[\r\n]/g, "")
          let data = JSON.parse(str)
          if (data.func === 'GetDeviceInfo_ack') {
            const db = wx.cloud.database()
            db.collection('devices').where({
              userid: wx.getStorageSync('TZFACE-userid')
            }).get({
              success: res => {
                let devices = res.data
                let exist = devices.filter((item) => {
                  return item.sn === data.sn
                })
                if (exist.length > 0) {
                  wx.cloud.callFunction({
                    name: 'updateDevice',
                    data: {
                      sn: data.sn,
                      userid: wx.getStorageSync('TZFACE-userid')
                    }
                  }).then((e) => {
                    wx.hideLoading()
                    this.sockData.data = data.sn
                  })              
                } else {
                  wx.cloud.callFunction({
                    name: 'devices',
                    data: {
                      sn: data.sn,
                      model: 'Biosec_lateral',
                      userid: wx.getStorageSync('TZFACE-userid')
                    },
                    success: res => {
                      data['sn'] = data.sn
                      wx.cloud.callFunction({
                        name: 'address',
                        data: data,
                        success: res => { 
                          wx.switchTab({
                            url: `/pages/device/index`,
                            success(res) {
                              wx.showToast({
                                title: '添加成功',
                                icon: 'none',
                                duration: 2000
                              })
                            }
                          })
                        },
                        fail: err => {
                          console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
                        }
                      })
                    },
                    fail: err => {
                      console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
                    }
                  })
                }
              },
              fail: err => {
                wx.showToast({
                  icon: 'none',
                  title: '查询设备记录失败'
                })
                console.error('[数据库] [查询记录] 失败：', err)
              }
            })
          }
          if (data.func === 'enroll_callback') {
            this.sockData.data = JSON.stringify(data)
          }
          if (data.func === 'Enroll_Finish_ack') {
            if (this.globalData.postImgType === 'visitor') {
              wx.cloud.callFunction({
                name: 'updateVisitor',
                data: {
                  docid: data.wxid,
                  faceid: data.faceid,
                  status: 0
                }
              }).then((e) => {
                console.log(e)
                this.sockData.data = 'visitor_finish_ack'
              })
              
            } else {
              wx.cloud.callFunction({
                name: 'sum',
                data: {
                  docid: data.wxid,
                  faceid: data.faceid
                }
              }).then((e) => {
                console.log(e)
                this.sockData.data = data.func
              })
            }
          }
        }
        this.subscribe()
      },
      onFailure: (option) => {
        console.log(option);
        //去除按钮上的加载标志
        wx.hideLoading()
        wx.showModal({
          //title: msg.destinationName,
          content: option.errorMessage
        });
      }
    }

    client.connect(connectOptions);

  },
  subscribe: function () {
    if (this.globalData.mqtt_client && this.globalData.mqtt_client.isConnected()) {
      this.globalData.mqtt_client.subscribe(this.globalData.subscribe_topic, {
        qos: 1,
        onSuccess: () => {
          console.log('subscribe success');
          this.sockData.data = 'mqttconnected'
          // wx.hideLoading()
          // this.publish()
        },
        onFailure: function () {
          wx.showToast({
            title: 'Failure',
            icon: 'loading',
            duration: 2000
          });
        },
      });
    }
  },
  publishImg: function (msg) {
    console.log(this.globalData)
    if (this.globalData.mqtt_client && this.globalData.mqtt_client.isConnected()) {
      this.globalData.mqtt_client.publish(this.globalData.pub_img_topic,
        JSON.stringify(msg),
        1,
        false
      )
    } else {
      wx.showToast({
        title: 'client invalid',
        icon: "loading",
        duration: 2000
      })
    }
  },
  publish: function (msg) {
    console.log(this.globalData)
    if (this.globalData.mqtt_client && this.globalData.mqtt_client.isConnected()) {
      this.globalData.mqtt_client.publish(this.globalData.pub_topic,
        JSON.stringify(msg),
        1,
        false
      )
      // wx.showToast({
      //   title: 'publish success',
      //   icon: "success",
      //   duration: 2000
      // })
    } else {
      wx.showToast({
        title: 'client invalid',
        icon: "loading",
        duration: 2000
      })
    }
  },
  sockData: {
    _data: null,
    data: null,
  },
  globalData: {
    postImgType: '',
    subscribe_topic: 'tzfacev3/wx',
    pub_topic: 'tzfacev3/device',
    pub_img_topic: 'tzfacev3/robot',
    mqtt_client: '',
    myInfo: {
      TelPhone: ''
    },
    imgSrc: '',
    networkType: '',
    wifissid: '',
    wifiBssid: '',
    platform: '',
    userInfo: null
  }
})