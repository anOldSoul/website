// pages/newHome/index.js
const app = getApp()
const Format = require("../../utils/format.js")
const OTAexecuter = require("../../utils/OTAexecuter.js")
const PxiBleOTAhelper = require("../../utils/OTAhelper.js")
const Moment = require('../../utils/moment.min.js')
const Encrypt = require("../../utils/getEncryptBytes.js")
let rtc, decodedPackageData
let response = 0
let timer = 0
let TEST = 0
let isWrite = false
let func = {
  startOTA: false
}
let binData = ''
function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i;
    }
  }
  return -1;
}
Page({
  data: {
    authenTitle: '升级准备中，请稍后',
    currentWriteCount: '',
    total: '',
    showAuthen: false,
    device_name: '',
    devices: [],
    connected: false
  },
  getData() {
    let config = app.Apis.GET_FILEDATA
    app.post(config, {
      "versionNumber": 1
    }, result => {
      binData = result.data.data
      PxiBleOTAhelper.init(binData)
    })
  },
  handleExe () {
    isWrite = false
    // wx.hideLoading()
    this.setData({
      showAuthen: true
    })
    this.doBLEConnection('startOTA')
  },
  handleCancel() {
    this.setData({
      showAuthen: false
    })
    app.util.closeConnection()
  },
  onLoad: function (options) {
    this.getData()
    let device_name = app.util.getDeviceItem('device_name')
    let type = app.util.getDeviceItem('type')
    this.setData({
      device_name, type
    })
  },
  onShow: function () {
    if (app.util.getDeviceItem('showAdmPw')) {
      app.util.updateDeviceList('showAdmPw', false)
      this.checkAdmPw()
    }
    if (app.util.getDeviceItem('showRepair')) {
      app.util.updateDeviceList('showRepair', false)
      wx.showToast({
        title: '报修成功',
        duration: 2000
      })
    }
  },
  handleDelDevice: function() {
    wx.showModal({
      title: '提示',
      content: '确定要删除设备吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          let currentDeviceIndex = wx.getStorageSync('currentDeviceIndex')
          let deviceList = wx.getStorageSync('deviceList')
          let newDeviceList = deviceList.filter((item, index) => {
            return index !== currentDeviceIndex
          })
          wx.setStorageSync('deviceList', newDeviceList || [])
          wx.reLaunch({
            url: '/pages/index/index',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  checkAdmPw: function() {
    wx.showModal({
      title: '提示', 
      content: `管理员密码为：${app.util.getDeviceItem('admPw')}`,
      showCancel: false,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  unlockAtOnce() {
    app.util.doBLEConnection('unlockAtOnce')
  },
  goUnlockRecord (e) {
    wx.navigateTo({
      url: `/pages/gesture/index?url=unlockRecord`
    })
  },
  doBLEConnection(funcKey, resolve, pwAdded = {}) {
    if (funcKey === 'startOTA') {
      TEST = 0
    }
    wx.setStorageSync('isConnecting', true)
    if (!wx.getStorageSync('_deviceId') && wx.getStorageSync('_deviceId') !== Format.getDeviceItem('_deviceId')) {
      new Promise((resolve1, reject) => {
        this.openBluetoothAdapter(resolve1, reject)
      }).then(() => {
        this.doBLEConnection(funcKey, resolve, pwAdded)
      })
    } else {
      let deviceId = wx.getStorageSync('_deviceId') || Format.getDeviceItem('_deviceId')
      wx.createBLEConnection({
        // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
        deviceId,
        success: (res) => {
          if (wx.getStorageSync('isConnecting')) {
            this.getBLEDeviceServices(deviceId, funcKey)
          }
        },
        fail: (res) => {
          if (wx.getStorageSync('isConnecting')) {
            let errCode = res.errCode
            let title = ''
            if (errCode === 10000) {
              new Promise((resolve1, reject) => {
                this.openBluetoothAdapter(resolve1, reject)
              }).then(() => {
                this.doBLEConnection(funcKey, resolve, pwAdded)
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
  },
  getBLEDeviceServices(deviceId, funcKey) {
    wx.getBLEDeviceServices({
      deviceId,
      success: (res) => {
        console.log(res)
        for (let i = 0; i < res.services.length; i++) {
          if (funcKey === 'OTAexecuter') {
            if (res.services[i].isPrimary && res.services[i].uuid.indexOf('0000FF00') > -1) {
              this.getBLEDeviceCharacteristics(deviceId, res.services[i].uuid, funcKey)
              return
            }
          } else if (res.services[i].isPrimary && res.services[i].uuid.indexOf('0000FFF0') > -1) {
            this.getBLEDeviceCharacteristics(deviceId, res.services[i].uuid, funcKey)
            return
          }
        }
      }
    })
  },
  openBluetoothAdapter(resolve, reject) {
    wx.openBluetoothAdapter({
      success: (res) => {
        console.log('openBluetoothAdapter success', res)
        this.startBluetoothDevicesDiscovery(resolve, reject)
      },
      fail: (res) => {
        if (res.errCode === 10001) {
          wx.onBluetoothAdapterStateChange(function (res) {
            console.log('onBluetoothAdapterStateChange', res)
            if (res.available) {
              this.startBluetoothDevicesDiscovery(resolve, reject)
            }
          })
        }
      }
    })
  },
  startBluetoothDevicesDiscovery(resolve, reject) {
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: true,
      success: (res) => {
        console.log('startBluetoothDevicesDiscovery success', res)
        this.onBluetoothDeviceFound(resolve, reject)
      },
    })
  },
  onBluetoothDeviceFound(resolve, reject) {
    let devices = []
    let deviceIdArr = []
    wx.onBluetoothDeviceFound((res) => {
      res.devices.forEach(device => {
        let tempdeviceid = wx.getStorageSync('_deviceId')
        // let tempdeviceid = Format.getDeviceItem('_deviceId')
        if (device.deviceId === tempdeviceid) {
          wx.setStorageSync('_deviceId', Format.getDeviceItem('_deviceId'))
          wx.stopBluetoothDevicesDiscovery()
          resolve()
        }
      })
    })
  },
  getBLEDeviceCharacteristics(deviceId, serviceId, funcKey = '', ) {
    func.startOTA = false
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
              hex = OTAexecuter.initOTAnew()
              this.writeBle(hex, 'OTA')
            } else if (funcKey) {
              // wx.showLoading({
              //   title: '加载中'
              // })
              let time = Moment().format('ssmmHHDDMMYY')
              rtc = time
              hex = `55280000${time}00000000000000000000` //重置时钟
              this.writeBle(hex)
            } else {
              hex = '5511000031323334353637383930313233340000'  //login
              this.writeBle(hex)
            }
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
      console.log(TEST)
      console.log('监听到变化特征值为' + Format.ab2hex(characteristic.value))
      response = 0
      clearTimeout(timer)
      let value = Format.ab2hex(characteristic.value)
      if (value === '0e021700') {
        let hex = OTAexecuter.startOTAupgradeFlash(PxiBleOTAhelper.getSourceFileSize(), PxiBleOTAhelper.getSourceFileCRC())
        var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
          return parseInt(h, 16)
        }))
        var buffer1 = typedArray.buffer
        console.log(hex)
        wx.writeBLECharacteristicValue({
          deviceId: wx.getStorageSync('_deviceId') || Format.getDeviceItem('_deviceId'),
          serviceId: wx.getStorageSync('_serviceId') || Format.getDeviceItem('_serviceId'),
          characteristicId: wx.getStorageSync('_characteristicId') || Format.getDeviceItem('_characteristicId'),
          value: buffer1,
          success: function (res) {
            wx.readBLECharacteristicValue({
              deviceId: wx.getStorageSync('_deviceId') || Format.getDeviceItem('_deviceId'),
              serviceId: wx.getStorageSync('_serviceId') || Format.getDeviceItem('_serviceId'),
              characteristicId: wx.getStorageSync('_characteristicId') || Format.getDeviceItem('_characteristicId'),
              success(res) {
                console.log('last read:', res.errCode)
              }
            })
          },
          fail: function (res) {
            console.log('writeBLECharacteristicValue fail', res.errMsg)
          },
          complete: function (res) {
            console.log('writeBLECharacteristicValue compl', res.errMsg)
          }
        })
      }
      if (value === 'aa3000000000000000000000000000000000df00') {
        setTimeout(() => {
          this.doBLEConnection('OTAexecuter')
        }, 2000)
      }
      if (value === '0e021800') {
        let hex = OTAexecuter.startOTAfwReset()
        this.writeBle(hex)
      }
      if (value === '0e022000') {
        isWrite = true
        let binArray = PxiBleOTAhelper.getSourceFile(binData)
        let att_mtu_size = 23
        let size
        let currentWriteCount
        let length = ((att_mtu_size - 3) / 4 * 4);

        if (length >= 508) {
          length = 504;
        }  // workaround with 2802: due to the receive buffer size is smaller than l2cap pdu length(aleast bigger than 518)

        size = length;
        let start_address = 0     
        currentWriteCount = start_address / size;
        let chunckBinary = OTAexecuter.splitArray(binArray, size);
        console.log(chunckBinary.length)

        let i = 0
        let write = (() => {
          let hex = Format.bytes2Str(chunckBinary[i])
          var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
            return parseInt(h, 16)
          }))
          var buffer1 = typedArray.buffer
          console.log(hex)
          wx.writeBLECharacteristicValue({
            deviceId: wx.getStorageSync('_deviceId') || Format.getDeviceItem('_deviceId'),
            serviceId: wx.getStorageSync('_serviceId') || Format.getDeviceItem('_serviceId'),
            characteristicId: wx.getStorageSync('_characteristicId') || Format.getDeviceItem('_characteristicId'),
            value: buffer1,
            success: (res) => {
              currentWriteCount++;
              i++
              this.setData({
                currentWriteCount: currentWriteCount,
                total: chunckBinary.length,
                authenTitle: '固件升级中'
              })
              console.log("Update to ..." + currentWriteCount + "/" + chunckBinary.length);
              console.log('writeBLECharacteristicValue success', res.errMsg)
              app.globalData.currentWriteCount = currentWriteCount
              app.globalData.currentWriteCount = currentWriteCount
              if (i < chunckBinary.length && isWrite) {
                write()           
              } else {
                wx.readBLECharacteristicValue({
                  deviceId: wx.getStorageSync('_deviceId') || Format.getDeviceItem('_deviceId'),
                  serviceId: wx.getStorageSync('_serviceId') || Format.getDeviceItem('_serviceId'),
                  characteristicId: wx.getStorageSync('_characteristicId') || Format.getDeviceItem('_characteristicId'),
                  success(res) {
                    console.log('readBLECharacteristicValue:', res.errCode)
                  }
                })
              }
            },
            fail: function (res) {
              console.log('writeBLECharacteristicValue fail', res.errMsg)
            },
            complete: function (res) {
              console.log('writeBLECharacteristicValue compl', res.errMsg)
            }
          })
        })
        write()
      }
      if (value === '0e021100') {
        TEST++
        let hex = OTAexecuter.task()
        this.writeBle(hex, 'OTA')
      }
      if (value === '0e022100') {
        TEST++
        let hex = OTAexecuter.startOTASetFlashAddress()
        this.writeBle(hex, 'OTA')
      }
      if (value === '0e021600') {
        TEST++
        let hex = OTAexecuter.startRemoteDeviceConnectionUpdate(6, 9, 100, 300)
        this.writeBle(hex, 'OTA')
      }
      if (value === '0e0424170000') {
        TEST++
        setTimeout(() => {
          let hex = OTAexecuter.startOTAeraseFlash()
          this.writeBle(hex, 'OTA')
        }, 10000)
      }
      if (value === '0e021000' && TEST === 1) {
        TEST++
        let hex = OTAexecuter.startOTAGetMtu()
        this.writeBle(hex, 'OTA')
      }
      if (value.length === 42 && TEST === 0) {
        TEST++
        let hex = OTAexecuter.initOTA()
        this.writeBle(hex, 'OTA')
      }
      if (value.slice(-4, -2) === '28' && value.slice(0, 2) === 'aa') {
        let hex = '5515200000000000000000000000000000000000'  //对码
        this.writeBle(hex)
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
        this.writeBle(hex)
      }
      if (decodedPackageData) {
        if (value === (`a800${decodedPackageData.slice(0, 36)}`).toLowerCase()) {
          let hex = `a801${decodedPackageData.slice(36, 64)}00000000`
          this.writeBle(hex)
        }
      }
      if (value.slice(-4, -2) === '95' && value.slice(0, 2) === 'aa') {
        if (func['startOTA']) {
          let hex = '55df000000000000000000000000000000000000'
          this.writeBle(hex)
        }
      }
    })
  },
  writeBle(hex, funcKey = '') {
    console.log('写数据为：' + hex)
    // response = 0
    // interval = setInterval(() => {
    //   response ++
    // }, 1000)
    // timer = setTimeout(() => {
    // if (response >= 15) {
    //   clearInterval(interval)
    //   clearTimeout(timer)
    //   closeConnection()
    //   wx.showModal({
    //     title: '提示',
    //     content: '蓝牙连接超时，请重试',
    //     showCancel: false,
    //     success(res) {
    //       if (res.confirm) {
    //         let currentPages = getCurrentPages()
    //         let currentPage = currentPages[currentPages.length - 1].route
    //         if (currentPage === 'pages/search/index') {
    //           wx.navigateBack({
    //             delta: 2
    //           })
    //         } else {
    //           wx.navigateBack({
    //             delta: 1
    //           })
    //         }
    //       }
    //     }
    //   })
    //   return
    // }
    // }, 15000)
    var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    }))

    var buffer1 = typedArray.buffer
    let pos = 0;
    console.log(wx.getStorageSync('_serviceId') || Format.getDeviceItem('_serviceId'))
    console.log(wx.getStorageSync('_characteristicId') || Format.getDeviceItem('_characteristicId'))
    wx.writeBLECharacteristicValue({
      deviceId: wx.getStorageSync('_deviceId') || Format.getDeviceItem('_deviceId'),
      serviceId: wx.getStorageSync('_serviceId') || Format.getDeviceItem('_serviceId'),
      characteristicId: wx.getStorageSync('_characteristicId') || Format.getDeviceItem('_characteristicId'),
      value: buffer1,
      success: function (res) {
        if (funcKey === 'OTA') {
          wx.readBLECharacteristicValue({
            deviceId: wx.getStorageSync('_deviceId') || Format.getDeviceItem('_deviceId'),
            serviceId: wx.getStorageSync('_serviceId') || Format.getDeviceItem('_serviceId'),
            characteristicId: wx.getStorageSync('_characteristicId') || Format.getDeviceItem('_characteristicId'),
            success(res) {
              console.log('readBLECharacteristicValue:', res.errCode)
            }
          })
        }
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
})