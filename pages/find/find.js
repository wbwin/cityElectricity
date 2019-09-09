//index.js
import config from "../../utils/config"
import api from "../../utils/api"
import utils from "../../utils/utils"
//获取应用实例
const app = getApp()
var sliderWidth = 26;
Page({
  data: {
    tabs: ["橙店", "动态"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    fansNumber: 10,//粉丝数量
    /*搜索框*/
    inputShowed: false,//搜索框
    inputVal: "",//搜索框内容
    /*搜索框*/
    // 动态
    triangleShow: false,
    commentInputShow: false,
    commentValue: '',
    // 动态
    listData:'',
    shopPage:1,
    searchText:'',
    shopSearchText:'',
    dynaSearchText:'',
    osscdn:'',
    dynaPage:1,//动态页数
    dynamicsList:'',//动态列表
    onShowTrue:false,
    showBottomTips:false,
    latitude:'',//用户当前经纬度
    longitude:'',//用户当前经纬度
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
    that.setData({
      dynaPage:1,//动态页数
      shopPage:1,
      searchText:'',
      shopSearchText:'',
      dynaSearchText:'',
    })
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        console.log(res)
        const latitude = res.latitude
        const longitude = res.longitude
        that.setData({
          latitude:latitude,
          longitude:longitude
        })
      },
      complete(res){
        that.getPlatformShop();//加载数据
        that.getDynamicsInfoToPlatform();
      }
    })
    
  },
  onShow: function () {
    let that = this;
    // that.onLoad();
    if(!that.data.onShowTrue){
      that.setData({
        onShowTrue:true
      })
        return false
    }
    
    that.setData({
      dynaPage:1,//动态页数
      shopPage:1,
      searchText:'',
      shopSearchText:'',
      dynaSearchText:'',
    })
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        that.setData({
          latitude:latitude,
          longitude:longitude
        })
      },
      fail(res){
        console.log(res)
      },
      complete(res){
        that.getPlatformShop();//加载数据
        that.getDynamicsInfoToPlatform()
      }
    })
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
      that.getDynamicsInfoToPlatform()
    }else{
      if(that.data.listData.length==0){
        return false
      }
      var shopPage=Number(that.data.shopPage)+1
      that.setData({
        shopPage:shopPage
      })
      that.getPlatformShop()
    }
  },
  onPullDownRefresh:function(){
    var that=this
    that.setData({
      dynaPage:1,
      shopPage:1,
    })
    that.getPlatformShop();//加载数据
    that.getDynamicsInfoToPlatform()
  },
  onShareAppMessage:function(res){
    var that=this
    if(res.from=="button"){
      var dynamicsList=that.data.dynamicsList
      var index=res.target.dataset.index
      var dynamicsData=dynamicsList[index]
      console.log(dynamicsData.img_json)
      var imageUrl=dynamicsData.img_json.length>0?dynamicsData.img_json[0]:'/images/logo.png'
      return {
        title: dynamicsData.shop_info.shop_name+'—'+dynamicsData.content,
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
  //切换tab
  tabClick: function (e) {
    var that=this
    if(e.currentTarget.id==0){
      var searchText=that.data.shopSearchText
      that.setData({
        searchText:searchText
      })
    }else{
      var searchText=that.data.dynaSearchText
      that.setData({
        searchText:searchText
      })
    }
    this.setData({
      sliderOffset: e.currentTarget.id==0?e.currentTarget.offsetLeft:e.currentTarget.offsetLeft-56,
      activeIndex: e.currentTarget.id,
      showBottomTips:false
    });
  },
  //切换tab
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
  // 动态
  triangleClick: function () {
    var triangleShow = !this.data.triangleShow
    this.setData({
      triangleShow: triangleShow
    })
    console.log(this.data.commentValue)
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
  dynamicDetails: function (e) {
    var dynamics_id=e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/dynamicDetails/dynamicDetails?dynamics_id='+dynamics_id
    })
  },
   //获取平台店铺列表
   getPlatformShop:function(){
    const that = this;
    // const token = wx.getStorageSync('token');
    var shopPage=that.data.shopPage
    var listData=shopPage==1?[]:that.data.listData
    console.log(listData)
    if(shopPage==1){
      that.setData({
        showBottomTips:false
      })
    }
    utils.util.post(api.getPlatformShop,{
      page:shopPage,
      limit:10,
      search_text:that.data.searchText,
      unLoading:true,
      latitude:that.data.latitude,
      longitude:that.data.longitude
    },res=>{
      var data=res.data.data
      if(data.length>0){
        listData=listData.concat(data)
      that.setData({
        listData:listData,
        osscdn:res.osscdn
      })
    }else{
      that.setData({
        showBottomTips:shopPage==1?false:true,
        listData:listData,
      })
      
    }
    })
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
   //获取平台动态
   getDynamicsInfoToPlatform(){
    var that=this
    const token=wx.getStorageSync('token')
    var page=that.data.dynaPage
    var dynamicsList=page==1?[]:that.data.dynamicsList
    if(page==1){
      that.setData({
        showBottomTips:false
      })
    }
    utils.util.post(api.getDynamicsInfoToPlatform,{
      page:page,
      limit:10,
      token:token,
      search_text:that.data.searchText,
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
  //关键词搜索
  searchInput:function(e){
    var that=this
    var activeIndex=that.data.activeIndex
    if(activeIndex==0){
      that.setData({
        shopSearchText:e.detail.value
      })
    }else{
      that.setData({
        dynaSearchText:e.detail.value
      })
    }
    that.setData({
      searchText: e.detail.value
    })
  },
  //关键词搜索确认
  searchConfirm:function(e){
    var that=this
    var activeIndex=that.data.activeIndex
    if(activeIndex==0){
      that.setData({
        shopPage:1,
      })
      that.getPlatformShop();//加载数据
    }else{
      that.setData({
        dynaPage:1,
      })
      that.getDynamicsInfoToPlatform()
    }
  },
  //动态地址
  openDynamicLocation:function(e){
    var that=this
    var index=e.currentTarget.dataset.index
    var dynamicsList=that.data.dynamicsList
    var shop_info=dynamicsList[index].shop_info
    utils.openLocation(Number(shop_info.address_lat),Number(shop_info.address_lng),shop_info.address_base+shop_info.address_detail)
  }
})
