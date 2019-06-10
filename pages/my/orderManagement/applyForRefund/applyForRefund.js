// pages/my/orderManagement/applyForRefund/applyForRefund.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    voucherImage:[],
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
  //选择店铺图片
  chooseVoucherImages: function (e) {
    var that = this
    var voucherImage = that.data.voucherImage
    wx.chooseImage({
      count: 3 - voucherImage.length,
      success: function (res) {
        voucherImage = voucherImage.concat(res.tempFilePaths)
        that.setData({
          voucherImage: voucherImage
        })
      },
    })
  },
  //选择店铺图片
})