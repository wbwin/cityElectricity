// pages/my/wallet/cashWithdrawal/cashWithdrawal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: '', //可提现的金额
    if_withdrawal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.money)
    const that = this
    const money = options.money
    if (money > 100) {
      that.setData({
        money: money,
        if_withdrawal: true
      })
    } else {
      that.setData({
        money: money
      })
    }

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
  //提现记录
  record:function(){
    wx.navigateTo({
      url: '/pages/my/wallet/discountRecord/discountRecord'
    })
  }
})