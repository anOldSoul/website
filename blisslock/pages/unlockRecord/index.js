// pages/unlockRecord/index.js
const app = getApp()
Page({
  data: {
    date: '2016-09',
    unlockRecord: []
  },
  onLoad: function (options) {
    if (options.result === 'noRecord') {
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
      return
    }
    let unlockRecordData = wx.getStorageSync('unlockRecordData') || []
    let unlockRecord = unlockRecordData.map((item, index) => {
      let type = item.slice(8, 10)
      let time = app.Moment(item.slice(22, 34), 'ssmmHHDDMMYY').format('20YY-MM-DD HH:mm:ss')
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
        time: time
      }
    })
    this.setData({
      unlockRecord: unlockRecord
    })
  },
  syncUnlockRecord: function() {
    app.util.doBLEConnection('unlockRecord')
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  }
})