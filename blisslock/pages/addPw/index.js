const app = getApp()
var dateTimePicker = require('../../utils/dateTimePicker.js')
Page({
  data: {
    index: '0',
    validIndex: '0',
    date: '2018-10-01',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    endYear: 2050,
    array: ['普通用户', '防劫持用户'],
    validArray: ['永久有效', '临时有效'],
    userName: '',
    password: ''
  },
  onLoad: function (options) {
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();

    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });
  },
  changeDateTime1(e) {
    this.setData({ dateTime1: e.detail.value });
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  },
  dateTimePicker: function (startYear, endYear, date) {
    // 返回默认显示的数组和联动数组的声明
    var dateTime = [], dateTimeArray = [[], [], [], [], [], []];
    var start = startYear || 1978;
    var end = endYear || 2100;
    // 默认开始显示数据
    var defaultDate = date ? [...date.split(' ')[0].split('-'), ...date.split(' ')[1].split(':')] : getNewDateArry();
    // 处理联动列表数据
    /*年月日 时分秒*/
    dateTimeArray[0] = getLoopArray(start, end);
    dateTimeArray[1] = getLoopArray(1, 12);
    dateTimeArray[2] = getMonthDay(defaultDate[0], defaultDate[1]);
    dateTimeArray[3] = getLoopArray(0, 23);
    dateTimeArray[4] = getLoopArray(0, 59);
    dateTimeArray[5] = getLoopArray(0, 59);

    dateTimeArray.forEach((current, index) => {
      dateTime.push(current.indexOf(defaultDate[index]));
    });

    return {
      dateTimeArray: dateTimeArray,
      dateTime: dateTime
    }
  },
  bindPickerValidChange: function (e) {
    this.setData({
      validIndex: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  goNext: function() {
    if (!this.data.userName) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.password.length < 6) {
      wx.showToast({
        title: '请输入6-12位数字密码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let time = ''
    if (this.data.index === '0' && this.data.validIndex === '1') {
      time = `${this.data.dateTimeArray1[0][this.data.dateTime1[0]]}-${this.data.dateTimeArray1[1][this.data.dateTime1[1]]}-${this.data.dateTimeArray1[2][this.data.dateTime1[2]]} ${this.data.dateTimeArray1[3][this.data.dateTime1[3]]}:${this.data.dateTimeArray1[4][this.data.dateTime1[4]]}`
    }
    wx.navigateTo({
      url: `/pages/activateDevice/index?func=addPw&pw=${this.data.password}&name=${this.data.userName}&userType=${this.data.index}&validDate=${time}`
    })
  },
  bindUserNameInput: function(e) {
    this.data.userName = e.detail.value
  },
  bindKeyInput: function (e) {
    this.data.password = e.detail.value
  },
  onShow: function () {

  }
})