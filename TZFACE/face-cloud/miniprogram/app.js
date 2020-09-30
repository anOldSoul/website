const Moment = require('./utils/moment.min.js')
var MQTT = require("./utils/paho-mqtt.js");
App({
  Moment: Moment,
  onHide() {},
  onLaunch: function () {
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
    this.connectMq()
    wx.getNetworkType({
      success: (res) => {
        this.globalData.networkType = res.networkType
        if (res.networkType === 'wifi') {
          wx.getConnectedWifi({
            success: (e) => {
              console.log(e.wifi, 'wifi获取成功')
              this.globalData.wifissid = e.wifi.SSID,
              this.globalData.wifiBssid = e.wifi.BSSID
            },
            fail: function (e) {
              console.log(e, 'wifi获取失败')
            }
          })
        }
      }
    })
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.platform = res.platform
      }
    })
    wx.onNetworkStatusChange((res) => {
      this.globalData.networkType = res.networkType
      console.log(res.isConnected)
      console.log(res.networkType)
    })
  },
  connectMq: function () {
    //在按钮上显示加载标志
    wx.showLoading({
      title: '',
    })

    var client = new MQTT.Client("wss://tzface.openn.cn:8091/mqtt", "clientId_" + Math.random().toString(36).substr(2));
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

        client.onMessageArrived = function (msg) {
          if (this.globalData.messages == null) {
            console.log('1111111111')
            this.globalData.messages = [{ topic: msg.topic, message: msg.payloadString }];
          } else {
            console.log('2222222222222')
            this.globalData.messages =
              [{ topic: msg.topic, message: msg.payloadString }].concat(this.globalData.messages);
          }

        }

        // client.onConnectionLost = function (responseObject) {
        //   if (typeof this.globalData.onConnectionLost === 'function') {
        //     return this.globalData.onConnectionLost(responseObject);
        //   }
        //   if (responseObject.errorCode !== 0) {
        //     console.log("onConnectionLost:" + responseObject.errorMessage);
        //   }
        // }
        //去除按钮上的加载标志
        
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
    };

    client.connect(connectOptions);

  },
  subscribe: function () {
    if (this.globalData.mqtt_client && this.globalData.mqtt_client.isConnected()) {
      this.globalData.mqtt_client.subscribe(this.globalData.pub_topic, {
        qos: 1,
        onSuccess: () => {
          console.log('subscribe success');
          wx.hideLoading()
          this.publish()
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
  publish: function () {
    let msg = { "func": "onlineMsg", "sn": "TZFACEV320200924" }
    this.globalData.tst;
    if (this.globalData.mqtt_client && this.globalData.mqtt_client.isConnected()) {
      this.globalData.mqtt_client.publish(this.globalData.pub_topic,
        JSON.stringify(msg),
        1,
        false
      );
      wx.showToast({
        title: 'publish success',
        icon: "success",
        duration: 2000
      });
    } else {
      wx.showToast({
        title: 'client invalid',
        icon: "loading",
        duration: 2000
      });
    }
  },
  sendUdp(udp, test, ip = '') {
    udp.send({
      address: ip,
      port: 6125,
      message: JSON.stringify(test)
    })
  },
  ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  },
  globalData: {
    pub_topic: 'tzfacev3',
    tst: '',
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