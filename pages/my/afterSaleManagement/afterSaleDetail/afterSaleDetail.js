// pages/my/orderManagement/orderDetail/orderDetail.js
import api from "../../../../utils/api"
import utils from "../../../../utils/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aftersafe_sn:'',//订单编号
    token:'',
    osscdn:'',
    orderData:'',
    rightIcon:'../../../../images/content_more_right.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      aftersafe_sn:options.aftersafe_sn
    })
    
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
    var that=this
    that.setData({
      token:wx.getStorageSync('token')
    })
    that.getAftersafeDetail();
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
    var that=this
    that.getAftersafeDetail();
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
  //显示店家地址
  openLocation:function(e){
    var that=this
    var orderData=that.data.orderData
    wx.openLocation({
      latitude: Number(orderData.get_address_lat),
      longitude:  Number(orderData.get_address_lng),
      name:orderData.get_address_text,
    })
  },
  //显示店家地址
  //申请退款
  toApplyForRefund:function(e){
    var that=this
    var type=e.currentTarget.dataset.type
    wx.navigateTo({
      url: '../applyForRefund/applyForRefund?type='+type+'&order_sn='+that.data.order_sn,
    })
  },
  //去
  toOrderEvaluate:function(e){
    var that=this
    var orderData=that.data.orderData
    wx.navigateTo({
      url: '../orderEvaluate/orderEvaluate?order_sn='+that.data.order_sn+'&goods_cover='+that.data.osscdn+orderData.goods_cover+'&goods_name='+orderData.goods_name,
    })
  },
  //获取订单详情
  getAftersafeDetail:function(){
    var that=this
    var aftersafe_sn=that.data.aftersafe_sn
    utils.util.post(api.getAftersafeDetail,{
      token:that.data.token,
      aftersafe_sn:aftersafe_sn
    },res=>{
      var orderData=res.data
      // orderData.order_price=(Number(orderData.goods_price)*Number(orderData.order_goods_num)).toFixed(2)
      orderData.createtime=utils.formatTime(new Date(orderData.createtime*1000))
      orderData.paytime=utils.formatTime(new Date(orderData.paytime*1000))
      orderData.aftersafe_img_json=JSON.parse(orderData.aftersafe_img_json)
      that.setData({
        osscdn:res.osscdn,
        orderData:orderData
      })
    })
  },
  //付款
  toPay:function(e){
    var that=this
    var orderData=that.data.orderData
    utils.util.post(api.payOrder,{
      token:that.data.token,
      order_sn:orderData.order_sn
    },res=>{
      wx.requestPayment({
        timeStamp: res.data.timeStamp,
        nonceStr: res.data.nonceStr,
        package: res.data.package,
        signType: res.data.signType,
        paySign: res.data.paySign,
        success (result) { 
         that.getAftersafeDetail();
        },
        fail (res) {
          wx.showToast({
            icon:'none',
            title:'订单支付失败'
          })
         }
      })
    })
  },
  //确认收货
  sureHave:function(e){
    var that=this
    var orderData=that.data.orderData
    wx.showModal({
      title: '提示',
      content: orderData.logistics_action==2?'是否确认自提？':'是否确认收货？',
      success (res) {
        if (res.confirm) {
          
          utils.util.post(api.completeOrder,{
            token:that.data.token,
            order_sn:orderData.order_sn,
          },res=>{
            wx.showToast({
              icon:'none',
              title:orderData.logistics_action==2?'确认自提成功':'确认收货成功',
            })
            that.getAftersafeDetail();
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
})