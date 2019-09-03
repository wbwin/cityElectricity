// pages/my/regiment/regiment.js
import api from "../../../utils/api"
import utils from "../../../utils/utils"
var sliderWidth = 26;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["待成团", "已成团","拼团失败"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    rightIcon:'../../../images/content_more_right.png',
    shopIcon:'../../../images/25a771df8db1cb1347a6428fda54564e93584b69.jpg',
    token:'',
    osscdn:'',
    page:1,
    groupList:[],
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
    //   page:1,
    //   groupList:[],
    // })
    // that.getUserGroup()
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
    that.getUserGroup()
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
      token:wx.getStorageSync('token'),
      page:1,
    })
    that.getUserGroup()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that=this
    if(that.data.showBottomTips){
      return false
    }
    if(that.data.groupList.length==0){
      return false
    }
    var page=Number(that.data.page)+1
    that.setData({
      page:page,
    })
    that.getUserGroup()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that=this
    if (res.from === 'button') {
      console.log(res.target)
      var index=res.target.dataset.index
    var orderData=that.data.groupList[index]
      return {
        title: '一起来拼团吧',
        path: '/pages/goods/goods?shop_id='+orderData.shop_id+'&goods_id='+orderData.goods_id,
        imageUrl:that.data.osscdn+orderData.goods_cover
      }
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
      page:1,
    });
    that.getUserGroup()
  },
  //切换tab
  //获取我的拼团列表
  getUserGroup:function(){
    var that=this
    var groupList=that.data.page==1?[]:that.data.groupList
    var group_status=Number(that.data.activeIndex)+1
    if(that.data.page==1){
      that.setData({
        showBottomTips:false
      })
    }
    utils.util.post(api.getUserGroup,{
      page:that.data.page,
      limit:10,
      group_status:group_status,
      token:that.data.token,
      unLoading:true,
    },res=>{
      var list=res.data.list
      if(list.length>0){
        groupList=groupList.concat(list)
        that.setData({
          groupList:groupList,
          osscdn:res.osscdn
        })
      }else{
        that.setData({
          showBottomTips:page==1?false:true
        })
      }
    })
  },
})