// pages/my/wallet/discountRecord/discountRecord.js
import api from "../../../../utils/api"
import utils from "../../../../utils/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    infoList:[],
    showBottomTips:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    })
    that.getWithdrawInfo()
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
    that.show()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that=this

    if(that.data.infoList.length==0||that.data.showBottomTips){
      return false
    }
    var page=Number(that.data.page)+1
    that.setData({
      page:page,
    })
    that.getWithdrawInfo()
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
  //获取提现发起记录
  getWithdrawInfo:function(){
    var that=this
    var infoList=that.data.page==1?[]:that.data.infoList
    if(that.data.page==1){
      that.setData({
        showBottomTips:false
      })
    }
    utils.util.post(api.getWithdrawInfo,{
      page:that.data.page,
      limit:10,
      token:that.data.token,
      unLoading:true
    },res=>{
      var list=res.data.list
      if(list.length>0){
        infoList=infoList.concat(list)
        that.setData({
          infoList:infoList,
        })
      }else{
        that.setData({
          showBottomTips:page==1?false:true
        })
      }
    })
  }
})