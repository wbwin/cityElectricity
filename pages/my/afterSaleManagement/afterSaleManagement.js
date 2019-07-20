// pages/my/afterSaleManagement/afterSaleManagement.js
var sliderWidth = 26;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["处理中", "申请记录"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    rightIcon:'../../../images/content_more_right.png',
    shopIcon:'../../../images/25a771df8db1cb1347a6428fda54564e93584b69.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    /*切换*/
    wx.getSystemInfo({
      success: function (res) {
        /**
        * sliderLeft 选中览的位置
        * sliderOffset 偏移多少
        * sliderWidth 导航栏的宽度
        */
        that.setData({
          sliderLeft: (res.windowWidth / 2 - sliderWidth) / 2,
          sliderOffset: res.windowWidth / 2 * that.data.activeIndex
        });
      }
    });
    /*切换*/
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
  //切换tab
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  //查看售后详情
  checkOrderDtail:function(e){
    // console.log(e)
    const state = e.currentTarget.dataset.state
    console.log(state)
    wx.navigateTo({
      url: '/pages/my/orderManagement/orderDetail/orderDetail?state='+state
    })
  }
})