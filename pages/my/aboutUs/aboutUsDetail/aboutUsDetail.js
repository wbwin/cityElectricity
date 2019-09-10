// pages/my/aboutUs/aboutUs.js
import config from "../../../../utils/config"
import api from "../../../../utils/api"
import utils from "../../../../utils/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:'',
    id:'',
    data:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.setData({
      id:options.id
    })
    that.getPlatformInfoDetail();
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
    const that = this;
    that.getPlatformInfoDetail();
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
  //获取关于我们信息
  getPlatformInfoDetail () {
    let that = this;
    const token = wx.getStorageSync('token');
    utils.util.post(api.getPlatformInfoDetail,{
      unLoading:true,
      token:token,
      id:that.data.id
    },res=>{
      var data=res.data
      data.content=data.content.replace('<img', '<img style="max-width:100%;height:auto" ')
      that.setData({
        data:res.data
      })
    })
  }
})