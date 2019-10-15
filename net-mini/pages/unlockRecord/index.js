// pages/unlockRecord/index.js
const app = getApp()
Page({
  data: {
    month: app.Moment().format('YYYY-MM'),
    currentMonthData: [{
      date: '01-20  19:42',
      recordArr: [{
        lockType: '指纹开锁',
        month: '2019-10',
        time: '111111'
      }]
    }, {
        date: '01-20  19:42',
        recordArr: [{
          lockType: '指纹开锁',
          month: '2019-10',
          time: '111111'
        }]
      }, {
        date: '01-20  19:42',
        recordArr: [{
          lockType: '指纹开锁',
          month: '2019-10',
          time: '111111'
        }]
      }],
    unlockRecord: [],
    type: ''
  },
  onShow: function() {
    // let hasUnlockRecord = app.util.getDeviceItem('hasUnlockRecord')
    // if (hasUnlockRecord === 'noRecord') {
    //   app.util.updateDeviceList('hasUnlockRecord', '')
    //   wx.showModal({
    //     title: '提示',
    //     content: '锁体中没有开锁记录数据！',
    //     showCancel: false,
    //     success(res) {
    //       if (res.confirm) {
    //         console.log('用户点击确定')
    //       } else if (res.cancel) {
    //         console.log('用户点击取消')
    //       }
    //     }
    //   })
    // }
    // if (hasUnlockRecord === 'hasRecord') {
    //   app.util.updateDeviceList('hasUnlockRecord', '')
    //   wx.showToast({
    //     title: '同步成功',
    //     icon: 'success',
    //     duration: 2000
    //   })
    // }
    // let unlockRecordData = app.util.getDeviceItem('unlockRecordData')|| []
    // let unlockRecord
    // let dateArr = []
    // if (unlockRecordData instanceof Array) {
    //   unlockRecord = unlockRecordData.map((item, index) => {
    //     let type = item.slice(8, 10)
    //     let userType = item.slice(18, 20)
    //     let time = app.Moment(item.slice(22, 34), 'ssmmHHDDMMYY').format('HH:mm:ss')
    //     let date = app.Moment(item.slice(22, 34), 'ssmmHHDDMMYY').format('20YY-MM-DD')
    //     let month = app.Moment(item.slice(22, 34), 'ssmmHHDDMMYY').format('20YY-MM')
    //     dateArr.push(date)
    //     let lockType
    //     if (type === '23') {
    //       lockType = '指纹开锁'
    //     }
    //     if (type === '24') {
    //       lockType = '本地密码'
    //     }
    //     if (type === '25') {
    //       lockType = '临时密码'
    //     }
    //     if (type === '13') {
    //       lockType = '添加指纹'
    //     }
    //     if (type === '14') {
    //       lockType = '添加密码'
    //     }
    //     if (type === '15') {
    //       lockType = '添加蓝牙'
    //     }
    //     if (type === '03') {
    //       lockType = '删除指纹'
    //     }
    //     if (type === '04') {
    //       lockType = '删除密码'
    //     }
    //     if (type === '05') {
    //       lockType = '删除蓝牙'
    //     }
    //     if (type === '02') {
    //       lockType = '恢复出厂设置'
    //     }
    //     if (type === '30') {
    //       lockType = '低电量报警'
    //     }
    //     if (type === '31') {
    //       lockType = '连续试错报警'
    //     }
    //     if (type === '32') {
    //       lockType = '防撬报警'
    //     }
    //     if (type === '33') {
    //       lockType = '指纹防劫持报警'
    //     }
    //     if (type === '34') {
    //       lockType = '密码防劫持报警'
    //     }
    //     if (userType === '00') {
    //       userType = '普通用户'
    //     }
    //     if (userType === '01') {
    //       userType = '管理员'
    //     }
    //     if (userType === '02') {
    //       userType = '防劫持用户'
    //     }
    //     return {
    //       lockType: lockType || '未知',
    //       userType: userType,
    //       time: time,
    //       month: month,
    //       date: date
    //     }
    //   })
    // } else {
    //   unlockRecord = []
    // }
    // dateArr = [...new Set(dateArr)]
    // let newUnlockRecord = []
    // dateArr.forEach((item, index) => {
    //   newUnlockRecord[index] = {}
    //   newUnlockRecord[index].date = item
    //   newUnlockRecord[index].recordArr = []
    //   unlockRecord.forEach((item1, index1) => {
    //     if (item === item1.date) {
    //       newUnlockRecord[index].recordArr.push(item1)
    //       newUnlockRecord[index].month = item1.month
    //     }
    //   })
    // })
    // this.data.unlockRecord = newUnlockRecord.reverse()
    // this.setData({
    //   currentMonthData: this.data.unlockRecord.filter((item, index) => {
    //     return item.month === this.data.month
    //   })
    // })
  },
  onLoad: function (options) {
    // let type = options.type
    // if (type) {
    //   this.setData({
    //     type
    //   })
    //   this.getData()
    // }
  },
  getData: function() {
    app.post(app.Apis.GET_UNLOCK_RECORD, {}, result => {
      let resultData = result.data
      let dateArr = []
      let unlockRecord = resultData.map((item, index) => {
        let month = app.Moment(item.dataCheck.time, 'ssmmHHDDMMYYYY').format('YYYY-MM')
        let date = app.Moment(item.dataCheck.time, 'ssmmHHDDMMYYYY').format('YYYY-MM-DD')
        let time = app.Moment(item.dataCheck.time, 'ssmmHHDDMMYYYY').format('HH:mm:ss')
        dateArr.push(date)
        return {
          lockType: item.dataCheck.openstat,
          time: time,
          month: month,
          date: date,
          ele: item.dataCheck.ele,
          warnstat: item.dataCheck.warnstat,
          keystat: item.dataCheck.keystat
        }
      })
      console.log(unlockRecord)
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
    })
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