// pages/commodityCollection/commodityCollection.js
import api from "../../../utils/api"
import utils from "../../../utils/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:'',
    osscdn:'',
    page:1,
    goodsData:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    // that.setData({
    //   token:wx.getStorageSync('token'),
    //   page:1,
    //   goodsData:[],
    // })
    // that.getUserCollect();
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
      goodsData:[],
    })
    that.getUserCollect();
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
      goodsData:[],
    })
    that.getUserCollect();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that=this
    if(that.data.goodsData.length==0){
      return false
    }
    var page=Number(that.data.page)+1
    that.setData({
      page:page,
    })
    that.getUserCollect();
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
  getUserCollect:function(){
    var that=this
    var goodsData=that.data.goodsData
    utils.util.post(api.getUserCollect,{
      token:that.data.token,
      page:that.data.page,
      limit:10,
    },res=>{
      var list=res.data.list
      if(list.length>0){
        goodsData=goodsData.concat(list)
      }
      that.setData({
        goodsData:goodsData,
        osscdn:res.osscdn
      })
    })
  },
  //前往商品详情
  toOrderDetail:function(e){
    var that=this
    var shop_id=e.currentTarget.dataset.shop_id
    var goods_id=e.currentTarget.dataset.goods_id
    wx.navigateTo({
      url:'/pages/goods/goods?shop_id='+shop_id+'&goods_id='+goods_id
    })
  },
  //取消收藏
  cancalCollect:function(e){
    var that=this
    var shop_id=e.currentTarget.dataset.shop_id
    var goods_id=e.currentTarget.dataset.goods_id
    var index=e.currentTarget.dataset.index
    var goodsData=that.data.goodsData
    wx.showModal({
      title: '提示',
      content: '是否取消收藏该商品？',
      success (res) {
        if (res.confirm) {
          utils.util.post(api.setGoodsCollect,{
            shop_id:shop_id,
            goods_id:goods_id,
            collect_status:0,
            token:that.data.token
          },res=>{
            wx.showToast({
              icon:'none',
              title:'取消收藏成功'
            })
            goodsData.splice(index,1)
            that.setData({
              goodsData:goodsData
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
   
  },
  //去逛逛
  buttonUrl:function(){
    wx.switchTab({
      url:'/pages/find/find'
    })
  }
})