// pages/shop/commodityClassification/commodityClassification.js
import api from "../../../utils/api"
import utils from "../../../utils/utils"
var sliderWidth = 26;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*商品分类*/ 
    classifly_list:['全部','外套','卫衣','裙装','上衣','裤装','运动服','配饰'],
    toView:'index0',
    sliderOffset: 0,
    sliderLeft: 0,
    activeIndex:0,
    linewidth:'56px',
    /*商品分类*/
    /*排序分类*/
    sortIndex:1,
    /*排序分类*/
    /*搜索框*/
    inputShowed: false,//搜索框
    inputVal: "",//搜索框内容
    /*搜索框*/
    //店铺id
    shop_id:'',
    category_id:'',//分类id
    osscdn:'',
    categroy_list:[],
    token:wx.getStorageSync('token'),
    goods_list:[],//商品列表
    type:1,//分类
    search_text:'',//关键词
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.getSystemInfo({
      success: function (res) {
        /**
        * sliderLeft 选中览的位置
        * sliderOffset 偏移多少
        * sliderWidth 导航栏的宽度
        */
        that.setData({
          sliderLeft: (res.windowWidth / that.data.classifly_list.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.classifly_list.length * that.data.activeIndex
        });
      }
    });
    const shop_id=options.shop_id;
    const type=options.type;
    that.setData({
      shop_id:shop_id,
      type:type,
    })
    var _title=type==1?'店长推荐':type==2?'热销榜单':type==3?'新品上市':'分类'
    wx.setNavigationBarTitle({
      title: _title
    })
    that.getMoreGoods()
    // that.getShopDetail(shop_id)
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
    that.getMoreGoods()
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
  //搜索框
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  //搜索框
  //商品分类选择
  classiflyChoose:function(e){
    var that = this
    var i = e.target.dataset.index
    this.setData({
      toView:'index'+i,
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: i
    })
    /*获取当前元素的宽度*/
    var query = wx.createSelectorQuery();
    query.select('#index'+i).boundingClientRect(function (rect) {
      that.setData({
        linewidth: rect.width + 'px'
      })
    }).exec();
  },
  //商品分类选择
  sortChoose:function(e){
    var that=this
    var index=e.target.dataset.index
    if(index==4){
      index=5
    }else if(index==5){
      index=4
    }
    that.setData({
      sortIndex:index
    })
    that.getMoreGoods()
  },
  //商品分类选择
  // /*获取店铺详情*/
  // getShopDetail:function(e){
  //   const that = this;
  //   const token = wx.getStorageSync('token');
  //   utils.util.post(api.getShopDetail,{
  //     token:token,
  //     shop_id:e
  //   },res=>{
  //     var categroy_list=[]
  //     if(res.data.categroy){
  //       categroy_list=res.data.categroy
  //     }
  //     categroy_list.unshift({category_name:"全部"})
  //       that.setData({
  //         categroy_list:categroy_list,
  //         osscdn:res.osscdn
  //       })
  //       for(var i in categroy_list){
  //         if(that.data.category_id==categroy_list[i].id){
  //           that.setData({
  //             activeIndex:i,
  //           })
            
  //         }
  //       }
        
  //       that.getMoreGoods()
  //     })
      
  // },
  /*获取分类商品详情*/ 
  getMoreGoods:function(){
    var that=this
    utils.util.post(api.getMoreGoods,{
      token:that.data.token,
      shop_id:that.data.shop_id,
      search:that.data.sortIndex,
      type:that.data.type,
      // search_text:that.data.search_text,
    },res=>{
      var goods_list=res.data
      that.setData({
        goods_list:goods_list,
        osscdn:res.osscdn
      })
    })
  },
  //商品详情
  goodsBuy:function(e){
    var that=this
    var goods_id=e.currentTarget.dataset.goods_id
    wx.navigateTo({
      url:'/pages/goods/goods?goods_id='+goods_id+'&shop_id='+that.data.shop_id
    })
  },
  // //关键词搜索
  // searchInput:function(e){
  //   var that=this
  //   that.setData({
  //     search_text: e.detail.value
  //   })
  // },
  // //关键词搜索确认
  // searchConfirm:function(e){
  //   var that=this
  //   that.getMoreGoods();
  // }
})