// pages/unlockRecord/index.js
const app = getApp()
Page({
  data: {
    date: app.Moment().format('YYYY-MM'),
    currentMonthData: [],
    unlockRecord: []
  },
  onShow: function() {
    if (wx.getStorageSync('hasUnlockRecord') === 'noRecord') {
      wx.setStorageSync('hasUnlockRecord', '')
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
    if (wx.getStorageSync('hasUnlockRecord') === 'hasRecord') {
      wx.setStorageSync('hasUnlockRecord', '')
      wx.showToast({
        title: '同步成功',
        icon: 'success',
        duration: 2000
      })
    }
    let unlockRecordData = wx.getStorageSync('unlockRecordData') || []
    let unlockRecord
    if (unlockRecordData instanceof Array) {
      unlockRecord = unlockRecordData.map((item, index) => {
        let type = item.slice(8, 10)
        let time = app.Moment(item.slice(22, 34), 'ssmmHHDDMMYY').format('HH:mm:ss')
        let date = app.Moment(item.slice(22, 34), 'ssmmHHDDMMYY').format('20YY-MM-DD')
        let month = app.Moment(item.slice(22, 34), 'ssmmHHDDMMYY').format('20YY-MM')
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
    console.log(unlockRecord)
    this.data.unlockRecord = unlockRecord
    this.setData({
      currentMonthData: unlockRecord.filter((item, index) => {
        return item.month === this.data.date
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
      date: currentMonth,
      currentMonthData: unlockRecord
    })
  }
})