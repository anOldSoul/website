// pages/unlockRecord/index.js
const app = getApp()
Page({
  data: {
    month: app.Moment().format('YYYY-MM'),
    currentMonthData: [],
    unlockRecord: [],
    type: ''
  },
  onShow: function() {
    let hasUnlockRecord = app.util.getDeviceItem('hasUnlockRecord')
    if (hasUnlockRecord === 'noRecord') {
      app.util.updateDeviceList('hasUnlockRecord', '')
      wx.showModal({
        title: '提示',
        content: '锁体中暂无新开门记录数据',
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
        let type = item.slice(8, 10)
        let userType = ''
        let tempTime
        if (item.slice(32, 34) === '00') {
          tempTime = `${item.slice(22, 32)}${app.Moment().format('YY')}`
        } else {
          tempTime = item.slice(22, 34)
        }
        let time = app.Moment(tempTime, 'ssmmHHDDMMYY').format('HH:mm:ss')
        let date = app.Moment(tempTime, 'ssmmHHDDMMYY').format('20YY-MM-DD')
        let month = app.Moment(tempTime, 'ssmmHHDDMMYY').format('20YY-MM')
        dateArr.push(date)
        let lockType = ''
        let id = ''
        if (type === '23') {
          lockType = '指纹开锁'
          let tempId = item.slice(10, 18)
          id = app.util.hexToFromBytes(tempId)
        }
        if (type === '24') {         
          let tempId = item.slice(18, 22)
          if (tempId === '1001') {
            id = '1001'
            lockType = '临时密码开锁'
          } else {
            id = tempId.replace(/[f]/g, '')
            lockType = '本地密码开锁'
          }
        }
        if (type === '25') {
          lockType = '临时密码'
        }
        if (type === '13') {
          lockType = '添加指纹'
        }
        if (type === '14') {
          lockType = '添加密码'
        }
        if (type === '15') {
          lockType = '添加蓝牙'
        }
        if (type === '03') {
          lockType = '删除指纹'
        }
        if (type === '04') {
          lockType = '删除密码'
        }
        if (type === '05') {
          lockType = '删除蓝牙'
        }
        if (type === '02') {
          lockType = '恢复出厂设置'
        }
        if (type === '30') {
          lockType = '低电量报警'
        }
        if (type === '31') {
          lockType = '连续试错报警'
        }
        if (type === '32') {
          lockType = '防撬报警'
        }
        if (type === '33') {
          lockType = '指纹防劫持报警'
        }
        if (type === '34') {
          lockType = '密码防劫持报警'
        }
        if (type === '13' || type === '14' || type === '15' || type === '03') {
          let userTypeCode = item.slice(18, 20)
          if (userTypeCode === '00') {
            userType = '普通用户'
          }
          if (userTypeCode === '01') {
            userType = '管理员'
          }
          if (userTypeCode === '02') {
            userType = '防劫持用户'
          }
        }
        if (id) {
          let num = 4 - id.length
          for (let i = 0; i < num; i++) {
            id = '0' + id
          }
        }
        return {
          lockType: lockType || '未知',
          userType: userType,
          time: time,
          month: month,
          date: date,
          id: id
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
          newUnlockRecord[index].recordArr.unshift(item1)
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
    this.setData({
      deviceType: app.util.getDeviceItem('type')
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