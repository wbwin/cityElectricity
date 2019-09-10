// pages/my/applicationMerchant/shopApplication/shopApplication.js
import config from "../../../../utils/config"
import api from "../../../../utils/api"
import utils from "../../../../utils/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopHead:'/images/add_image.png',
    shopImages:[],
    startTime:'请选择',
    endTime:'请选择',
    locationName:'',
    latitude:'',//店铺申请的纬度
    longitude:'',//店铺申请的经度
    is_agreement:true,//初始状态，未勾选已读协议
    is_supplier:false,//初始状态，未勾选申请成为供应商
    shop_name:'',
    shop_intro:'',
    // address_base:'',
    address_detail:'',
    leader_name:'',
    leader_tel:'',
    leader_wechat:'',
    shop_img_json:'',
    is_apply_supplier:'',//是否同时申请供应商
    osscdn:''//存储上传图片域名地址
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
  shopName:function(e){
    const that = this;
    that.setData({
      shop_name:e.detail.value
    })
  },
  shopIntro:function(e){
    const that = this;
    that.setData({
      shop_intro:e.detail.value
    })
  },
  addressDetail:function(e){
    const that = this;
    that.setData({
      address_detail:e.detail.value
    })
  },
  leaderName:function(e){
    const that = this;
    that.setData({
      leader_name:e.detail.value
    })
  },
  leaderTel:function(e){
    const that = this;
    that.setData({
      leader_tel:e.detail.value
    })
  },
  leader_wechat:function(e){
    const that = this;
    that.setData({
      leader_wechat:e.detail.value
    })
  },

  //选择店铺图片
  chooseShopImages:function(e){
    var that = this
    wx.chooseImage({
      count:1,
      sizeType:['original', 'compressed'],//所选图片尺寸 original为原图 compressed为压缩图
      sourceType:['album', 'camera'],//所选图片来源 相册或者使用相机
      success: function (res) {
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0],//选择图片返回的相对路径
          encoding:'base64',
          success:res => {
            let shopImagesBae64 = res.data;
            that.uploadImage(shopImagesBae64);//调用上传图片文件oss
          }
        });  
      },
    })
  },
  //删除店铺图片
  delShopImages:function(e){
    let that=this
    let index=e.currentTarget.dataset.index
    let shopImages = this.data.shopImages
    shopImages.splice(index,1)
    that.setData({
      shopImages: shopImages
    })
  },
   // 上传图片到oss文件
   uploadImage:function(shopImagesBae64){
    let that = this;
    var token = wx.getStorageSync('token');
    var shopImages = that.data.shopImages;
    utils.util.post(api.ossUploadImage,{
      token:token,
        base64:'data:image/jpeg;base64,'+shopImagesBae64
    },res=>{
      shopImages = shopImages.concat(res.data.file)
      that.setData({
        shopImages: shopImages,
        osscdn:res.osscdn
      })
    })
  
    // utils.util.post(api.ossUploadImage,{
    //   base64:'data:image/jpeg;base64,'+shopImagesBae64
    // },res=>{
    //   // console.log(res)
    //   shopImages = shopImages.concat(res.osscdn+res.data.file)
    //   that.setData({
    //     shopImages: shopImages
    //   })
    // })
  },
  //选择开始时间
  bindStartTimeChange(e) {
    if (this.data.endTime != '请选择' && e.detail.value > this.data.endTime){
      this.setData({
        endTime: '请选择'
      })
    }
    this.setData({
      startTime: e.detail.value
    })
  },
  //选择结束时间
  bindEndTimeChange(e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  //选择地址
  chooseLocation(e){
    console.log(e)
    var that=this
    wx.chooseLocation({
      success: function(res) {
        console.log(res)
        that.setData({
          locationName: res.address,
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
      fail:function(res){
        console.log(res)
      }
    })
  },
  //申请成为供应商
  apply_supplier:function () {
    const that = this
    that.setData({
      is_supplier:!that.data.is_supplier
    })
  },
  //阅读并同意协议
  read_agreement:function () {
    const that = this
    that.setData({
      is_agreement:!that.data.is_agreement
    })
  },
  //点击阅读协议
  agreement:function () {
    wx.navigateTo({
      url: '/pages/my/applicationMerchant/agreement/agreement'
    })
  },
  //提交店铺申请
  submit:function(){
    const that = this;
    if(that.data.is_agreement){
      const that = this;
      const shop_img_json = JSON.stringify(that.data.shopImages);
      const shop_name = that.data.shop_name;
      const shop_intro = that.data.shop_intro;
      const address_base = that.data.locationName;
      const address_detail = that.data.address_detail;
      const address_lat = that.data.latitude;
      const address_lng = that.data.longitude;
      const leader_name = that.data.leader_name;
      const leader_tel = that.data.leader_tel;
      const leader_wechat = that.data.leader_wechat;
      const open_starttime = that.data.startTime;
      const open_endtime = that.data.endTime;
      const is_supplier = that.data.is_supplier;
      let token = wx.getStorageSync('token');
      let is_apply_supplier = '';
      if(shop_img_json == ''||shop_name == ''||shop_intro == ''||leader_name == ''||leader_tel == ''||leader_wechat == ''){
        wx.showModal({
          title:'提示',
          content:'请将信息填写完整',
          showCancel:false,
          confirmText:'确定',
          confirmColor:"#646981",
        })
        return false
      }
      if(open_starttime =='请选择'||open_starttime == ''||open_endtime == '请选择' || open_endtime == ''){
          wx.showModal({
          title:'提示',
          content:'请填写完整营业时间',
          showCancel:false,
          confirmText:'确定',
          confirmColor:"#646981",
        })
        return false
      }
      if(is_supplier){
        if(address_base==''||address_detail==''||address_lat == ''||address_lng == ''){
          wx.showModal({
            title:'提示',
            content:'同时申请为供应商，需要填写店铺地址和详细地址',
            showCancel:false,
            confirmText:'确定',
            confirmColor:"#646981",
          })
          return false
        }
        is_apply_supplier = 1
      }else{
        is_apply_supplier = 0
      }
      // wx.request({
      //   url: config.ApiUrl + api.addShopApply,
      //   data: {
      //     shop_name:shop_name,
      //     shop_intro:shop_intro,
      //     address_base:address_base,
      //     address_detail:address_detail,
      //     address_lat:address_lat,
      //     address_lng:address_lng,
      //     leader_name:leader_name,
      //     leader_tel:leader_tel,
      //     leader_wechat:leader_wechat,
      //     open_starttime:open_starttime,
      //     open_endtime:open_endtime,
      //     shop_img_json:shop_img_json,
      //     is_apply_supplier:is_apply_supplier,
      //     token:token
      //   },
      //   method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //   // header: {}, // 设置请求的 header
      //   success: function(res){
      //     wx.showModal({
      //       title:'提示',
      //       content:'申请提交成功，等待审核',
      //       showCancel:false,
      //       confirmText:'确定',
      //       confirmColor:"#646981",
      //       success(res){
      //         if(res.confirm){
      //           wx.navigateBack({
      //             delta: 1
      //           })
      //         }
      //       }
      //     })
      //   }
      // })
      // console.log(shop_img_json,shop_name,shop_intro,address_base,address_detail,address_lat,address_lng,leader_name,leader_tel,leader_wechat)
      utils.util.post(api.addShopApply,{
        shop_name:shop_name,
          shop_intro:shop_intro,
          address_base:address_base,
          address_detail:address_detail,
          address_lat:address_lat,
          address_lng:address_lng,
          leader_name:leader_name,
          leader_tel:leader_tel,
          leader_wechat:leader_wechat,
          open_starttime:open_starttime,
          open_endtime:open_endtime,
          shop_img_json:shop_img_json,
          is_apply_supplier:is_apply_supplier,
          token:token,
          unNavigateBack:true,
      },res=>{
        wx.showModal({
          title:'提示',
          content:'申请提交成功，等待审核',
          showCancel:false,
          confirmText:'确定',
          confirmColor:"#646981",
          success(res){
            if(res.confirm){
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      })
    }else{
      wx.showToast({
        title:'请先阅读并同意《平台用户服务协议》',
        icon:"none"
      })
    }
  }
})