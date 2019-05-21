// pages/issueFeedback/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordnumber:100,
    phoneNum:null,
    feedbackIssue:'',
    disabled:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },
  /**
   *  手机号码输入
   */
  phoneNumberInput(e){
    this.setData({phoneNum: e.detail.value})
  },

  /**
   *  问题反馈输入
   */
  issueInputAction(e){
    let issue = e.detail.value
    this.setData({
      wordnumber: 100 - issue.length,
      feedbackIssue: issue,
      disabled: issue.length < 10
    })
  },
  
  /**
   *  点击反馈按钮
   */
  clickFeedbackAction(){
    wx.showLoading({
      title: '正在提交反馈...',
    })
    if(!this.data.disabled){
      app.post(app.Apis.POST_ISSUE_FEEDBACK,{
        userId: wx.getStorageSync('YJF_UERID'),
        storeId: wx.getStorageSync('YJF_STORE_ID'),
        userName: this.data.phoneNum,
        content: this.data.feedbackIssue
      },res=>{
        console.log(res)
        wx.hideLoading()
        if(res.success){
          wx.showToast({
            title: '反馈成功',
            duration:2000,
            icon: null
          })
          setTimeout(()=>{
            wx.navigateBack({})
          },2000)
        }else{
          wx.showToast({
            title: '反馈失败,请再试一次！',
            duration: 2000,
            icon: 'none'
          })
        }
      })
    }
  }

})