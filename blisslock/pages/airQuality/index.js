// pages/newHome/index.js
const app = getApp()
Page({
  data: {
    test: true
  },
  onLoad: function (options) {
    console.log('airData~~~~~~~~~~~~~~~~~~~~~')
    console.log(options.airData)
    let data = '2222132222222222233333333333'
    let co2 = Math.floor((Math.random()*10)+1)
    console.log(co2)
    let tvoc = (this.formatHexToDec(data.slice(4, 6)) * 256 + this.formatHexToDec(data.slice(6, 8)))/10.0
    console.log(tvoc)
    let ch2o = (this.formatHexToDec(data.slice(8, 10)) * 256 + this.formatHexToDec(data.slice(10, 12))) / 10.0
    console.log(ch2o)
    let PM = Math.floor((Math.random()*10)+1)
    console.log(PM)
    let SRH = (this.formatHexToDec(data.slice(16, 18)) * 256 + this.formatHexToDec(data.slice(18, 20)))
    let Humidity = Math.floor((Math.random()*10)+1)
    console.log(parseInt(Humidity))
    let STM = (this.formatHexToDec(data.slice(20, 22)) * 256 + this.formatHexToDec(data.slice(22, 24)))
    let Temperature = parseInt((175.72 * STM / Math.pow(2, 16)) - 46.85)
    console.log(Temperature)
    let PM10 = Math.floor((Math.random()*10)+1)
    console.log(PM10)
    this.setData({
      airData: {
        co2: '清新' || '浑浊' || '缺氧',
        tvoc: tvoc < 4 ? '安全' : '不适',
        ch2o: (ch2o / 1000000) < 0.5 ? 'E0' : (ch2o < 1.5 ? 'E1' : 'E2'),
        PM: PM < 4 ? '良' : (PM < 8 ? '优' : '中'),
        Humidity: Humidity < 0 ? 52 : Humidity + 10,
        Temperature: Temperature < 0 ? 24 : Temperature,
        PM10: PM10 < 4 ? '优' : '良'
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