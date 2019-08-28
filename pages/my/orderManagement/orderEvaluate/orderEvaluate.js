// pages/my/orderManagement/orderManagement.js
import api from "../../../../utils/api"
import utils from "../../../../utils/utils"
var sliderWidth = 26;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    evaluate_text:'',//评论内容
    evaluate_text_length:0,//评论长度
    order_sn:'',
    osscdn:'',
    goods_cover:'',
    goods_name:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      order_sn:options.order_sn,
      goods_cover:options.goods_cover,
      goods_name:options.goods_name
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
    // wx.showToast({
    //   icon:'none',
    //   title:'刷新成功'
    // })
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
  //输入框
  textareaInput:function(e){
    var that=this
    that.setData({
      evaluate_text:e.detail.value,
      evaluate_text_length:e.detail.value.length
    })
  },
  //提交评价
  submit:function(e){
    var that=this
    var evaluate_text=that.data.evaluate_text
    if(evaluate_text==''){
      wx.showToast({
        icon:'none',
        title:'请先填写评价内容'
      })
      return false
    }
    utils.util.post(api.addOrderComment,{
      token:that.data.token,
      content:evaluate_text,
      order_sn:that.data.order_sn
    },res=>{
      wx.showToast({
        icon:'none',
        title:'评价成功'
      })
      setTimeout(()=>{
        wx.navigateBack({
          delta:1
        })
      },1500)
    })
  }
 
})