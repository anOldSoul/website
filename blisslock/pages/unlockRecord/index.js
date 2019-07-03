// pages/unlockRecord/index.js
const app = getApp()
Page({
  data: {
    month: app.Moment().format('YYYY-MM'),
    currentMonthData: [],
    unlockRecord: []
  },
  onShow: function() {
    let hasUnlockRecord = app.util.getDeviceItem('hasUnlockRecord')
    if (hasUnlockRecord === 'noRecord') {
      app.util.updateDeviceList('hasUnlockRecord', '')
      wx.showModal({
        title: '提示',
        content: '锁体中没有开锁记录数据！',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    if (hasUnlockRecord === 'hasRecord') {
      app.util.updateDeviceList('hasUnlockRecord', '')
      wx.showToast({
        title: '同步成功',
        icon: 'success',
        duration: 2000
      })
    }
    let unlockRecordData = app.util.getDeviceItem('unlockRecordData')|| []
    let unlockRecord
    let dateArr = []
    if (unlockRecordData instanceof Array) {
      unlockRecord = unlockRecordData.map((item, index) => {
        console.log(item)
        let type = item.slice(8, 10)
        let time = app.Moment(item.slice(22, 34), 'ssmmHHDDMMYY').format('HH:mm:ss')
        let date = app.Moment(item.slice(22, 34), 'ssmmHHDDMMYY').format('20YY-MM-DD')
        let month = app.Moment(item.slice(22, 34), 'ssmmHHDDMMYY').format('20YY-MM')
        dateArr.push(date)
        let lockType
        if (type === '23') {
          lockType = '指纹开锁'
        }
        if (type === '24') {
          lockType = '本地密码'
        }
        if (type === '25') {
          lockType = '临时密码'
        }
        return {
          lockType: lockType,
          time: time,
          month: month,
          date: date
        }
      })
    } else {
      unlockRecord = []
    }
    dateArr = [...new Set(dateArr)]
    let newUnlockRecord = []
    dateArr.forEach((item, index) => {
      newUnlockRecord[index] = {}
      newUnlockRecord[index].date = item
      newUnlockRecord[index].recordArr = []
      unlockRecord.forEach((item1, index1) => {
        if (item === item1.date) {
          newUnlockRecord[index].recordArr.push(item1)
          newUnlockRecord[index].month = item1.month
        }
      })
    })
    this.data.unlockRecord = newUnlockRecord.reverse()
    this.setData({
      currentMonthData: this.data.unlockRecord.filter((item, index) => {
        return item.month === this.data.month
      })
    })
  },
  onLoad: function (options) {
  },
  syncUnlockRecord: function() {
    app.util.doBLEConnection('unlockRecord')
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let currentMonth = e.detail.value
    let unlockRecord = this.data.unlockRecord.filter((item, index) => {
      return item.month === currentMonth
    })
    this.setData({
      month: currentMonth,
      currentMonthData: unlockRecord
    })
  }
})