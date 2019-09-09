// pages/my/addAddress/addAddress.js
import api from "../../utils/api"
import utils from "../../utils/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openOther:false,
    type:0,//0为店铺粉丝数，1位商品围观人数
    shop_id:'',
    goods_id:'',
    token:'',
    osscdn:'',
    count:0,//数量
    list:'',//列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    console.log(options.type)
    that.setData({
      type:options.type,
      shop_id:options.shop_id,
      goods_id:options.goods_id
    })
    var _title=that.data.type==0?'店铺粉丝数':'围观人数'
    wx.setNavigationBarTitle({
      title: _title
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
    // that.onLoad()
    that.setData({
      token:wx.getSystemInfo("token")
    })
    if(that.data.type==0){
      that.getShopDetail()
    }else{
      that.goodsDetail()
    }
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
    if(that.data.type==0){
      that.getShopDetail()
    }else{
      that.goodsDetail()
    }
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
        path: '/pages/my/my',
        imageUrl:'/images/logo.png',
      }
    }
  },
  openOther:function(e){
    var that=this
    that.setData({
      openOther:true
    })
  },
  /*获取店铺详情*/
  getShopDetail:function(e){
    const that = this;
    const token = wx.getStorageSync('token');
    utils.util.post(api.getShopDetail,{
      token:token,
      shop_id:that.data.shop_id,
      unLoading:true,
    },res=>{
      var shop = res.data.shop;

      that.setData({
        osscdn:res.osscdn,
        count:shop.fans_count,
        list:shop.fans
      })
    })
    
  },
  //获取商品详情
  goodsDetail:function(){
    const that = this;
    utils.util.post(api.goodsDetail,{
      goods_id:that.data.goods_id,
      token:wx.getStorageSync('token'),
      shop_id:that.data.shop_id,
      unLoading:true,
    },res=>{
      that.setData({
        osscdn:res.osscdn,
        count:res.data.browse_count,
        list:res.data.browse
      })
    })
  },
})