// pages/newHome/index.js
const app = getApp()
Page({
  data: {
    test: true
  },
  onLoad: function (options) {
    console.log('airData~~~~~~~~~~~~~~~~~~~~~')
    console.log(options.airData)
    let data = options.airData
    let co2 = this.formatHexToDec(data.slice(0, 2)) * 256 + this.formatHexToDec(data.slice(2, 4))
    console.log(co2)
    let tvoc = (this.formatHexToDec(data.slice(4, 6)) * 256 + this.formatHexToDec(data.slice(6, 8)))/10.0
    console.log(tvoc)
    let ch2o = (this.formatHexToDec(data.slice(8, 10)) * 256 + this.formatHexToDec(data.slice(10, 12))) / 10.0
    console.log(ch2o)
    let PM = (this.formatHexToDec(data.slice(12, 14)) * 256 + this.formatHexToDec(data.slice(14, 16)))
    console.log(PM)
    let SRH = (this.formatHexToDec(data.slice(16, 18)) * 256 + this.formatHexToDec(data.slice(18, 20)))
    let Humidity = (125 * SRH / Math.pow(2, 16)) - 6
    console.log(Humidity)
    let STM = (this.formatHexToDec(data.slice(20, 22)) * 256 + this.formatHexToDec(data.slice(22, 24)))
    let Temperature = parseInt((175.72 * STM / Math.pow(2, 16)) - 46.85)
    console.log(Temperature)
    let PM10 = (this.formatHexToDec(data.slice(24, 26)) * 256 + this.formatHexToDec(data.slice(26, 28)))
    console.log(PM10)
    this.setData({
      airData: {
        co2: co2 < 1000 ? '清新' : (co2 < 2000 ? '浑浊' : '缺氧'),
        tvoc: (PM10/1000) < 0.6 ? '安全' : '不适',
        ch2o: (ch2o / 1000000) < 0.5 ? 'E0' : (ch2o < 1.5 ? 'E1' : 'E2'),
        PM: PM < 35 ? '优' : (PM < 75 ? '良' : '中'),
        Humidity: parseInt(Humidity),
        Temperature,
        PM10: PM10 < 150 ? '优' : '良'
      }
    })
    console.log(this.data.airData.Humidity)
  },
  formatHexToDec: function(hex) {
    return parseInt(hex, 16)
  },
  onShow: function () {
  }
})