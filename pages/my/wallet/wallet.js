// pages/my/wallet/wallet.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  cashWithdrawal: function (e) {
    wx.navigateTo({
      url: './cashWithdrawal/cashWithdrawal?money=200',
    })
  },
  //查看明细 已结算金额和未结算金额
  record: function (e) {
    console.log(e)
    const id = e.currentTarget.dataset.id
    if (id == 1) {
      wx.navigateTo({
        url: '/pages/my/wallet/detailsOfAmount/detailsOfAmount?title=已结算金额明细'
      })
    }
    if (id == 2) {
      wx.navigateTo({
        url: '/pages/my/wallet/detailsOfAmount/detailsOfAmount?title=未结算金额明细'
      })
    }

  }
})