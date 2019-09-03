// pages/my/afterSaleManagement/afterSaleManagement.js
import api from "../../../utils/api"
import utils from "../../../utils/utils"
var sliderWidth = 26;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["处理中", "申请记录"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    rightIcon:'../../../images/content_more_right.png',
    shopIcon:'../../../images/25a771df8db1cb1347a6428fda54564e93584b69.jpg',
    token:'',
    osscdn:'',
    page:1,//页数
    afterSaleList:[],
    showBottomTips:false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
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
    // that.setData({
    //   token:wx.getStorageSync('token'),
    //   page:1,//页数
    //   afterSaleList:[],
    // })
    // that.getUserAftersafe();
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
      page:1,//页数
    })
    that.getUserAftersafe();
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
      page:1,//页数
    })
    that.getUserAftersafe();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that=this
    if(that.data.showBottomTips){
      return false
    }
    if(that.data.afterSaleList.length==0){
      return false
    }
    var page=Number(that.data.page)+1
    that.setData({
      page:page
    })
    that.getUserAftersafe();
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
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      page:1,//页数
    });
    that.getUserAftersafe();
  },
  //查看售后详情
  checkOrderDtail:function(e){
    // console.log(e)
    const state = e.currentTarget.dataset.state
    const aftersafe_sn=e.currentTarget.dataset.aftersafe_sn
    console.log(state)
    wx.navigateTo({
      url: '/pages/my/afterSaleManagement/afterSaleDetail/afterSaleDetail?aftersafe_sn='+aftersafe_sn
    })
  },
  //获取我的售后申请
  getUserAftersafe:function(){
    var that=this
    var page=that.data.page
    var afterSaleList=page==1?[]:that.data.afterSaleList
    if(page==1){
      that.setData({
        showBottomTips:false
      })
    }
    utils.util.post(api.getUserAftersafe,{
      token:that.data.token,
      page:page,
      limit:10,
      aftersafe_status:that.data.activeIndex,
      unLoading:true,
    },res=>{
      if(res.data.list.length>0){
        afterSaleList=afterSaleList.concat(res.data.list)
        
      }else{
        that.setData({
          showBottomTips:page==1?false:true
        })
      }
      that.setData({
        afterSaleList:afterSaleList,
        osscdn:res.osscdn
      })
      
    })
  }
})