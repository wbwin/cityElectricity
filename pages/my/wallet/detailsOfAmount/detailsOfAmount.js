// pages/my/wallet/detailsOfAmount/detailsOfAmount.js
import api from "../../../../utils/api"
import utils from "../../../../utils/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:1,
    walletList:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    console.log(options)
    const type = options.type
    var title=type==1?'已结算金额明细':'未结算金额明细';
    wx.setNavigationBarTitle({
      title: title
    })
    that.setData({
      type:type,
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
      that.getAdminWallet()
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
        path: '/pages/my/my',
        imageUrl:'/images/logo.png',
      }
    }
  },
  //获取钱包明细
  getAdminWallet:function(){
    var that=this
    var type=that.data.type
    var is_settle=type==1?'1':'0'
    utils.util.post(api.getAdminWallet,{
      is_settle:is_settle,
      token:that.data.token,
      unLoading:true
    },res=>{
      that.setData({
        walletList:res.data.list,
        osscdn:res.osscdn
      })
    })
  },

})