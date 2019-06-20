// pages/addDevice/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  callPhone: function() {
    wx.makePhoneCall({
      phoneNumber: '4001191196',
    })
  }
})