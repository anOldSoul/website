//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    isShowCamera: false,
    width: 10,
    height: 10,
    src: "",
    image: "",
    skipphotoStatus: "0",// 1跳过 0没有跳过
    isShowImage: false,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  /**
 * 拍照
 */
  takePhotoAction: function () {
    var that = this
    that.ctx.takePhoto({
      quality: 'high', //高质量
      success: (res) => {
        this.loadTempImagePath(res.tempImagePath);
      },
    })
  },

  // 接口返回结果

  uploadFile: function (data) { },
  goPeople() {
    wx.navigateTo({
      url: `/pages/people/index`
    })
  },
  goVisitor() {
    wx.navigateTo({
      url: `/pages/tempRecord/index`
    })
  },
  goChart() {
    wx.navigateTo({
      url: `/pages/logs/logs`
    })
  },
  goSet() {
    wx.navigateTo({
      url: `/pages/setting/index`
    })
  },
  onShow: function () {
    var that = this
    wx.authorize({
      scope: 'scope.camera',
      success: function (res) {
        that.setData({
          isShowCamera: true,
        })
      },
      fail: function (res) {
        console.log("" + res);
        wx.showModal({
          title: '请求授权您的摄像头',
          content: '如需正常使用此小程序功能，请您按确定并在设置页面授权用户信息',
          confirmText: '确定',
          success: res => {
            if (res.confirm) {
              wx.openSetting({
                success: function (res) {
                  console.log('成功');
                  console.log(res);
                  if (res.authSetting['scope.camera']) { //设置允许获取摄像头
                    console.log('设置允许获取摄像头')
                    wx.showToast({
                      title: '授权成功',
                      icon: 'success',
                      duration: 1000
                    })
                    that.setData({
                      isShowCamera: true,
                    })

                  } else { //不允许
                    wx.showToast({
                      title: '授权失败',
                      icon: 'none',
                      duration: 1000
                    })
                    wx.redirectTo({
                      url: 'addCarInfo/addCarInfo',
                    })
                  }
                }
              })
            } else { //取消
              wx.showToast({
                title: '授权失败',
                icon: 'none',
                duration: 1000
              })
              wx.redirectTo({
                url: 'addCarInfo/addCarInfo',
              })
            }
          }
        })

      }
    })
  },
  onLoad: function () {
    // requireJs.adaptionIphoneX(this);
    this.ctx = wx.createCameraContext()
  }
})
