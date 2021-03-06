// pages/newHome/index.js
const app = getApp()
var ds
var deviceId
var name
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
    currentIndex: 0,
    findDevice: false,
    findNoDevice: false,
    checked: true,
    devices: [],
    connected: false,
    chs: []
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
    let devices = []
    let deviceIdArr = []
    wx.onBluetoothDeviceFound((res) => {     
      res.devices.forEach(device => {
        if (device.name.toLocaleLowerCase().indexOf('blisslock') > -1) {
          if (!deviceIdArr.includes(device.deviceId)) {
            console.log('ppppppppppp')
            console.log(device)
            let devicesFond = {}
            deviceId = device.deviceId
            name = device.name
            devicesFond.deviceId = device.deviceId
            devicesFond.name = device.name
            if (device.name === 'Blisslock') {
              wx.setStorageSync('_deviceType', 'M6')
            }
            if (device.name === 'Blisslock006S') {
              wx.setStorageSync('_deviceType', 'M6-S')
            }
            if (device.name === 'HealthLock') {
              wx.setStorageSync('_deviceType', '健康锁')
            }
            deviceIdArr.push(deviceId)
            devices.push(devicesFond)
          }
          this.setData({
            devices: devices,
            findDevice: true,
            findNoDevice: false
          })
        } else {
        }
      })
      if (!this.data.devices.length) {
        this.setData({
          findNoDevice: true
        })
      }
      wx.hideLoading()
    })
  },
  currentInfo: function(e) {
    ds = e.currentTarget.dataset
    this.setData({
      currentIndex: ds.index
    })
  },
  createBLEConnection() {
    wx.showLoading({
      title: '加载中',
    })
    let currentDeviceId = this.data.devices[this.data.currentIndex].deviceId
    wx.createBLEConnection({
      deviceId: currentDeviceId,
      success: (res) => {
        console.log('bbbbbbbbbbb')
        this.setData({
          connected: true,
          name: this.data.devices[this.data.currentIndex].name,
          deviceId: currentDeviceId,
        })
        this.getBLEDeviceServices(currentDeviceId)
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
  getBLEDeviceServices(deviceId = '') {
    wx.getBLEDeviceServices({
      deviceId,
      success: (res) => {
        console.log(res)
        for (let i = 0; i < res.services.length; i++) {
          if (res.services[i].isPrimary && res.services[i].uuid.indexOf('0000FFF0') > -1) {
            console.log(deviceId)
            app.util.getBLEDeviceCharacteristics(deviceId, res.services[i].uuid)
            return
          }
        }
      }
    })
  },
  closeBluetoothAdapter() {
    wx.closeBluetoothAdapter()
    this._discoveryStarted = false
  },
  trySearch: function() {
    wx.showLoading({
      title: '加载中',
    })
    this.openBluetoothAdapter()
  },
  onLoad: function (options) {
    this.trySearch()
  },
  onShow: function () {
  },
  goDetail: function (e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/goodDetail/index?goodsId=${item.id}&eventType=selected_hot`
    })
  }
})