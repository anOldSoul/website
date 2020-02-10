// pages/install/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: 'USA', value: '非常满意' },
      { name: 'CHN', value: '满意' },
      { name: 'BRA', value: '不满意' },
    ],
    index: '0',
    array: ['D1', 'V6', 'V8']
  },
  onLoad: function (options) {

  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  }
})