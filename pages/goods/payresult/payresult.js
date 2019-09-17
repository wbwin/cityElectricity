// pages/goods/payresult/payresult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo:'../../../images/payresult.png',
    price:0,
    order_type:2,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    
    that.setData({
      price:options.price,
      order_type:options.order_type
    })
    console.log(options.price)
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
  onShareAppMessage: function (res) {
    var that=this
    if(res.from=="button"){
      
    }else{
      return {
        title: '同橙电商',
        path: '/pages/index/index',
        imageUrl:'/images/logo.png',
      }
    }
  },
  //去订单列表
  toOrderList(){
    var that=this
    if(that.data.order_type==1){
      wx.navigateTo({
        url:"/pages/my/regiment/regiment?type=1"
      }) 
    }else{
      wx.navigateTo({
        url:"/pages/my/orderManagement/orderManagement?type=1"
      })
    }
    
  }
})