// pages/shop/shop.js
import config from "../../utils/config"
import api from "../../utils/api"
import utils from "../../utils/utils"
var sliderWidth = 26;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*列表切换*/ 
    tabs: ["商品", "动态","介绍"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    /*列表切换*/
    /*轮播*/ 
    imgUrls: [
      // 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      // 'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      // 'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    /*轮播*/
    // 动态
    triangleShow: false,
    commentInputShow: false,
    commentValue: '',
    // 动态
    /*商品分类*/
    goodsClassify:[
      // {icon:'../../images/shop_all_icon.png',name:'全部'},
      // { icon: '../../images/shop_coat_icon.png', name: '外套' },
      // { icon: '../../images/shop_skirt_icon.png', name: '裙装' },
      // { icon: '../../images/shop_Jacket_icon.png', name: '上装' },
      // { icon: '../../images/shop_pants_icon.png', name: '裤装' },
      // { icon: '../../images/shop_pants_other.png', name: '其他' }

    ],
    /*商家商品类型*/

    /*联系店主*/
    showShopContact: 0,
    shop:"",//存放店铺基本信息
    is_fans:'',//是否关注
    categroy:"",//商品分类
    goods_hot:"",//热销榜单
    goods_new:"",//新品上市
    goods_recommend:"",//店长推荐
    osscdn:'',//域名前缀
    shop_id:'',//店铺id,
    goods_datas:[
      { name: '店长推荐', englishName:'Selection of clothes'},
      { name: '热销榜单', englishName: 'Hot list'},
      { name: '新品上市', englishName: 'New list'},
    ],
    dynamicsList:[],//店铺动态
    page:1,//店铺动态页数
    onShowTrue:false,
    showBottomTips:false,
    collect:'',
    // newGoodsList:[],//新品列表
    newGoodsPage:1,//新品列表页数
    banner_image:[],
    videoToPlay:3,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    const shop_id = options.id
    that.setData({
      shop_id:shop_id
    })
    that.listTab();
    that.setData({
      token:wx.getStorageSync('token'),
      page:1,//店铺动态页数
      newGoodsPage:1,
      collect:options.collect
    })
    // console.log(wx.getLaunchOptionsSync().query.collect)
    // if(wx.getLaunchOptionsSync().query.collect){
    //   that.setData({
    //     collect:wx.getLaunchOptionsSync().query.collect
    //   })
    // }
    that.getShopDetail(that.data.shop_id);//获取店铺详情
    // that.getShopDynamics();//获取店铺动态列表
    
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
    if(!that.data.onShowTrue){
      that.setData({
        onShowTrue:true,
        token:wx.getStorageSync('token'),
      })
        return false
    }
    that.setData({
      token:wx.getStorageSync('token'),
      page:1,//店铺动态页数
      newGoodsPage:1,
    })
    that.getShopDetail(that.data.shop_id);//获取店铺详情
    // that.getShopDynamics();//获取店铺动态列表
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
      page:1,//店铺动态页数
      newGoodsPage:1,
    })
    that.getShopDetail(that.data.shop_id);//获取店铺详情
    // that.getShopDynamics();//获取店铺动态列表
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that=this
    if(that.data.showBottomTips){
      return false
    }
    if(that.data.activeIndex==1&&that.data.dynamicsList.length!=0){

      var page=Number(that.data.page)+1
      that.setData({
        page:page
      })
      that.getShopDynamics();//获取店铺动态列表

    }else if(that.data.activeIndex==0&&that.data.goods_datas[2].data.length!=0){
      var page=Number(that.data.newGoodsPage)+1
      that.setData({
        newGoodsPage:page
      })
      that.getShopNewGoods();//获取店铺新品列表
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that=this
    console.log(wx.getStorageSync('loginResult'))
    var loginResult=wx.getStorageSync('loginResult')
    console.log(that.data.imgUrls)
    if(res.from=="button"){
      if(res.target.dataset.type==1){
        return {
          title: loginResult.user_name+'推荐一家好店'+'—'+that.data.shop.shop_name,
          path: '/pages/shop/shop?collect=1&id='+that.data.shop.id,
          imageUrl:that.data.imgUrls.length>0?that.data.osscdn+that.data.imgUrls[0]:'/images/logo.png'
        }
      }else{
        var dynamicsList=that.data.dynamicsList
        var index=res.target.dataset.index
        var dynamicsData=dynamicsList[index]
        console.log(res.target)
        var imageUrl=dynamicsData.img_json.length>0?dynamicsData.img_json[0]:'/images/logo.png'
        return {
          title: dynamicsData.shop_info.shop_name+'—'+dynamicsData.content,
          path: '/pages/dynamicDetails/dynamicDetails?collect=1&dynamics_id='+dynamicsData.id,
          imageUrl:imageUrl,
        }
      }
     
    }else{
      return {
        title:loginResult.user_name+'推荐一家好店'+'—'+that.data.shop.shop_name,
        path: '/pages/shop/shop?collect=1&id='+that.data.shop.id,
        imageUrl:that.data.imgUrls.length>0?that.data.osscdn+that.data.imgUrls[0]:'/images/logo.png'
      }
    }
  },
