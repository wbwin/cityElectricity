// pages/my/wallet/wallet.js
import api from "../../../utils/api"
import utils from "../../../utils/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:'',
    userInfo:'',
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
      token:wx.getStorageSync('token')
    })
    that.getUserInfo()
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
    that.getUserInfo()
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
  cashWithdrawal: function (e) {
    var that=this
    wx.navigateTo({
      url: './cashWithdrawal/cashWithdrawal?money='+that.data.userInfo.settled_money,
    })
  },
  //查看明细 已结算金额和未结算金额
  record: function (e) {
    console.log(e)
    const id = e.currentTarget.dataset.id
    if (id == 1) {
      wx.navigateTo({
        url: '/pages/my/wallet/detailsOfAmount/detailsOfAmount?type=1'
      })
    }
    if (id == 2) {
      wx.navigateTo({
        url: '/pages/my/wallet/detailsOfAmount/detailsOfAmount?type=2'
      })
    }

  },
  getUserInfo:function(){
    var that=this
    utils.util.post(api.getUserInfo,{
      token:that.data.token,
      unLoading:true
    },res=>{
      that.setData({
        userInfo:res.data,
      })
    })
  }
})