//index.js
//获取应用实例
import config from "../../utils/config"
import api from "../../utils/api"
import utils from "../../utils/utils"
const app = getApp()
var sliderWidth = 26;
Page({
  data: {
    tabs: ["列表", "动态"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    // fansNumber: 1,
    // 动态
    triangleShow: false,
    commentInputShow: false,
    commentValue: '',
    /*轮播*/
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    actionSheetHidden:false,
    previewImageArray:['../../images/25a771df8db1cb1347a6428fda54564e93584b69.jpg'],
    shopList:[],//店铺列表
    shopPage:1,//店铺页数
    listData:[],//承载列表数据
    osscdn:'',
    dynaPage:1,//动态页数
    dynamicsList:[],//动态列表
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        /**
         * sliderLeft 选中览的位置
         * sliderOffset 偏移多少
         * sliderWidth 导航栏的宽度
         */
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  onShow: function () {
    let that = this;
    that.setData({
      dynaPage:1,
      dynamicsList:[],
      shopList:[],
      shopPage:1,
    })
    that.getBanner();//banner
    that.getUserShop();//加载数据
    that.getDynamicsInfo()
  },
  onReachBottom:function(){
    var that=this
    if(that.data.activeIndex==1){
      var dynaPage=Number(that.data.dynaPage)+1
      that.setData({
        dynaPage:dynaPage
      })
      that.getDynamicsInfo()
    }else{
      var shopPage=Number(that.data.shopPage)+1
      that.setData({
        shopPage:shopPage
      })
      that.getUserShop()
    }
  },
  onPullDownRefresh:function(){
    var that=this
    that.setData({
      dynaPage:1,
      dynamicsList:[],
      shopList:[],
      shopPage:1,
    })
    that.getBanner();//banner
    that.getUserShop();//加载数据
    that.getDynamicsInfo()
  },
  //首页banner
  getBanner:function(){
    const that = this;
    const token = wx.getStorageSync('token');
    const imgUrls = [];
    wx.request({
      url: config.ApiUrl + api.getBanner,
      data: {
        token:token
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        for(var i=0;i<res.data.data.length;i++){
          imgUrls.push(res.data.osscdn+'/'+res.data.data[i].banner_img)
        }
        that.setData({
          imgUrls:imgUrls
        })
      }
    })
  },
  //获取用户关注店铺列表
  getUserShop:function(){
    const that = this;
    const token = wx.getStorageSync('token');
    var page=that.data.shopPage
    var shopList=that.data.shopList
    utils.util.post(api.getUserShop,{
      token:token,
      page:page,
      limit:10,
    },res=>{
      var list=res.data.list
      if(list.length>0){
        shopList=shopList.concat(list)
      
      that.setData({
        shopList:shopList,
        osscdn:res.osscdn
      })
      console.log(shopList)
      }
    })
    
  },
  tabClick: function (e) {
    var that=this
    var activeIndex=e.currentTarget.id
    console.log(activeIndex)
    // if(activeIndex==0){
    //   that.getUserShop()
    // }else{
    //   that.getDynamicsInfo()
    // }
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  // 动态
  triangleClick: function () {
    var triangleShow = !this.data.triangleShow
    this.setData({
      triangleShow: triangleShow
    })
    console.log(this.data.triangleShow)
  },
  showInput: function () {
    this.setData({
      commentInputShow: !this.data.commentInputShow,
      triangleShow: false,
    })

  },
  commentInput: function (e) {
    this.setData({
      commentValue: e.detail.value
    })
  },
  onPageScroll: function (e) {
    if (this.data.commentInputShow) {
      this.setData({
        commentInputShow: false,
      })
    }
  },
  // 动态
  // 动态详情
  dynamicDetails: function (e) {
    var dynamics_id=e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/dynamicDetails/dynamicDetails?dynamics_id='+dynamics_id
    })
  },
  actionSheetChange: function () {
    const that = this;
    that.setData({
      actionSheetHidden:true
    })
  },
  onShareAppMessage: function (res) {
    var that=this
    if(res.from=="button"){
      var dynamicsList=that.data.dynamicsList
      var index=res.target.dataset.index
      var dynamicsData=dynamicsList[index]
      console.log(res.target)
      var imageUrl=dynamicsData.img_json.length>0?that.data.osscdn+dynamicsData.img_json[0]:'/images/logo.png'
      return {
        title: dynamicsData.content,
        path: '/pages/dynamicDetails/dynamicDetails?dynamics_id='+dynamicsData.id,
        imageUrl:imageUrl,
      }
    }else{
      return {
        title: '同橙电商',
        path: '/pages/my/my',
        imageUrl:'/images/logo.png',
      }
    }
    
    
  },
  //查看动态 放大图片
  previewImage:function(e){
    const that = this
    var dynamicsList=that.data.dynamicsList
    var index=e.currentTarget.dataset.index
    var img_index=e.currentTarget.dataset.img_index
    var img_json=dynamicsList[index].img_json
    var osscdn=that.data.osscdn
    console.log(img_json)
    wx.previewImage({
      current: img_json[img_index], // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: img_json,
      success: function(res){
        console.log(res)
      },
      fail: function() {
        
      },
      complete: function() {
        // complete
      }
    })
  },
  //获取用户关注的动态
  getDynamicsInfo(){
    var that=this
    const token=wx.getStorageSync('token')
    if(!token){
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return false
    }
    var osscdn=that.data.osscdn
    var page=that.data.dynaPage
    var dynamicsList=that.data.dynamicsList
    utils.util.post(api.getDynamicsInfo,{
      page:page,
      limit:10,
      token:token
    },res=>{
      var list=res.data.list
      if(list.length>0){
      for(var i in list){
        list[i].img_json=JSON.parse(list[i].img_json)
        for(var j in list[i].img_json){
          list[i].img_json[j]=that.data.osscdn+list[i].img_json[j]
        }
      }
      dynamicsList=dynamicsList.concat(list)
      
      that.setData({
        dynamicsList:dynamicsList,
        osscdn:res.osscdn
      })
      console.log(dynamicsList)
    }
    })
  },
  //赞
  fabulous:function(e){
    var that=this
    var dynamics_id=e.currentTarget.dataset.dynamics_id
    var like_status=e.currentTarget.dataset.is_like
    var index=e.currentTarget.dataset.index
    var dynamicsList=that.data.dynamicsList
    like_status=like_status==0?'1':'0'
    utils.util.post(api.setDynamicsLike,{
      dynamics_id:dynamics_id,
      like_status:like_status,
      token:wx.getStorageSync('token')
    },res=>{
      if(like_status==1){
        wx.showToast({
          icon:'none',
          title:'点赞成功'
        })
        var userAvatar=wx.getStorageSync('loginResult').avatar
        dynamicsList[index].like_info.push({avatar:userAvatar,user_id:wx.getStorageSync('userId')})
      }else{
        wx.showToast({
          icon:'none',
          title:'取消点赞成功'
        })
        for(var i in dynamicsList[index].like_info){
          if(dynamicsList[index].like_info[i].user_id==wx.getStorageSync('userId')){
            dynamicsList[index].like_info.splice(i,1)
          }
        }
      }
      dynamicsList[index].is_like=like_status
      that.setData({
        dynamicsList:dynamicsList,
      })
    })
  }

})