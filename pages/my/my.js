// pages/my/my.js
import config from "../../utils/config"
import api from "../../utils/api"
import utils from "../../utils/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderArray:[
      {src:'/images/be_delivery.png',text:'待发货'},
      {src:'/images/be_received.png',text:'待收货'},
      {src:'/images/completed.png',text:'已完成'},
      {src:'/images/after_sale.png',text:'售后'},
    ],
    lineBorder:[
      {src:'/images/my_regiment.png',text:'我的拼团'},
      {src:'/images/my_collection.png',text:'我的收藏'},
      {src:'/images/my_ccs.png',text:'联系客服'},
      {src:'/images/my_aboutUs.png',text:'关于我们'}
    ],
    defaultAvatar:'../../images/default-avatar.png',//如果用户头像为空，则显示默认头像
    osscdn:'',//图片存放域名位置
    userInfo:'',//用户信息
    userAvatar:'',
    isLogin:true,
    username:'',//存储授权成功的用户名字
    avatar:'',//存储授权成功的用户头像
    city:'',//存储授权成功的用户城市
    show:false,
    openId:'',
    session_key:'',
    encryptedData:'',
    iv:'',
    service_tel:''//平台客服电话
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
    let that = this;
    let token = wx.getStorageSync('token');
    let loginResult = wx.getStorageSync('loginResult') || '{}';
    console.log(loginResult)
    that.getPlatformService()//获取平台客服电话
    if(loginResult == '{}'){
      return false
    }
    if(token){
      that.setData({
        isLogin:false,
        userInfo:loginResult,
        osscdn:wx.getStorageSync('osscdn')
      })
      that.getUserInfo()
    }else{
      that.setData({
        isLogin:true
        
      })
    }
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
    that.onShow()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that=this
    if(res.from=="button"){
      
    }else{
      return {
        title: '同橙电商',
        path: '/pages/index/index',
        imageUrl:'/images/logo.png',
      }
    }
  },
  //获取客服信息
  getPlatformService:function(){
    let that = this;
    wx.request({
      url: config.ApiUrl + api.getPlatformService,
      data: {unLoading:true},
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        that.setData({
          service_tel:res.data.data.service_tel
        })
      }
    })
  },
  // 用户信息授权回调
  getUserInfoCallBack(res){
    var that = this;
    // console.log(res)
    // 拒绝授权
    if (res.detail.errMsg == 'getUserInfo:fail auth deny') {
      return false;
    }
    // 用户信息授权
    that.setData({
      username:res.detail.userInfo.nickName,
      avatar:res.detail.userInfo.avatarUrl,
      city:res.detail.userInfo.city,
      // show:true,
    })
    wx.login({
      success: function(res){
        wx.request({
          url: config.ApiUrl + api.wechatLogin,
          data: {
            code:res.code
          },
          method: 'POST',  // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'content-type':'application/json'
          }, // 设置请求的 header
          success: function(e){
            const openId =  e.data.data.openid;
            const session_key = e.data.data.session_key;
            that.setData({
              openId:openId,
              session_key:session_key,
            })
            wx.setStorageSync('openId', openId);
            wx.setStorageSync('session_key', session_key)
            wx.request({
              url: config.ApiUrl + api.addUserInfo,
              data: {
                user_name:that.data.username,
                city:that.data.city,
                avatar:that.data.avatar,
                openid:that.data.openId,
                session_key:that.data.session_key,
                // iv:e.detail.iv,
                // encryptedData:e.detail.encryptedData
              },
              method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              // header: {}, // 设置请求的 header
              success: function(res){
                that.setData({
                  userInfo:res.data.data,
                  isLogin:false,
                  osscdn:res.data.osscdn,
                })
                const token = res.data.data.token;
                const loginResult = res.data.data;
                wx.setStorageSync('token', token);
                console.log(res)
                wx.setStorageSync('loginResult', loginResult);
                wx.setStorageSync('osscdn', res.data.osscdn);
                wx.setStorageSync('userId', res.data.data.id)
                wx.setStorageSync('mobile', res.data.data.tel)
              }
            })
          }
        })
      }
    })
  },
  //拒绝授权手机号码
  reject:function(){
    const that = this;
    that.setData({
      show: false
    })
    wx.navigateTo({
      url: '../login/login'
    })
  },
  // 授权手机号码
  getPhoneNumber(e){
    console.log(e)
    const that = this;
    let code = '';
    that.setData({
      show: false
    })
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      return that.reject();
    }
    wx.login({
      success: function(res) {
        code = res.code
        that.setData({
          encryptedData:e.detail.encryptedData,
          iv:e.detail.iv
        })
        wx.request({
          url: config.ApiUrl + api.addUserInfo,
          data: {
            user_name:that.data.username,
            city:that.data.city,
            avatar:that.data.avatar,
            openid:that.data.openId,
            session_key:that.data.session_key,
            iv:e.detail.iv,
            encryptedData:e.detail.encryptedData
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function(res){
            that.setData({
              userInfo:res.data.data,
              isLogin:false,
              osscdn:res.data.osscdn,
            })
            const token = res.data.data.token;
            const loginResult = res.data.data;
            wx.setStorageSync('token', token);
            console.log(res)
            wx.setStorageSync('loginResult', loginResult);
            wx.setStorageSync('osscdn', res.data.osscdn);
            wx.setStorageSync('userId', res.data.data.id)
            wx.setStorageSync('mobile', res.data.data.tel)
          }
        })
      }
    })
  },
  // 联系客服
  handleContact: function (e) {
    console.log(e.path);
    console.log(e.query);
  },
  //收获地址
  chooseAdress:function(){
    wx.chooseAddress({
      success:function(res){
        console.log(res)
      }
    })
     if (wx.chooseAddress) {
      wx.chooseAddress({
        success: function (res) {
          wx.setStorageSync("defaultAddress",JSON.stringify(res))
        },
        fail: function (err) {
         
        }
      })
    }
  },
  // 商家入口
  applicationMerchant:function () {
    
    wx.navigateTo({
      url: '/pages/my/applicationMerchant/applicationMerchant'
    })
  },
  //查看我的订单
  checkOrder:function(e){
    let type = e.currentTarget.dataset.item;
    console.log(type)
    // ./orderManagement/orderManagement  订单
    //./afterSaleManagement/afterSaleManagement 售后
    if(type == '待发货'){
      wx.navigateTo({
        url: './orderManagement/orderManagement?type=1'
      })
    }else if(type == '待收货'){
      wx.navigateTo({
        url: './orderManagement/orderManagement?type=2'
      })
    }else if(type == '已完成'){
      wx.navigateTo({
        url: './orderManagement/orderManagement?type=3'
      })
    }else if(type == '售后'){
      wx.navigateTo({
        url: './afterSaleManagement/afterSaleManagement'
      })
    }
  },
  lineBorder:function(e){
    let type = e.currentTarget.dataset.type
    let token = wx.getStorageSync('token');
    // 我的拼团
    if(type == '我的拼团' && token){
      wx.navigateTo({
        url: './regiment/regiment'
      })
    }else{

    }
    // 我的收藏
    if(type == '我的收藏' && token){
      wx.navigateTo({
        url: '/pages/my/commodityCollection/commodityCollection'
      })
    }else{

    }
    // 联系客服
    if(type == '联系客服'){
      let that = this;
      wx.makePhoneCall({
        phoneNumber: that.data.service_tel,
      })
    }
    // 关于我们
    if(type == '关于我们'){
      wx.navigateTo({
        url: '/pages/my/aboutUs/aboutUs'
      })
    }
  },
  toMyshop:function(){
    var that=this
    wx.navigateTo({
      url: '/pages/shop/shop?id='+that.data.userInfo.shop_id
    })
  },
  //
  getUserInfo:function(){
    var that=this
    var token=wx.getStorageSync('token')
    utils.util.post(api.getUserInfo,{
      token:token,
      unLoading:true,
    },res=>{
      console.log(res)
      res.data.token=token
      wx.setStorageSync('loginResult', res.data);
      that.setData({
        userInfo:res.data
      })
    })
  }
})