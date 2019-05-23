// pages/newHome/index.js
const app = getApp()
function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i;
    }
  }
  return -1;
}

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}
Page({
  data: {
    devices: [],
    connected: false,
    chs: []
  },
  manage_password() {
    let time = app.Moment().format('ssmmhhDDMMYY')
    let hex = `55280000${time}00000000000000000000` //重置时钟
    this.writeBle(hex)
  },
  openBluetoothAdapter() {
    wx.openBluetoothAdapter({
      success: (res) => {
        console.log('openBluetoothAdapter success', res)
        this.startBluetoothDevicesDiscovery()
      },
      fail: (res) => {
        if (res.errCode === 10001) {
          wx.onBluetoothAdapterStateChange(function (res) {
            console.log('onBluetoothAdapterStateChange', res)
            if (res.available) {
              this.startBluetoothDevicesDiscovery()
            }
          })
        }
      }
    })
  },
  getBluetoothAdapterState() {
    wx.getBluetoothAdapterState({
      success: (res) => {
        console.log('getBluetoothAdapterState', res)
        if (res.discovering) {
          this.onBluetoothDeviceFound()
        } else if (res.available) {
          this.startBluetoothDevicesDiscovery()
        }
      }
    })
  },
  startBluetoothDevicesDiscovery() {
    if (this._discoveryStarted) {
      return
    }
    this._discoveryStarted = true
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: true,
      success: (res) => {
        console.log('startBluetoothDevicesDiscovery success', res)
        this.onBluetoothDeviceFound()
      },
    })
  },
  stopBluetoothDevicesDiscovery() {
    wx.stopBluetoothDevicesDiscovery()
  },
  onBluetoothDeviceFound() {
    wx.onBluetoothDeviceFound((res) => {
      res.devices.forEach(device => {
        if (!device.name && !device.localName) {
          return
        }
        const foundDevices = this.data.devices
        const idx = inArray(foundDevices, 'deviceId', device.deviceId)
        const data = {}
        if (idx === -1) {
          data[`devices[${foundDevices.length}]`] = device
        } else {
          data[`devices[${idx}]`] = device
        }
        this.setData(data)
      })
    })
  },
  createBLEConnection(e) {
    const ds = e.currentTarget.dataset
    const deviceId = ds.deviceId
    const name = ds.name
    wx.createBLEConnection({
      deviceId,
      success: (res) => {
        this.setData({
          connected: true,
          name,
          deviceId,
        })
        this.getBLEDeviceServices(deviceId)
      }
    })
    this.stopBluetoothDevicesDiscovery()
  },
  closeBLEConnection() {
    wx.closeBLEConnection({
      deviceId: this.data.deviceId
    })
    this.setData({
      connected: false,
      chs: [],
      canWrite: false,
    })
  },
  getBLEDeviceServices(deviceId) {
    wx.getBLEDeviceServices({
      deviceId,
      success: (res) => {
        for (let i = 0; i < res.services.length; i++) {
          if (res.services[i].isPrimary) {
            this.getBLEDeviceCharacteristics(deviceId, res.services[i].uuid)
            return
          }
        }
      }
    })
  },
  getBLEDeviceCharacteristics(deviceId, serviceId) {
    wx.getBLEDeviceCharacteristics({
      deviceId,
      serviceId,
      success: (res) => {
        for (let i = 0; i < res.characteristics.length; i++) {
          let item = res.characteristics[i]
          if (item.properties.read) {
            wx.readBLECharacteristicValue({
              deviceId,
              serviceId,
              characteristicId: item.uuid,
            })
          }
          if (item.properties.write) {
            this.setData({
              canWrite: true
            })
            this._deviceId = deviceId
            this._serviceId = serviceId
            this._characteristicId = item.uuid
            this.writeBLECharacteristicValue()
          }
          if (item.properties.notify || item.properties.indicate) {
            wx.notifyBLECharacteristicValueChange({
              deviceId,
              serviceId,
              characteristicId: item.uuid,
              state: true,
              success: function (res) {
                console.log('notify success', res.errMsg)
              },
              fail: function (res) {
                console.log('notify fail', res.errMsg)
              },
              complete: function (res) {
                console.log('notify complete', res.errMsg)
              },
            })
          }
        }
      },
      fail(res) {
        console.error('getBLEDeviceCharacteristics', res)
      }
    })
    // 操作之前先监听，保证第一时间获取数据
    wx.onBLECharacteristicValueChange((characteristic) => {
      console.log('~~~~~~~~~~~~~')
      console.log(ab2hex(characteristic.value))
      let value = ab2hex(characteristic.value)
      if (value.slice(-4, -2) === '11') {
        let time = app.Moment().format('ssmmhhDDMMYY')
        console.log(time)
        let hex = `55130000${time}00000000000000000000`  //时间信息
        this.rtc = time
        this.writeBle(hex)
      }
      if (value.slice(-4, -2) === '13') {
        let hex = '5523000000000000000000000000000000000000'  //seedC
        this.writeBle(hex)
      }
      if (value.slice(-4, -2) === '23') {
        this.seedC = value.slice(8, 36)
        let hex = '5512000000000000000000000000000000000000'  //seedA,获取mac
        this.writeBle(hex)
      }
      if (value.slice(-4, -2) === '12') {
        this.seedA = value.slice(8, 20)
        let time = app.Moment().format('ssmmhhDDMMYY')
        this.seedB = time
        let hex = `55140000${time}00000000000000000000` //seedB,时间信息
        this.writeBle(hex)
      }
      if (value.slice(-4, -2) === '14') {
        let hex = '5516000000000000000000000000000000000000'  //电池电量
        this.writeBle(hex)
      }
      if (value.slice(-4, -2) === '16') {
        let hex = '5531000038383838383800000000000000000000'  //管理员密码
        this.writeBle(hex)
      }
      if (value.slice(-4, -2) === '31') {
        let hex = '5532000039363536313631320000000000000000'  //设置绑定码
        this.writeBle(hex)
      }
      if (value.slice(-4, -2) === '32') {
        let hex = '5530000000000000000000000000000000000000'  //绑定结束
        this.writeBle(hex)
      }
      if (value.slice(-4, -2) === 'b0') {
        console.log('绑定成功~~~~~~~~~~~~')
      }
      if (value.slice(-4, -2) === '28') {
        let hex = '5515200000000000000000000000000000000000'  //对码
        this.writeBle(hex)
      }
      if (value.slice(-4, -2) === '15') {
        this.key = this.seedA + this.seedC + this.rtc + this.seedB
        console.log('key' + this.key)
        let orgPackageData = '08805678';
        for (let i = 0; i < 8; i++){
          orgPackageData += "00";
        }
        let cmd = 'logind';
        let command = this.strToHexCharCode(cmd);
        orgPackageData += command;
        orgPackageData += "000000010116000000010146";
        console.log(orgPackageData)
         //计算checksum
        let checksum = this.getCheckSum(this.hexToBytes(orgPackageData));
        console.log('checksum' + checksum)
        //写入checksum
        orgPackageData += this.bytes2Str(this.shortToBytesLe(checksum));
        console.log('orgPackageData@@@' + orgPackageData)
        //加密
        this.decodedPackageData = this.bytes2Str(this.crypt(this.hexToBytes(this.key), this.hexToBytes(orgPackageData)));
        console.log('decodedPackageData' + this.decodedPackageData)
        let hex = `a800${this.decodedPackageData.slice(0, 36)}`
        this.writeBle(hex)
      }
      if (this.decodedPackageData) {
        if (value === (`a800${this.decodedPackageData.slice(0, 36)}`).toLowerCase()) {
          let hex = `a801${this.decodedPackageData.slice(36, 64)}00000000`
          this.writeBle(hex)
        }
      }
      const idx = inArray(this.data.chs, 'uuid', characteristic.characteristicId)
      const data = {}
      if (idx === -1) {
        data[`chs[${this.data.chs.length}]`] = {
          uuid: characteristic.characteristicId,
          value: ab2hex(characteristic.value)
        }
      } else {
        data[`chs[${idx}]`] = {
          uuid: characteristic.characteristicId,
          value: ab2hex(characteristic.value)
        }
      }
      this.setData(data)
    })
  },
  //十六进制转byte数组
  hexToBytes(str) {
    var pos = 0;
    var len = str.length;
    if (len % 2 != 0) {
      return null;
    }
    len /= 2;
    var hexA = new Array();
    for (var i = 0; i < len; i++) {
      var s = str.substr(pos, 2);
      var v = parseInt(s, 16);
      hexA.push(v);
      pos += 2;
    }
    return hexA;
  },
  getCheckSum(data){
    let ret = 0;
    for(let i = 0; i<data.length; i++){
      ret += data[i];
    }
    return ret;
  },
  writeBLECharacteristicValue() {
    // 向蓝牙设备发送一个0x00的16进制数据
    let hex = '5511000031323334353637383930313233340000'  //login
    this.writeBle(hex)
  },
  closeBluetoothAdapter() {
    wx.closeBluetoothAdapter()
    this._discoveryStarted = false
  },
  writeBle(hex) {
    var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    }))

    var buffer1 = typedArray.buffer
    let pos = 0;
    wx.writeBLECharacteristicValue({
      deviceId: this._deviceId,
      serviceId: this._serviceId,
      characteristicId: this._characteristicId,
      value: buffer1,
      success: function (res) {
        console.log('writeBLECharacteristicValue success', res.errMsg)
      },
      fail: function (res) {
        console.log('writeBLECharacteristicValue fail', res.errMsg)
      },
      complete: function (res) {
        console.log('writeBLECharacteristicValue compl', res.errMsg)
      }
    })
  },
  onLoad: function (options) {
  },
  onShow: function () {
  },

  /**
   * 点击商品分类中的某一个
   */
  goDetail: function (e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/goodDetail/index?goodsId=${item.id}&eventType=selected_hot`
    })
  }
})