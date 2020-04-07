const Moment = require('./moment.min.js')
const Encrypt = require("./getEncryptBytes.js")
const Format = require("./format.js")
const OTAexecuter = require("./OTAexecuter.js")
const OTAbin = require("./otabin.js")
let rtc, decodedPackageData
let response = 0
let interval = 0
let timer = 0

let hasUnlockRecord = ''
var pwNeedToAdd = {}
let func = {
  addPass: false,
  syncPass: false,
  addFinger: false,
  syncFinger: false,
  delFinger: false,
  delPass: false,
  unlockRecord: false,
  unlockAtOnce: false,
  airQuality: false,
  resolve: ''
}
let onChangePw = {
  onPwList: false,
  hexLen: 0,
  pageNum: 0,
  onPwListLen: 0
}
const doExecuter = () => {
  let hex = OTAexecuter.initOTAnew()
  console.log(hex)
  writeBle(hex)
}
const getBLEDeviceServices = (deviceId, funcKey) => {
  wx.getBLEDeviceServices({
    deviceId,
    success: (res) => {
      console.log(res)
      for (let i = 0; i < res.services.length; i++) {
        if (funcKey === 'OTAexecuter') {
          if (res.services[i].isPrimary && res.services[i].uuid.indexOf('0000FF00') > -1) {
            getBLEDeviceCharacteristics(deviceId, res.services[i].uuid, funcKey)
            return
          }
        } else if (res.services[i].isPrimary && res.services[i].uuid.indexOf('0000FFF0') > -1) {
          getBLEDeviceCharacteristics(deviceId, res.services[i].uuid, funcKey)
          return
        }
      }
    }
  })
}
const openBluetoothAdapter = (resolve, reject) => {
  wx.openBluetoothAdapter({
    success: (res) => {
      console.log('openBluetoothAdapter success', res)
      startBluetoothDevicesDiscovery(resolve, reject)
    },
    fail: (res) => {
      if (res.errCode === 10001) {
        wx.onBluetoothAdapterStateChange(function (res) {
          console.log('onBluetoothAdapterStateChange', res)
          if (res.available) {
            startBluetoothDevicesDiscovery(resolve, reject)
          }
        })
      }
    }
  })
}
const startBluetoothDevicesDiscovery = (resolve, reject) => {
  wx.startBluetoothDevicesDiscovery({
    allowDuplicatesKey: true,
    success: (res) => {
      console.log('startBluetoothDevicesDiscovery success', res)
      onBluetoothDeviceFound(resolve, reject)
    },
  })
}
const onBluetoothDeviceFound = (resolve, reject) => {
  let devices = []
  let deviceIdArr = []
  wx.onBluetoothDeviceFound((res) => {
    res.devices.forEach(device => {
      let tempdeviceid = Format.getDeviceItem('_deviceId')
      if (device.deviceId === tempdeviceid) {
        wx.setStorageSync('_deviceId', Format.getDeviceItem('_deviceId'))
        wx.stopBluetoothDevicesDiscovery()
        resolve()
      }
    })
  })
}
const closeConnection = () => {
  wx.hideLoading()
  wx.closeBLEConnection({
    deviceId: wx.getStorageSync('_deviceId') || Format.getDeviceItem('_deviceId'),
    success(res) {
      wx.setStorageSync('isConnecting', false)
      console.log('蓝牙连接断开')
    }
  })
}
const doBLEConnection = (funcKey, resolve, pwAdded = {}) => {
  wx.setStorageSync('isConnecting', true)
  pwNeedToAdd = pwAdded
  func.resolve = resolve
  if (wx.getStorageSync('_deviceId') && wx.getStorageSync('_deviceId') !== Format.getDeviceItem('_deviceId')) {
    new Promise((resolve1, reject) => {
      openBluetoothAdapter(resolve1, reject)
    }).then(() => {
      doBLEConnection(funcKey, resolve, pwAdded)
    })
  } else {
    let deviceId = wx.getStorageSync('_deviceId') || Format.getDeviceItem('_deviceId')
    wx.createBLEConnection({
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
      deviceId,
      success: (res) => {
        if (wx.getStorageSync('isConnecting')) {
          getBLEDeviceServices(deviceId, funcKey)
        }
      },
      fail: (res) => {
        if (wx.getStorageSync('isConnecting')) {
          let errCode = res.errCode
          let title = ''
          if (errCode === 10000) {
            new Promise((resolve1, reject) => {
              openBluetoothAdapter(resolve1, reject)
            }).then(() => {
              doBLEConnection(funcKey, resolve, pwAdded)
            })
          } else {
            if (errCode === 10003) {
              title = '等待超时，请重试'
            } else if (errCode === 10012) {
              title = '连接超时，请重试'
            } else {
              title = '连接失败，请重试'
            }
            wx.showModal({
              title: '提示',
              content: title,
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            })
          }
        }
      }
    })
  }
}
const getBLEDeviceCharacteristics = (deviceId, serviceId, funcKey = '',) => {
  func.addPass = false
  func.syncPass = false
  func.addFinger = false
  func.syncFinger = false
  func.delFinger = false
  func.delPass = false
  func.unlockRecord = false
  func.unlockAtOnce = false
  func.airQuality = false
  if (funcKey) {
    func[funcKey] = true
  }
  wx.getBLEDeviceCharacteristics({
    deviceId,
    serviceId,
    success: (res) => {
      console.log(res)
      for (let i = 0; i < res.characteristics.length; i++) {
        let item = res.characteristics[i]
        if (item.properties.read && (item.uuid.indexOf('0000FFF3') > -1 || item.uuid.indexOf('0000FF01') > -1)) {
          wx.readBLECharacteristicValue({
            deviceId,
            serviceId,
            characteristicId: item.uuid,
          })
        }
        if (item.properties.write && (item.uuid.indexOf('0000FFF3') > -1 || item.uuid.indexOf('0000FF01') > -1)) {
          wx.setStorageSync('_deviceId', deviceId)
          wx.setStorageSync('_serviceId', serviceId)
          wx.setStorageSync('_characteristicId', item.uuid)
          let hex
          if (funcKey === 'OTAexecuter') {
            hex = OTAexecuter.initOTA()
          } else if (funcKey && func[funcKey]) {
            wx.showLoading({
              title: '加载中'
            })
            let time = Moment().format('ssmmHHDDMMYY')
            rtc = time
            hex = `55280000${time}00000000000000000000` //重置时钟
          } else {
            hex = '5511000031323334353637383930313233340000'  //login
          }
          writeBle(hex)
        }
        if ((item.properties.notify || item.properties.indicate) && item.uuid.indexOf('0000FFF4') > -1) {
          wx.notifyBLECharacteristicValueChange({
            deviceId,
            serviceId,
            characteristicId: item.uuid,
            state: true,
            success: function (res) {
              console.log('serviceId是' + serviceId)
              console.log('notify success', res)
            },
            fail: function (res) {
              console.log('notify fail', res.errMsg)
            },
            complete: function (res) {
              console.log('notify complete', res)
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
    console.log('特征值有变化。。。。。')
    console.log('监听到变化特征值为' + Format.ab2hex(characteristic.value))
    response = 0
    clearInterval(interval)
    clearTimeout(timer)
    let value = Format.ab2hex(characteristic.value)
    // ota process
    if (value.length === 42) {
      setTimeout(() => {
        doBLEConnection('OTAexecuter')
        let hex = OTAexecuter.startOTAGetMtu()
        writeBle(hex)
      }, 1000)
    }
    // if (value.length === 42) {
    //   let hex = OTAexecuter.startOTAGetMtu()
    //   writeBle(hex)
    // }
    // if (value.length === 42) {
    //   let hex = OTAexecuter.startOTAeraseFlash()
    //   writeBle(hex)
    // }
    // 非ota process
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
    if (value.slice(-4, -2) === '13' && value.slice(0, 2) === 'aa') {
      let hex = '5523000000000000000000000000000000000000'  //seedC
      writeBle(hex)
    }
    if (value.slice(-4, -2) === '23' && value.slice(0, 2) === 'aa') {
      wx.setStorageSync('seedC', value.slice(8, 36))
      let hex = '5512000000000000000000000000000000000000'  //seedA,获取mac
      writeBle(hex)
    }
    if (value.slice(-4, -2) === '12' && value.slice(0, 2) === 'aa') {
      wx.setStorageSync('seedA', value.slice(8, 20))
      let time = Moment().format('ssmmHHDDMMYY')
      wx.setStorageSync('seedB', time)
      let hex = `55140000${time}00000000000000000000` //seedB,时间信息
      writeBle(hex)
    }
    if (value.slice(-4, -2) === '14' && value.slice(0, 2) === 'aa') {
      let hex
      hex = '5516000000000000000000000000000000000000'  //电池电量
      writeBle(hex)
    }
    if (value.slice(-4, -2) === '16' && value.slice(0, 2) === 'aa') {
      let admPw = wx.getStorageSync('admPw')|| '123456'
      let pw = Format.strToHexCharCode(admPw)
      if (pw.length < 24) {
        for (let i = pw.length; i < 24; i++) {
          pw = pw + '0'
        }
      }
      let hex = `55310000${pw}00000000`//管理员密码
      writeBle(hex)
    }
    if (value.slice(-4, -2) === '31' && value.slice(0, 2) === 'aa') {
      wx.setStorageSync('bindCode', Format.getRandomStr(8)) //获取8位随机数
      let hex = `55320000${Format.strToHexCharCode(wx.getStorageSync('bindCode'))}0000000000000000`  //设置绑定码
      writeBle(hex)
    }
    if (value.slice(-4, -2) === '32' && value.slice(0, 2) === 'aa') {
      let hex = '5530000000000000000000000000000000000000'  //绑定结束
      writeBle(hex)
    }
    if (value.slice(-4, -2) === 'a5' && value.slice(0, 8) === 'aa300014') {
      let data = value.slice(8, 36)
      wx.redirectTo({
        url: `/pages/airQuality/index?airData=${data}`
      })
    }
    if (value.slice(-4, -2) === 'a0') {
      if (value.slice(2, 4) === '30') {
        console.log('添加指纹成功~~~~~~~~~~~~')
        closeConnection()
        let str = Format.getDeviceItem('fingerData') || ''
        Format.updateDeviceList('fingerData', value.slice(8, 16) + str)
      }
      Format.updateDeviceList('addFinger', { result: value.slice(2, 4), id: value.slice(8, 16), name: pwNeedToAdd.name })
      let currentPages = getCurrentPages()
      currentPages.forEach((item, index) => {
        if (item.route === 'pages/finger/index') {
          if (currentPages.length - index !== 1) {
            wx.navigateBack({
              delta: currentPages.length - (index + 1)
            })
          }
        }
      })
    }
    if (value.slice(2, 4) === '30' && value.slice(-4, -2) === '9d') {
      if (value.slice(2, 4) === '30') {
        console.log('添加密码成功~~~~~~~~~~~~')
        closeConnection()
        let str = Format.getDeviceItem('pwData') || ''
        Format.updateDeviceList('pwData', value.slice(8, 16) + str)
      }
      Format.updateDeviceList('addPw', { result: value.slice(2, 4), id: value.slice(8, 16), name: pwNeedToAdd.name })
      let currentPages = getCurrentPages()
      currentPages.forEach((item, index) => {
        if (item.route === 'pages/password/index') {
          if (currentPages.length - index !== 1) {
            wx.navigateBack({
              delta: currentPages.length - (index + 1)
            })
          }
        }
      })
    }
    if (value.slice(-4, -2) === 'b0' && value.slice(0, 2) === 'aa') {
      console.log('绑定成功')
      wx.redirectTo({
        url: '/pages/install/index',
      })
    }
    if (value.slice(-4, -2) === '1f' && value.slice(0, 2) === 'aa') {
      console.log('删除密码成功')
      let tempData = Format.getDeviceItem('pwData')
      let str = Format.getDeviceItem('delPassId')
      let index = tempData.indexOf(str)
      tempData = tempData.substring(0, index) + tempData.substring(index + 8, tempData.length)
      Format.updateDeviceList('pwData', tempData)
      Format.updateDeviceList('delPw', value.slice(2, 4))
      closeConnection()
      wx.navigateBack({
        delta: 2
      })
    }
    if (value.slice(-4, -2) === '21' && value.slice(0, 2) === 'aa') {
      console.log('删除指纹成功')
      let tempData = Format.getDeviceItem('fingerData')
      let str = Format.getDeviceItem('delFingerId')
      let index = tempData.indexOf(str)
      tempData = tempData.substring(0, index) + tempData.substring(index + 8, tempData.length)
      Format.updateDeviceList('fingerData', tempData)
      Format.updateDeviceList('delFinger', value.slice(2, 4))
      closeConnection()
      wx.navigateBack({
        delta: 2
      })
    }
    if (value.slice(-4, -2) === '28' && value.slice(0, 2) === 'aa') {
      let hex = '5515200000000000000000000000000000000000'  //对码
      writeBle(hex)
    }
    if (value.slice(-4, -2) === '36' && value.slice(0, 2) === 'aa') {
      let hex = ''     
      if (pwNeedToAdd.pw) {
        let pw = Format.formatPw(pwNeedToAdd.pw)
        hex = `551D0000${pw}01000000`        
      } else {
        hex = '5520000000000000000000000000000001000000'
      }
      writeBle(hex)
    }
    if (value.slice(-4, -2) === '15' && value.slice(0, 2) === 'aa') {
      let key = Format.getDeviceItem('seedA') + Format.getDeviceItem('seedC') + rtc + Format.getDeviceItem('seedB')
      let orgPackageData = '08805678';
      for (let i = 0; i < 8; i++) {
        orgPackageData += "00";
      }
      let cmd = 'logind';
      let command = Format.strToHexCharCode(cmd);
      orgPackageData += command;
      orgPackageData += "000000010116000000010146";
      //计算checksum
      let checksum = Format.getCheckSum(Format.hexToBytes(orgPackageData));
      //写入checksum
      orgPackageData += Format.bytes2Str(Format.shortToBytesLe(checksum));
      //加密
      decodedPackageData = Format.bytes2Str(Encrypt.crypt(Format.hexToBytes(key), Format.hexToBytes(orgPackageData)));
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
      hasUnlockRecord = 'hasRecord'
      let tempData = Format.getDeviceItem('unlockRecordData')
      let unlockRecordData = (tempData instanceof Array) ? tempData : []
      unlockRecordData.push(value)
      Format.updateDeviceList('unlockRecordData', unlockRecordData)
      let hex = `552C000000000000000000000000000000000000`
      writeBle(hex)
    }
    if (value === 'aa30000000000000000000000000000000002c00') {
      Format.updateDeviceList('hasUnlockRecord', hasUnlockRecord || 'noRecord')
      hasUnlockRecord = ''
      closeConnection()
      wx.navigateBack({
        delta: 1
      })
    }
    if (value.slice(-4, -2) === '9e' || value.slice(-4, -2) === 'a2') {
      let pwData = ''
      let dataKey = ''
      if (func['syncPass']) {
        dataKey = 'pwData'
        Format.updateDeviceList('pwData', '')
      }
      if (func['syncFinger']) {
        dataKey = 'fingerData'
        Format.updateDeviceList('fingerData', '')
      }
      onChangePw.hexLen = value.slice(4, 8)      
      let len = Format.bytesToIntLe(Format.hexToBytes(onChangePw.hexLen))
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
        Format.updateDeviceList(dataKey, [])
        if (dataKey === 'fingerData') {
          Format.updateDeviceList('isFingerSycBack', 'noData')
        }
        if (dataKey === 'pwData') {
          Format.updateDeviceList('isPwSycBack', 'noData')
        }
        func.resolve()
        wx.navigateBack({
          delta: 1
        })
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
      pwData = Format.getDeviceItem(dataKey) || ''
      if ((onChangePw.onPwListLen) < onChangePw.pageNum && onChangePw.onPwList) {
        pwData = pwData + value.slice(4, 40)
        Format.updateDeviceList(dataKey, pwData)
        onChangePw.onPwListLen ++
        if (onChangePw.onPwListLen === onChangePw.pageNum) {
          let result = pwData.slice(0, Format.bytesToIntLe(Format.hexToBytes(onChangePw.hexLen)) / 4 * 8)
          Format.updateDeviceList(dataKey, result)
          onChangePw = {
            onPwList: false,
            pageNum: 0,
            onPwListLen: 0,
            hexLen: 0
          }
          func.resolve()
          let currentPages = getCurrentPages()
          let prePage = currentPages[currentPages.length - 2].route
          if (prePage === 'pages/password/index' || prePage === 'pages/finger/index') {
            wx.navigateBack({
              delta: 1
            })
            if (dataKey === 'fingerData') {
              Format.updateDeviceList('isFingerSycBack', true)
            }
            if (dataKey === 'pwData') {
              Format.updateDeviceList('isPwSycBack', true)
            }
          } else {
            Format.updateDeviceList('isFingerSycBack', false)
            Format.updateDeviceList('isPwSycBack', false)
          }
        } else {
          let hex = value
          writeBle(hex)
        }        
      } else {
        onChangePw = {
          onPwList: false,
          pageNum: 0,
          onPwListLen: 0,
          hexLen: 0
        }
      }
    }
    if (value.slice(-4, -2) === '95' && value.slice(0, 2) === 'aa') {
      if (func['addPass']) {
        let pw = Format.formatPw(pwNeedToAdd.pw)
        let userType = pwNeedToAdd.userType
        let validDate = pwNeedToAdd.validDate
        let hex = ''
        let time = Moment().format('ssmmHHDDMMYY')
        if (userType === '0' && validDate) {  //设置时效
          let validTime = Moment(validDate, 'YYYY-MM-DD HHmm').format('00mmHHDDMMYY')
          hex = `55360000${time}${validTime}00000000`
        }
        if (userType === '0' && !validDate) {
          hex = `551D0000${pw}00000000`
        }
        if (userType === '1') {
          hex = `551D0000${pw}00010000`
        }
        writeBle(hex)
      }
      if (func['syncPass']) {
        let hex = '551E000000000000000000000000000000000000'
        writeBle(hex)
      }
      if (func['delPass']) {
        let pw = Format.getDeviceItem('delPassId')
        let hex = `551F0000${pw}000000000000000000000000`
        writeBle(hex)
      }
      if (func['addFinger']) {
        let userType = pwNeedToAdd.userType
        let validDate = pwNeedToAdd.validDate
        let hex = ''
        let time = Moment().format('ssmmHHDDMMYY')
        if (userType === '0' && validDate) {  //设置时效
          let validTime = Moment(validDate, 'YYYY-MM-DD HHmm').format('00mmHHDDMMYY')
          hex = `55360000${time}${validTime}00000000`
        }
        if (userType === '0' && !validDate) {
          hex = `5520000000000000000000000000000000000000`
        }
        if (userType === '1') {
          hex = `5520000000000000000000000000000000010000`
        }
        writeBle(hex)
      }
      if (func['syncFinger']) {
        let hex = '5522000000000000000000000000000000000000'
        writeBle(hex)
      }
      if (func['delFinger']) {
        let finger = Format.getDeviceItem('delFingerId')
        let hex = `55210000${finger}000000000000000000000000`
        writeBle(hex)
      }
      if (func['unlockRecord']) {
        let hex = '552C000000000000000000000000000000000000'
        writeBle(hex)
      }
      if (func['unlockAtOnce']) {
        let hex = '5533000031323334353600000000000000000000'
        writeBle(hex)
      }
      if (func['airQuality']) {
        let hex = '55A5000000000000000000000000000000000000'
        writeBle(hex)
      }
    }
  })
}

const writeBle = (hex, funcKey = '') => {
  console.log('写数据为：' + hex)
  response = 0
  interval = setInterval(() => {
    response ++
  }, 1000)
  timer = setTimeout(() => {
    if (response >= 15) {
      clearInterval(interval)
      clearTimeout(timer)
      closeConnection()
      wx.showModal({
        title: '提示',
        content: '蓝牙连接超时，请重试',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            let currentPages = getCurrentPages()
            let currentPage = currentPages[currentPages.length - 1].route
            if (currentPage === 'pages/search/index') {
              wx.navigateBack({
                delta: 2
              })
            } else {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        }
      })
      return
    }
  }, 15000)
  if (hex === '5520000000000000000000000000000000000000') {
    wx.redirectTo({
      url: `/pages/activateFinger/index`
    })
  }
  func[funcKey] = true
  var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
    return parseInt(h, 16)
  }))

  var buffer1 = typedArray.buffer
  let pos = 0;
  wx.writeBLECharacteristicValue({
    deviceId: wx.getStorageSync('_deviceId') || Format.getDeviceItem('_deviceId'),
    serviceId: wx.getStorageSync('_serviceId') || Format.getDeviceItem('_serviceId'),
    characteristicId: wx.getStorageSync('_characteristicId') || Format.getDeviceItem('_characteristicId'),
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

module.exports = {
  doBLEConnection: doBLEConnection,
  doExecuter: doExecuter,
  getBLEDeviceCharacteristics: getBLEDeviceCharacteristics,
  getTempPassword: Format.getTempPassword,
  updateDeviceList: Format.updateDeviceList,
  getDeviceItem: Format.getDeviceItem,
  hexToFromBytes: Format.hexToFromBytes
}
