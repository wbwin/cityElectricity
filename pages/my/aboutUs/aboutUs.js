// pages/my/aboutUs/aboutUs.js
import config from "../../../utils/config"
import api from "../../../utils/api"
import utils from "../../../utils/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:'',
    page:1,
    dataList:'',
    showBottomTips:false,
    onShowTrue:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.setData({
      page:1
    })
    that.getPlatformInfo();
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
    const that = this;
    if(!that.data.onShowTrue){
      that.setData({
        onShowTrue:true
      })
        return false
    }
    that.setData({
      page:1
    })
    that.getPlatformInfo();
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
    })
    that.getPlatformInfo();//banner
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that=this
    if(that.data.showBottomTips||that.data.dataList.length==0){
      return false
    }
    var page=Number(that.data.page)+1
      that.setData({
        page:page
      })
      that.getPlatformInfo()
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
  getPlatformInfo () {
    let that = this;
    const token = wx.getStorageSync('token');
    var page=that.data.page
    var dataList=page==1?[]:that.data.dataList
    if(page==1){
      that.setData({
        showBottomTips:false
      })
    }
    utils.util.post(api.getPlatformInfo,{
      page:that.data.page,
      unLoading:true,
      limit:10,
      token:token
    },res=>{
      var list=res.data.list
      if(list.length>0){
        dataList=dataList.concat(list)
      
      that.setData({
        dataList:dataList,
        osscdn:res.osscdn
      })
      }else{
        that.setData({
          showBottomTips:page==1?false:true,
          dataList:dataList,
        })
      }
    })
    
  },
  toDetail:function(e){
    var that=this
    var id=e.currentTarget.dataset.id
    wx.navigateTo({
      url:'/pages/my/aboutUs/aboutUsDetail/aboutUsDetail?id='+id
    })
  }
})