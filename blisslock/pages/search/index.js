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
    wx.onBluetoothDeviceFound((res) => {
      let devices = []
      res.devices.forEach(device => {
        if (device.name.toLocaleLowerCase().indexOf('blisslock') > -1 || device.name === 'HealthLock') {
          console.log('ppppppppppp')
          let devicesFond = {}
          deviceId = device.deviceId
          name = device.name
          devicesFond.deviceId = device.deviceId
          devicesFond.name = device.name         
          if (device.name === 'Blisslock') {
            wx.setStorageSync('_deviceType', 'M6')
          }
          if (device.name === 'HealthLock') {
            wx.setStorageSync('_deviceType', '健康锁')
          }
          devices.push(devicesFond)
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
    deviceId = ds.deviceId
    name = ds.name
  },
  createBLEConnection() {
    wx.showLoading({
      title: '加载中',
    })
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
  getBLEDeviceServices(deviceId = '') {
    wx.getBLEDeviceServices({
      deviceId,
      success: (res) => {
        for (let i = 0; i < res.services.length; i++) {
          if (res.services[i].isPrimary) {
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