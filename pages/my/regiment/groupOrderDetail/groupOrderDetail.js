// pages/my/orderManagement/orderDetail/orderDetail.js
import api from "../../../../utils/api"
import utils from "../../../../utils/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_sn:'',//订单编号
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
      order_sn:options.order_sn
    })
    var a=0
    if(a == 1?false:a==0?false:''){
      console.log(12)
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
    var that=this
    that.setData({
      token:wx.getStorageSync('token')
    })
    that.getGroupDetail();
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
    that.getGroupDetail();
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
      var orderData=that.data.orderData
      return {
        title: '一起来拼团吧',
        path: '/pages/goods/goods?shop_id='+orderData.shop_id+'&goods_id='+orderData.goods_id,
        imageUrl:that.data.osscdn+orderData.goods_cover
      }
    }else{
      return {
        title: '同橙电商',
        path: '/pages/my/my',
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
  getGroupDetail:function(){
    var that=this
    var order_sn=that.data.order_sn
    utils.util.post(api.getGroupDetail,{
      token:that.data.token,
      order_sn:order_sn
    },res=>{
      var orderData=res.data
      // orderData.order_price=(Number(orderData.goods_price)*Number(orderData.order_goods_num)).toFixed(2)
      orderData.createtime=utils.formatTime(new Date(orderData.createtime*1000))
      orderData.paytime=utils.formatTime(new Date(orderData.paytime*1000))
      if(orderData.shiptime){
        var remainingTime=7*86400000+orderData.shiptime*1000
        remainingTime=utils.intervalTime(new Date().getTime(),remainingTime)
        orderData.remainingTime=remainingTime
      }
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
         that.getGroupDetail();
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
      content:orderData.logistics_action==2? '是否确认自提？':'是否确认收货？',
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
            that.getGroupDetail();
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
})