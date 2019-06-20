const app = getApp()
Component({
  properties: {
    navType: {
      type: String
    }
  },
  data: {
  },
  methods: {
    goMePage: function() {
      wx.navigateTo({
        url: '/pages/member/index'
      })
    }
  },
  ready() {
    this.setData({
      navType: this.data.navType,
      navH: app.globalData.navHeight
    })
  }
})