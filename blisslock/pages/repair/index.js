// pages/addDevice/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: 'USA', value: '指纹开不了锁' },
      { name: 'CHN', value: '密码开不了锁' },
      { name: 'BRA', value: '锁体没有电了' },
      { name: 'BRA', value: '其他故障描述' }
    ]
  },
  callPhone: function() {
    wx.makePhoneCall({
      phoneNumber: '4001191196',
    })
  }
})