/*列表切换*/
  listTab:function(){
    const that = this;
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
  tabClick: function (e) {
    var that=this
    var shop=that.data.shop
    shop.is_dynamics_red=0
    this.setData({
      sliderOffset: e.currentTarget.id==0?0:e.currentTarget.id==1?212:422,
      activeIndex: e.currentTarget.id,
      shop:shop,
      showBottomTips:false,
    });
  },
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
  /*联系店主*/
  showShopContact() {
    var that=this
    wx.showActionSheet({
      itemList: ['拨打电话', '复制微信号'],
      success (res) {
        console.log(res.tapIndex)
        if(res.tapIndex==0){
          that.callPhone();
        }else{
          that.copyWechat();
        }
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
    // this.setData({
    //   showShopContact: !this.data.showShopContact
    // })
  },
  // 动态详情
  dynamicDetails:function (e) {
    var dynamics_id=e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/dynamicDetails/dynamicDetails?dynamics_id='+dynamics_id
    })
  },
  /*获取店铺详情*/
  getShopDetail:function(e){
    const that = this;
    const token = wx.getStorageSync('token');
    utils.util.post(api.getShopDetail,{
      token:token,
        shop_id:e
    },res=>{
      var data = res.data;
      console.log(data)
      console.log(res.data)
      var goods_datas = that.data.goods_datas;
      
      for(var i in data.goods_recommend){
        data.goods_recommend[i].banner_video_json=JSON.parse(data.goods_recommend[i].banner_video_json)
        if(data.goods_recommend[i].label!=0){
          data.goods_recommend[i].label=data.goods_recommend[i].label.length>1?data.goods_recommend[i].label.split(","):data.goods_recommend[i].label.split("")
        }
      }
      for(var j in data.goods_hot){
        data.goods_hot[j].banner_video_json=JSON.parse(data.goods_hot[j].banner_video_json)
        if(data.goods_hot[j].label!=0){
          data.goods_hot[j].label=data.goods_hot[j].label.length>1?data.goods_hot[j].label.split(","):data.goods_hot[j].label.split("")
        }
      }
      goods_datas[0].data = data.goods_recommend
      goods_datas[1].data = data.goods_hot
      // goods_datas[2].data = data.goods_new
      that.setData({
        shop:data.shop,
        is_fans:data.shop.is_fans,
        goodsClassify:data.categroy,
        categroy:data.categroy,
        goods_datas: goods_datas,
        imgUrls:JSON.parse(data.shop.shop_img_json),
        osscdn:res.osscdn,
        banner_image:data.banner_image
      })
      if(that.data.collect&&data.shop.is_fans==0){
        that.shopFollow()
      }
      console.log(that.data.goods_datas)
      that.getShopDynamics();//获取店铺动态列表
      that.getShopNewGoods();//获取店铺新品商品
    })
   
    // utils.util.post(api.getShopDetail,{
    //   shop_id:e
    // },res =>{
      
    // })
  },
  //获取店铺新品商品
  getShopNewGoods(){
    var that=this
    const token=wx.getStorageSync('token')
    var page=that.data.newGoodsPage
    var goods_datas=that.data.goods_datas
    var newGoodsList=page==1?[]:goods_datas[2].data
    if(page==1){
      that.setData({
        showBottomTips:false
      })
    }
    utils.util.post(api.getShopNewGoods,{
      page:page,
      limit:10,
      token:token,
      shop_id:that.data.shop_id
    },res=>{
      var list=res.data.list
      if(list.length>0){
        for(var i in list){
          if(list[i].label!=0){
            list[i].label=list[i].label.length>1?list[i].label.split(","):list[i].label.split("")
          }
        }
        newGoodsList=newGoodsList.concat(list)
        goods_datas[2].data=newGoodsList  
      that.setData({
        goods_datas:goods_datas,
        osscdn:res.osscdn,
      })
      console.log(newGoodsList)
    }else{
      that.setData({
        showBottomTips:page==1?false:true
      })
    }
    })
  },
  //用户关注店铺
  shopFollow:function(){
    const that = this;
    var is_follow = that.data.is_fans==0?'1':'0';
    const shop_id = that.data.shop_id;
    const token=wx.getStorageSync('token')
    var shop=that.data.shop
    var loginResult=wx.getStorageSync('loginResult')
    // if(is_fans){
      // 取消关注
      utils.util.post(api.setGoodsFans,{
        token:token,
          fans_status:is_follow,
          shop_id:shop_id,
      },res=>{
          console.log(res)
          if(res.code==1){
            if(res.msg=="您对该店铺已关注"&&that.collect==1){
              return false
            }
            console.log(is_follow)
            if(is_follow==0){
              shop.fans_count=shop.fans_count-1
              for(var i in shop.fans){
                if(shop.fans[i].user_name==loginResult.user_name){
                  shop.fans.splice(i,1)
                }
              }
              wx.showToast({
                title: '取消关注成功',
                icon: 'none',
                duration: 2000
              })
            }else{
              shop.fans_count=shop.fans_count+1
              var avatar=loginResult.avatar
              shop.fans.push({user_name:loginResult.user_name,avatar:avatar})
              wx.showToast({
                title: '关注成功',
                icon: 'none',
                duration: 2000
              })
            }
            that.setData({
              is_fans:is_follow,
              shop:shop
            })
          }
        }
      )
    // }else{
    //   // 关注
      
    // }
  },
  // 拨打电话
  callPhone:function(){
    const that = this;
    const phone = that.data.shop.leader_tel;
    if(phone){
      wx.makePhoneCall({
        phoneNumber:phone
      })
    }else{
      wx.showModal({
        title:'提示',
        content:'店主很懒，没有留下手机号码',
        showCancel:false,
        confirmText:'确定',
        confirmColor:"#646981"
      })
    }
  },
  // 复制微信号
  copyWechat:function(){
    const that = this;
    const wechat = that.data.shop.leader_wechat;
    if(wechat){
      wx.setClipboardData({
        data:wechat,
        success(res){
          wx.showToast({
            title:'复制成功'
          })
        }
      })
    }else{
      wx.showModal({
        title:'提示',
        content:'店主很懒，没有留下微信号码',
        showCancel:false,
        confirmText:'确定',
        confirmColor:"#646981"
      })
    }
  },
  //前往分类
  toGoodsClassification:function(e){
    var that=this
    var classifly_index=e.currentTarget.dataset.classifly_index+1
    // console.log(e)
    wx.navigateTo({
      url: '/pages/shop/goodsClassification/goodsClassification?type='+classifly_index+'&shop_id='+that.data.shop_id
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
  previewWxacodeImage:function(){
    var that=this
    that.setData({
      onShowTrue:false
    })
    var shop=that.data.shop
    var img=[that.data.osscdn+shop.wxacode_image]
    wx.previewImage({
      urls: img,
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
    var url=e.currentTarget.dataset.url
    that.setData({
      onShowTrue:false
    })
    if(url){
      wx.navigateTo({
        url:url
      })
    }else{
      var imgUrls=JSON.parse(JSON.stringify(that.data.imgUrls))
      var index=e.currentTarget.dataset.index
      var osscdn=that.data.osscdn
      for(var i in imgUrls){
        imgUrls[i]=osscdn+imgUrls[i]
      }
      
      utils.previewImage(imgUrls,imgUrls[index])
    }
    
  },
    //获取店铺动态列表
    getShopDynamics(){
      var that=this
      const token=wx.getStorageSync('token')
      var page=that.data.page
      var dynamicsList=page==1?[]:that.data.dynamicsList
      if(page==1){
        that.setData({
          showBottomTips:false
        })
      }
      utils.util.post(api.getShopDynamics,{
        page:page,
        limit:10,
        token:token,
        shop_id:that.data.shop_id
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
          osscdn:res.osscdn,
        })
        console.log(dynamicsList)
      }else{
        that.setData({
          showBottomTips:page==1?false:true
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
    openShopLocation:function(){
      var that=this
      var shop=that.data.shop
      utils.openLocation(Number(shop.address_lat),Number(shop.address_lng),shop.address_base+shop.address_detail)
    },
    //动态地址
    openDynamicLocation:function(e){
      var that=this
      var index=e.currentTarget.dataset.index
      var dynamicsList=that.data.dynamicsList
      var shop_info=dynamicsList[index].shop_info
      utils.openLocation(Number(shop_info.address_lat),Number(shop_info.address_lng),shop_info.address_base+shop_info.address_detail)
    },
    //回到首页
    backIndex:function(){
      console.log(12)
      wx.switchTab({
        url: '/pages/index/index'
      })
    },
     //视频处理
  bindplay:function(e){
    var that=this
    that.setData({
    })
  },
  bindpause:function(e){
    var that=this
    // that.setData({
    //   videoToPlay:3,
    // })
  },
  bindended:function(e){
    var that=this
    that.setData({
      videoToPlay:3,
    })
  },
  //
  videoPlay:function(e){
    var that=this
    var index=e.currentTarget.dataset.index
    if(index!=that.data.videoToPlay){
      console.log(that.data.videoToPlay)
      // var videoContext = wx.createVideoContext('myVideo0')
      // videoContext.pause()
      var videoContext = wx.createVideoContext('myVideo'+that.data.videoToPlay)
      videoContext.pause()
    }
    console.log(index)
    var videoplay = wx.createVideoContext('myVideo'+index)
    
    videoplay.play()
    console.log(index)
    that.setData({
      videoToPlay:index
    })
    console.log(that.data.videoToPlay)
  },
  videoUn:function(){

  },
})