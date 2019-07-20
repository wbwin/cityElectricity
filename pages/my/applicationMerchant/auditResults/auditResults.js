// pages/my/applicationMerchant/auditResults/auditResults.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    apply_success:'/images/apply-success.png',
    apply_fail:'/images/apply-fail.png',
    apply_state:false
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 提交申请失败，重新提交信息
  submitInfo:function () {
    wx.redirectTo({
      url: '/pages/my/applicationMerchant/applicationMerchant'
    })
  }  
})