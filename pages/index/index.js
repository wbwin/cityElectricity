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
    shopList:'',//店铺列表
    shopPage:1,//店铺页数
    listData:[],//承载列表数据
    osscdn:'',
    dynaPage:1,//动态页数
    dynamicsList:'',//动态列表
    onShowTrue:false,
    showBottomTips:false,
    collect:'',
    shop_id:'',
  },
  onLoad: function (options) {
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
    that.setData({
      dynaPage:1,
      shopPage:1,
      collect:options.collect,
      shop_id:options.shop_id
    })
    if(options.collect==1){
      that.shopFollow()
    }else{
      that.getUserShop();//加载数据
    }
    that.getBanner();//banner
    
    
  },
  onShow: function () {
    let that = this;
    if(!that.data.onShowTrue){
      that.setData({
        onShowTrue:true
      })
        return false
    }
    that.setData({
      dynaPage:1,
      shopPage:1,
    })
    that.getBanner();//banner
    that.getUserShop();//加载数据
  },
  onReachBottom:function(){
    var that=this
    if(that.data.showBottomTips){
      return false
    }
    if(that.data.activeIndex==1){
      if(that.data.dynamicsList.length==0){
        return false
      }
      var dynaPage=Number(that.data.dynaPage)+1
      that.setData({
        dynaPage:dynaPage
      })
      that.getDynamicsInfo()
    }else{
      if(that.data.shopList.length==0){
        return false
      }
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
      shopPage:1,
    })
    that.getBanner();//banner
    that.getUserShop();//加载数据
    
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
        var data=res.data.data
        var osscdn=res.data.osscdn
        for(var i=0;i<data.length;i++){
          data[i].banner_img=osscdn+'/'+data[i].banner_img
        }
        that.setData({
          imgUrls:data
        })
      }
    })
  },
  //获取用户关注店铺列表
  getUserShop:function(){
    const that = this;
    const token = wx.getStorageSync('token');
    var page=that.data.shopPage
    var shopList=page==1?[]:that.data.shopList
    if(page==1){
      that.setData({
        showBottomTips:false
      })
    }
    utils.util.post(api.getUserShop,{
      token:token,
      page:page,
      limit:10,
      unLoading:true,
    },res=>{
      var list=res.data.list
      if(list.length>0){
        for(var i in list){
          if(list[i].label!=0){
            list[i].label=list[i].label.length>1?list[i].label.split(","):list[i].label.split("")
          }
        }
        shopList=shopList.concat(list)
      
      that.setData({
        shopList:shopList,
        osscdn:res.osscdn
      })
      console.log(shopList)
      }else{
        that.setData({
          showBottomTips:page==1?false:true,
          shopList:shopList,
        })
      }
      that.getDynamicsInfo()
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
      sliderOffset: e.currentTarget.id==0?e.currentTarget.offsetLeft:e.currentTarget.offsetLeft-56,
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
      var imageUrl=dynamicsData.img_json.length>0?dynamicsData.img_json[0]:'/images/logo.png'
      return {
        title: dynamicsData.shop_info.shop_name+'—'+dynamicsData.content,
        path: '/pages/dynamicDetails/dynamicDetails?dynamics_id='+dynamicsData.id,
        imageUrl:imageUrl,
      }
    }else{
      return {
        title: '同橙电商',
        path: '/pages/index/index',
        imageUrl:'/images/logo.png',
      }
    }
    
    
  },
  //查看动态 放大图片
  previewImage:function(e){
    const that = this
    that.setData({
      onShowTrue:false
    })
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
  previewImageNav:function(e){
    const that = this
    that.setData({
      onShowTrue:false
    })
    var imgUrls=that.data.imgUrls
    var index=e.currentTarget.dataset.index
    console.log(imgUrls,imgUrls[index])
    utils.previewImage(imgUrls,imgUrls[index])
  },
  toDetail:function(e){
    const that = this
    var index=e.currentTarget.dataset.index
    var imgUrls=that.data.imgUrls
    if(imgUrls[index].url){
      wx.navigateTo({
        url:imgUrls[index].url
      })
    }
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
    var dynamicsList=page==1?[]:that.data.dynamicsList
    if(page==1){
      that.setData({
        showBottomTips:false
      })
    }
    utils.util.post(api.getDynamicsInfo,{
      page:page,
      limit:10,
      token:token,
      unLoading:true,
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
    }else{
      that.setData({
        showBottomTips:page==1?false:true,
        dynamicsList:dynamicsList,
      })
    }
    console.log(that.data.dynamicsList)
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
  },
  //动态地址
  openDynamicLocation:function(e){
    var that=this
    var index=e.currentTarget.dataset.index
    var dynamicsList=that.data.dynamicsList
    var shop_info=dynamicsList[index].shop_info
    utils.openLocation(Number(shop_info.address_lat),Number(shop_info.address_lng),shop_info.address_base+shop_info.address_detail)
  },
  //用户关注店铺
  shopFollow:function(){
    const that = this;
    const shop_id = that.data.shop_id;
    const token=wx.getStorageSync('token')
    wx.request({
      url: config.ApiUrl + api.setGoodsFans,
      data: {
        token:token,
          fans_status:1,
          shop_id:shop_id,
      },
      method: 'POST',
      success(res) {
        console.log(res)
      },
      complete(data){
        console.log(data)
        that.getUserShop()
      }
    })
  },

})