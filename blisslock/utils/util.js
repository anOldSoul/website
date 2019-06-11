const Moment = require('./moment.min.js')
let rtc, seedA, seedB, seedC, key, decodedPackageData
const app = getApp();
let func = {
  addPass: false,
  syncPass: false,
  addFinger: false,
  syncFinger: false,
  delFinger: false,
  delPass: false,
  unlockRecord: false,
  resolve: ''
}
let onChangePw = {
  onPwList: false,
  hexLen: 0,
  pageNum: 0,
  onPwListLen: 0
}
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const getQueryString = (url, name) => {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = url.match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
const getBLEDeviceServices = (deviceId, funcKey) => {
  wx.getBLEDeviceServices({
    deviceId,
    success: (res) => {
      for (let i = 0; i < res.services.length; i++) {
        if (res.services[i].isPrimary) {
          console.log(deviceId)
          getBLEDeviceCharacteristics(deviceId, res.services[i].uuid, funcKey)
          return
        }
      }
    }
  })
}
const doBLEConnection = (funcKey, resolve) => {
  func.resolve = resolve
  let deviceId = wx.getStorageSync('_deviceId')
  wx.createBLEConnection({
    // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
    deviceId,
    success: (res) => {
      getBLEDeviceServices(deviceId, funcKey)
    }
  })
}
const getBLEDeviceCharacteristics = (deviceId, serviceId, funcKey = '') => {
  func.addPass = false
  func.syncPass = false
  func.addFinger = false
  func.syncFinger = false
  func.delFinger = false
  func.delPass = false
  func[funcKey] = true
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
          wx.setStorageSync('_deviceId', deviceId)
          wx.setStorageSync('_serviceId', serviceId)
          wx.setStorageSync('_characteristicId', item.uuid)
          let hex
          if (funcKey && func[funcKey]) {
            let time = Moment().format('ssmmHHDDMMYY')
            rtc = time
            hex = `55280000${time}00000000000000000000` //重置时钟
          } else {
            hex = '5511000031323334353637383930313233340000'  //login
          }
          writeBle(hex)
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
      let hex
      if (funcKey && func[funcKey]) {
        hex = '5523000000000000000000000000000000000000'  //seedC
      } else {
        let time = Moment().format('ssmmHHDDMMYY')
        hex = `55130000${time}00000000000000000000`  //时间信息
        rtc = time
      }
      writeBle(hex)
    }
    if (value.slice(-4, -2) === '13') {
      let hex = '5523000000000000000000000000000000000000'  //seedC
      writeBle(hex)
    }
    if (value.slice(-4, -2) === '23') {
      seedC = value.slice(8, 36)
      let hex = '5512000000000000000000000000000000000000'  //seedA,获取mac
      writeBle(hex)
    }
    if (value.slice(-4, -2) === '12') {
      seedA = value.slice(8, 20)
      let time = Moment().format('ssmmHHDDMMYY')
      seedB = time
      let hex = `55140000${time}00000000000000000000` //seedB,时间信息
      writeBle(hex)
    }
    if (value.slice(-4, -2) === '14') {
      let hex
      hex = '5516000000000000000000000000000000000000'  //电池电量
      writeBle(hex)
    }
    if (value.slice(-4, -2) === '16') {
      let hex = '5531000038383838383800000000000000000000'  //管理员密码
      writeBle(hex)
    }
    if (value.slice(-4, -2) === '31' && value.slice(0, 2) === 'aa') {
      let hex = '5532000039363536313631320000000000000000'  //设置绑定码
      writeBle(hex)
    }
    if (value.slice(-4, -2) === '32') {
      let hex = '5530000000000000000000000000000000000000'  //绑定结束
      writeBle(hex)
    }
    if (value.slice(-4, -2) === 'a0') {
      console.log('添加指纹成功~~~~~~~~~~~~')
      wx.navigateTo({
        url: `/pages/finger/index`
      })
    }
    if (value.slice(-4, -2) === 'b0') {
      console.log('绑定成功~~~~~~~~~~~~')
      wx.navigateTo({
        url: `/pages/shopping/index`
      })
    }
    if (value.slice(-4, -2) === '1f') {
      console.log('删除密码成功~~~~~~~~~~~~')
      wx.navigateTo({
        url: `/pages/password/index?result=${value.slice(2, 4)}`
      })
    }
    if (value.slice(-4, -2) === '21') {
      console.log('删除指纹成功~~~~~~~~~~~~')
      wx.navigateTo({
        url: `/pages/finger/index?result=${value.slice(2, 4)}`
      })
    }
    if (value.slice(-4, -2) === '28') {
      let hex = '5515200000000000000000000000000000000000'  //对码
      writeBle(hex)
    }
    if (value.slice(-4, -2) === '15') {
      key = seedA + seedC + rtc + seedB
      console.log('key' + key)
      let orgPackageData = '08805678';
      for (let i = 0; i < 8; i++) {
        orgPackageData += "00";
      }
      let cmd = 'logind';
      let command = strToHexCharCode(cmd);
      orgPackageData += command;
      orgPackageData += "000000010116000000010146";
      console.log(orgPackageData)
      //计算checksum
      let checksum = getCheckSum(hexToBytes(orgPackageData));
      console.log('checksum' + checksum)
      //写入checksum
      orgPackageData += bytes2Str(shortToBytesLe(checksum));
      console.log('orgPackageData@@@' + orgPackageData)
      //加密
      decodedPackageData = bytes2Str(crypt(hexToBytes(key), hexToBytes(orgPackageData)));
      console.log('decodedPackageData' + decodedPackageData)
      let hex = `a800${decodedPackageData.slice(0, 36)}`
      writeBle(hex)
    }
    if (decodedPackageData) {
      if (value === (`a800${decodedPackageData.slice(0, 36)}`).toLowerCase()) {
        let hex = `a801${decodedPackageData.slice(36, 64)}00000000`
        writeBle(hex)
      }
    }
    if (value.slice(-4, -2) === '2c' && value !=='aa30000000000000000000000000000000002c00') {
      let unlockRecordData = wx.getStorageSync('unlockRecordData')
      unlockRecordData.push(value)
      wx.setStorageSync('unlockRecordData', value)
      let hex = `552C000000000000000000000000000000000000`
      writeBle(hex)
    }
    if (value === 'aa30000000000000000000000000000000002c00') {
      wx.navigateTo({
        url: `/pages/unlockRecord/index?result=noRecord`
      })
    }
    if (value.slice(-4, -2) === '9e' || value.slice(-4, -2) === 'a2') {
      if (func['syncPass']) {
        wx.setStorageSync('pwData', '')
      }
      if (func['syncFinger']) {
        wx.setStorageSync('fingerData', '')
      }
      onChangePw.hexLen = value.slice(4, 8)      
      let len = bytesToIntLe(hexToBytes(onChangePw.hexLen))
      console.log('数量为：' + len)
      if (len > 0) {
        //原包返回，接收数据包
        //计算数据页数
        if ((len % 18) == 0) {
          onChangePw.pageNum = (len / 18);
        } else {
          onChangePw.pageNum = Math.floor(len / 18) + 1;
        }
        onChangePw.onPwList = true
      } else {
        console.log('没有密码！')
      }
    }
    if (value.slice(0, 2) === '8a') {
      let pwData = ''
      let dataKey = ''
      if (func['syncPass']) {
        dataKey = 'pwData'
      }
      if (func['syncFinger']) {
        dataKey = 'fingerData'
      }
      pwData = wx.getStorageSync(dataKey) || ''
      if ((onChangePw.onPwListLen) < onChangePw.pageNum && onChangePw.onPwList) {
        pwData = pwData + value.slice(4, 40)
        console.log(dataKey)
        console.log(pwData)
        wx.setStorageSync(dataKey, pwData)
        onChangePw.onPwListLen ++
        if (onChangePw.onPwListLen === onChangePw.pageNum) {
          let result = pwData.slice(0, bytesToIntLe(hexToBytes(onChangePw.hexLen)) / 4 * 8)
          wx.setStorageSync(dataKey, result)
          func.resolve()
        }
        let hex = value
        writeBle(hex)
      } else {
        onChangePw = {
          onPwList: false,
          pageNum: 0,
          onPwListLen: 0,
          hexLen: 0
        }
      }
    }
    if (value.slice(-4, -2) === '95') {
      if (func['addPass']) {
        let hex = '551D000031323334353600000000000000000000'
        writeBle(hex)
      }
      if (func['syncPass']) {
        let hex = '551E000000000000000000000000000000000000'
        writeBle(hex)
      }
      if (func['delPass']) {
        let pw = wx.getStorageSync('delPass')
        let hex = `551F0000${pw}000000000000000000000000`
        writeBle(hex)
      }
      if (func['addFinger']) {
        let hex = '5520000000000000000000000000000000000000'
        writeBle(hex)
      }
      if (func['syncFinger']) {
        let hex = '5522000000000000000000000000000000000000'
        writeBle(hex)
      }
      if (func['delFinger']) {
        let finger = wx.getStorageSync('delFinger')
        let hex = `55210000${finger}000000000000000000000000`
        writeBle(hex)
      }
      if (func['unlockRecord']) {
        let hex = '552C000000000000000000000000000000000000'
        writeBle(hex)
      }
    }
  })
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
const getCheckSum = (data) => {
  let ret = 0;
  for (let i = 0; i < data.length; i++) {
    ret += data[i];
  }
  return ret;
}
const writeBle = (hex, funcKey = '') => {
  func[funcKey] = true
  console.log(func)
  var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
    return parseInt(h, 16)
  }))

  var buffer1 = typedArray.buffer
  let pos = 0;
  wx.writeBLECharacteristicValue({
    deviceId: wx.getStorageSync('_deviceId'),
    serviceId: wx.getStorageSync('_serviceId'),
    characteristicId: wx.getStorageSync('_characteristicId'),
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
}
const strToHexCharCode = (str) => { //ascii转16进制
  if (str === "") {
    return "";
  } else {
    var hexCharCode = [];
    for (var i = 0; i < str.length; i++) {
      hexCharCode.push((str.charCodeAt(i)).toString(16));
    }
    return hexCharCode.join("");
  }
}
//字节数组转十六进制字符串
const bytes2Str = (arr) => {
  var str = "";
  for (var i = 0; i < arr.length; i++) {
    var tmp = arr[i].toString(16);
    if (tmp.length == 1) {
      tmp = "0" + tmp;
    }
    str += tmp;
  }
  return str;
}
const shortToBytesLe = (shortValue) => {
  let arr = new Array();
  for (let i = 0; i < 2; ++i) {
    arr[i] = (shortValue >> i * 8 & 0xFF);
  }
  return arr;
}

const bytesToIntLe = (bytes) => {
  let ret = 0;
  for (let i = 0; i < bytes.length; ++i) {
    ret += ((bytes[i] & 0xFF) << i * 8);
  }

  return ret;
}

//十六进制转byte数组
const hexToBytes = (str) => {
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
}
//加密
const crypt = (key, data) =>{
  let charArray = [
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
  for (let i = 0; i < data.length; i++) {
    data[i] = (data[i] ^ charArray[key[i] & 0xFF]);
  }
  return data;
}
module.exports = {
  formatTime: formatTime,
  getQueryString: getQueryString,
  writeBle: writeBle,
  strToHexCharCode: strToHexCharCode,
  bytes2Str: bytes2Str,
  shortToBytesLe: shortToBytesLe,
  hexToBytes: hexToBytes,
  crypt: crypt,
  doBLEConnection: doBLEConnection,
  getBLEDeviceCharacteristics: getBLEDeviceCharacteristics
}
