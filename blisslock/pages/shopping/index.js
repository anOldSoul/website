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
  strToHexCharCode(str) { //ascii转16进制
    if(str === "") {
      return "";
    } else {
      var hexCharCode = [];
      for (var i = 0; i < str.length; i++) {
        hexCharCode.push((str.charCodeAt(i)).toString(16));
      }
      return hexCharCode.join("");
    }
  },
  //字节数组转十六进制字符串
  bytes2Str (arr) {
    var str = "";
    for(var i = 0; i<arr.length; i++) {
      var tmp = arr[i].toString(16);
      if (tmp.length == 1) {
        tmp = "0" + tmp;
      }
      str += tmp;
    }
    return str;
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
  crypt(key, data) {
    let charArray =[
      0x9C, 0x90, 0x4E, 0xF2, 0x29, 0xD4, 0xE6, 0xD4, 0xF9, 0xBD, 0xA4, 0x33,
      0xE5, 0x85, 0xBC, 0xA9, 0x77, 0x38, 0x93, 0x0A, 0x2B, 0xCE, 0xB0, 0x67,
      0x53, 0x7D, 0x5D, 0x6C, 0x8A, 0x46, 0x48, 0x42, 0xB1, 0x0E, 0x99, 0x47,
      0x45, 0x34, 0xCB, 0xCA, 0x8C, 0x37, 0x6D, 0xDC, 0xB4, 0x9D, 0x05, 0xE2,
      0xC3, 0xAB, 0x81, 0xCB, 0xB4, 0xB4, 0x0F, 0xAF, 0xDE, 0xE8, 0xA2, 0xC2,
      0x4F, 0x5F, 0x11, 0x50, 0x3B, 0x34, 0x2B, 0xCE, 0xB0, 0xCF, 0x16, 0x19,
      0xE8, 0x52, 0x43, 0x03, 0x3C, 0xC2, 0xBD, 0xE2, 0x4C, 0x43, 0x55, 0x5D,
      0x0B, 0xEF, 0x27, 0x03, 0x4B, 0x1E, 0xE0, 0x31, 0xCC, 0x54, 0x2D, 0xFB,
      0xBC, 0x90, 0xFE, 0x2C, 0xCA, 0x9A, 0xF8, 0xC2, 0xD3, 0x36, 0x3A, 0xE3,
      0x65, 0x8B, 0x9E, 0xB1, 0x51, 0x8F, 0xCB, 0x94, 0xE5, 0x95, 0x49, 0xBA,
      0x36, 0xCD, 0xDC, 0xB5, 0xCD, 0xC2, 0xB3, 0x17, 0x1C, 0x31, 0xD4, 0x3D,
      0xFB, 0x3F, 0x1D, 0xA0, 0x68, 0xF6, 0xD2, 0x84, 0x57, 0xD7, 0x54, 0xDD,
      0xF2, 0x72, 0xE5, 0x0F, 0x56, 0x5C, 0x6A, 0xD7, 0xA6, 0x5C, 0xFB, 0xE2,
      0x25, 0x74, 0xED, 0xA3, 0x1D, 0x31, 0x87, 0xF2, 0x37, 0x4E, 0xF3, 0xFC,
      0x2C, 0xA2, 0x91, 0xE2, 0x7D, 0xFE, 0xB9, 0xA5, 0x77, 0x55, 0x08, 0x17,
      0x48, 0x29, 0x2C, 0xF6, 0xD1, 0xFC, 0xC7, 0x51, 0x59, 0x27, 0x1B, 0xA4,
      0x04, 0x95, 0xDD, 0x1B, 0xD1, 0x44, 0x28, 0xA1, 0xA6, 0xF2, 0xF5, 0xBB,
      0x3F, 0xE4, 0xBB, 0xFA, 0xE7, 0xB8, 0x96, 0x69, 0xBA, 0x27, 0x15, 0xFF,
      0x7C, 0xD7, 0x62, 0x54, 0xBE, 0x7E, 0x57, 0x09, 0xBF, 0x36, 0x01, 0x96,
      0x69, 0x05, 0xF0, 0x6A, 0x2A, 0xDB, 0xDB, 0x12, 0xA2, 0x63, 0x30, 0x01,
      0xBB, 0xF9, 0x99, 0xD2, 0xDC, 0x50, 0x96, 0xBE, 0xDA, 0x7A, 0x0A, 0x01,
      0xCD, 0x9E, 0x03, 0xF1]
    if (key.length != data.length) {
      return data;
    }
    for (let i = 0; i < data.length; i++){
      data[i] = (data[i] ^ charArray[key[i] & 0xFF]);
    }
    return data;
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