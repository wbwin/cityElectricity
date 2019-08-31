// pages/my/orderManagement/orderManagement.js
import api from "../../../utils/api"
import utils from "../../../utils/utils"
var sliderWidth = 26;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["全部", "待发货","待收货","已完成"],
    activeIndex: '',
    sliderOffset: 0,
    sliderLeft: 0,
    rightIcon:'../../../images/content_more_right.png',
    shopIcon:'../../../images/25a771df8db1cb1347a6428fda54564e93584b69.jpg',
    page:1,//订单页数
    token:'',
    osscdn:'',
    orderList:[],//订单列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    let type = options.type;
    that.setData({
      activeIndex:type
    })
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
    that.setData({
      token:wx.getStorageSync('token'),
      page:1,
      orderList:[],
    })
    that.getUserOrder();
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
      token:wx.getStorageSync('token'),
      page:1,
      orderList:[],
    })
    that.getUserOrder();
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
    that.setData({
      page:1,
      orderList:[],
    })
    that.getUserOrder()
    // wx.showToast({
    //   icon:'none',
    //   title:'刷新成功'
    // })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that=this
    if(that.data.orderList.length==0){
      return false
    }
    var page=Number(that.data.page)+1
    that.setData({
      page:page,
    })
    that.getUserOrder()
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
        path: '/pages/my/my',
        imageUrl:'/images/logo.png',
      }
    }
  },
  //切换tab
  tabClick: function (e) {
    var that=this
    that.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      page:1,
      orderList:[],
    });
    that.getUserOrder()
  },
  //获取我的订单
  getUserOrder:function(){
    var that=this
    var page=that.data.page
    var order_status=Number(that.data.activeIndex)+1
    order_status=order_status==1?'':order_status
    var orderList=that.data.orderList
    utils.util.post(api.getUserOrder,{
      token:that.data.token,
      page:page,
      limit:10,
      order_status:order_status
    },res=>{
      if(res.data.list.length>0){
        var listData=res.data.list
        // for(var i in listData){
        //   listData[i].order_price=(Number(listData[i].goods_price)*Number(listData[i].order_goods_num)).toFixed(2)
        // }

        orderList=orderList.concat(listData)
        that.setData({
          osscdn:res.osscdn,
          orderList:orderList
        })
      }
      
    })
  },
  //付款
  toPay:function(e){
    var that=this
    var order_sn =e.currentTarget.dataset.order_sn
    var order_type=e.currentTarget.dataset.order_type
    utils.util.post(api.payOrder,{
      token:that.data.token,
      order_sn:order_sn
    },res=>{
      wx.requestPayment({
        timeStamp: res.data.timeStamp,
        nonceStr: res.data.nonceStr,
        package: res.data.package,
        signType: res.data.signType,
        paySign: res.data.paySign,
        success (result) {
          if(order_type==1){
            wx.redirectTo({
              url:'/pages/my/regiment/regiment?type=1'
            })
          }else{
            wx.redirectTo({
              url:'/pages/my/orderManagement/orderManagement?type=1'
            })
          }
          
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
    var i=e.currentTarget.dataset.index
    var orderData=that.data.orderList[i]
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
            setTimeout(function(){
              wx.redirectTo({
                url:'/pages/my/orderManagement/orderManagement?type=3'
              })
            },1500)
            
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  //去评价
  toOrderEvaluate:function(e){
    var that=this
    var  i=e.currentTarget.dataset.index
    var orderData=that.data.orderList[i]
    wx.navigateTo({
      url:'/pages/my/orderManagement/orderEvaluate/orderEvaluate?order_sn='+orderData.order_sn+'&goods_cover='+that.data.osscdn+orderData.goods_cover+'&goods_name='+orderData.goods_name
    })
  }
  
})