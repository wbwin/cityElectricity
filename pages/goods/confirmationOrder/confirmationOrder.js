// pages/goods/confirmationOrder/confirmationOrder.js
var sliderWidth = 26;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*配送信息*/
    tabs: ["商家配送", "到店自取"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    /*配送信息*/
    /*地址信息*/
    addressName:'',
    addressPhone:'',
    addressMsg:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    // that.chooseAddress();
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
  //切换tab
  //选择地址
  chooseAddress:function(e){
    var that = this
    if (wx.chooseAddress) {
      wx.chooseAddress({
        success: function (res) {
          console.log(JSON.stringify(res))
          that.setData({
            addressName: res.userName,
            addressPhone: res.telNumber,
            addressMsg: res.provinceName + ' ' + res.cityName + ' ' + res.countyName + ' ' + res.detailInfo
          })
        },
        fail: function (err) {
          if (that.data.addressName===''){
            wx.navigateBack({
              delta:1
            })
          }
        }
      })
    }
  },
  //选择地址
  //显示店家地址
  openLocation:function(e){
    wx.openLocation({
      latitude: 23.136571,
      longitude: 113.295512,
      name:'绘画商贸大厦'
    })
  }
})