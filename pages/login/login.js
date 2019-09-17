// pages/login/login.js
import config from "../../utils/config"
import api from "../../utils/api"
import utils from "../../utils/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo:'../../images/logo.png',
    show:false,
    userInfo:'',
    openId:"",
    session_key:'',
  },
  //获取用户信息
  getUserInfo(res){
    const that = this;
    if (res.detail.errMsg == 'getUserInfo:fail auth deny') {
      return false
    }
    console.log(res.detail.userInfo)
    that.setData({
      // show:true,
      userInfo:res.detail.userInfo
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
              session_key:session_key
            })
            wx.setStorageSync('openId', openId);
            wx.setStorageSync('session_key', session_key)
            utils.util.post(api.addUserInfo, {
              code: res.code,
              user_name: that.data.userInfo.nickName,
              avatar: that.data.userInfo.avatarUrl,
              // encryptedData: encryptedData,
              // iv: iv,
              openid:that.data.openId,
              session_key:that.data.session_key,
              city:that.data.userInfo.city
            }, res => {
              if (res.code==1) {
                console.log('手机授权:', res)
                wx.setStorageSync('token', res.data.token)
                wx.setStorageSync('userId', res.data.id)
                wx.setStorageSync('mobile', res.data.tel)
                wx.setStorageSync('osscdn', res.osscdn)
                // wx.setStorageSync('roleCode', res.result.roleCode)
                // 写入图片和名字
                // wx.setStorageSync('avatarWeiXinUrl', res.result.avatar)
                // wx.setStorageSync('nickName', res.result.nickName)
                // wx.setStorageSync('accountId', res.result.accountId)
                var loginResult = JSON.stringify(res.data)
                wx.setStorageSync('loginResult', res.data)
                let options = that.data.options;
                let router = that.data.router;
                let str = '';
                for (let k in options) {
                  str += `${k}=${options[k]}&` //拼接参数
                }
                str = (str.substring(str.length - 1) == '&') ? str.substring(0, str.length - 1) : str; //去除最后一个&符号
                wx.navigateBack({
                  url: `${router}?${str}`
                })
              }
            }, {
              loading: true,
              formData: false
            })
          }
        })
      }
    })
  },
  // 拒绝手机授权
  reject() {
    const that = this;
    that.setData({
      show: false
    })
    wx.navigateTo({
      url: './mobileLogin/mobileLogin',
    })
  },
  // 允许手机授权
  getPhoneNumber(e) {
    var that = this;
    var code = ''; //承接login api拿到的code 用来换取实时的openId
    var encryptedData = e.detail.encryptedData; //传给后台解析用户手机授权信息 下同
    var iv = e.detail.iv;
    that.setData({
      show: false
    })
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      return that.reject();
    }
    wx.login({
      success: function(res) {
        code = res.code
        // 用户通过微信授权 手机号码授权
        utils.util.post(api.addUserInfo, {
          code: code,
          user_name: that.data.userInfo.nickName,
          avatar: that.data.userInfo.avatarUrl,
          encryptedData: encryptedData,
          iv: iv,
          openid:that.data.openId,
          session_key:that.data.session_key,
          city:that.data.userInfo.city
        }, res => {
          if (res.code==1) {
            console.log('手机授权:', res)
            wx.setStorageSync('token', res.data.token)
            wx.setStorageSync('userId', res.data.id)
            wx.setStorageSync('mobile', res.data.mobile)
            wx.setStorageSync('osscdn', res.osscdn)
            // wx.setStorageSync('roleCode', res.result.roleCode)
            // 写入图片和名字
            // wx.setStorageSync('avatarWeiXinUrl', res.result.avatar)
            // wx.setStorageSync('nickName', res.result.nickName)
            // wx.setStorageSync('accountId', res.result.accountId)
            var loginResult = JSON.stringify(res.data)
            wx.setStorageSync('loginResult', res.data)
            let options = that.data.options;
            let router = that.data.router;
            let str = '';
            for (let k in options) {
              str += `${k}=${options[k]}&` //拼接参数
            }
            str = (str.substring(str.length - 1) == '&') ? str.substring(0, str.length - 1) : str; //去除最后一个&符号
            wx.navigateBack({
              url: `${router}?${str}`
            })
          }
        }, {
          loading: true,
          formData: false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = getCurrentPages(),
      options = page[page.length - 2].options,
      router = `/${page[page.length - 2].route}`;
    this.setData({
      options,
      router
    })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})