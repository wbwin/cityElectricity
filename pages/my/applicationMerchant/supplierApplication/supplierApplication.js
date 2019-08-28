// pages/my/applicationMerchant/supplierApplication/supplierApplication.js
import config from "../../../../utils/config"
import api from "../../../../utils/api"
import utils from "../../../../utils/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    supplier_name:'',//供应商名称
    address_detail:'',//供应商详细地址
    leader_name:'',//联系人名字
    leader_tel:'',//联系人电话
    supplier_intro:'',//供应商介绍
    shopImages: [],
    items: [{
      value: '同时申请成为供应商'
    }],
    agreeItems: [{
      value: '我已阅读并同意'
    }],
    locationName: '',//供应商基础地址
    latitude:'',
    longitude:'',
    is_agreement:true,//初始状态，未勾选已读协议
    osscdn:''//存储oss上传图片域名地址
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
  // 监听供应商名称
  supplierName:function(e){
    const that = this;
    that.setData({
      supplier_name:e.detail.value
    })
  },
  //详细地址
  addressDetail:function(e){
    // console.log(e)
    const that = this;
    that.setData({
      address_detail:e.detail.value
    })
  },
  // 联系人名字
  leaderName:function(e){
    const that = this;
    that.setData({
      leader_name:e.detail.value
    })
  },
  //联系人电话
  leaderTel:function(e){
    const that = this;
    that.setData({
      leader_tel:e.detail.value
    })
  },
  supplierIntro:function(e){
    const that = this;
    that.setData({
      supplier_intro:e.detail.value
    })
  },
  //选择图片
  chooseShopImages: function (e) {
    var that = this;
    wx.chooseImage({
      count:1,
      sizeType:['original', 'compressed'],//所选图片尺寸 original为原图 compressed为压缩图
      sourceType:['album', 'camera'],//所选图片来源 相册或者使用相机
      success: function (res) {
        // shopImages = shopImages.concat(res.tempFilePaths)
        // that.setData({
        //   shopImages: shopImages
        // })
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0],//选择图片返回的相对路径
          encoding:'base64',
          success:res => {
            let shopImagesBae64 = res.data;
            // console.log(shopImagesBae64)
            that.uploadImage(shopImagesBae64);//调用上传图片文件oss
          }
        });
        
      },
    })
  },
  //删除图片
  delShopImages: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let shopImages = this.data.shopImages;
    shopImages.splice(index, 1)
    that.setData({
      shopImages: shopImages
    })

  },
  // 上传图片到oss文件
  uploadImage:function(shopImagesBae64){
    let that = this;
    let token = wx.getStorageSync('token');
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
  },
  // 设置定位
  chooseLocation(e) {
    console.log(e)
    var that = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          locationName: res.address + res.name,
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
    })
  },
  //勾选阅读同意协议
  read_agreement:function(){
    const that = this
    that.setData({
      is_agreement:!that.data.is_agreement
    })
  },
  //前往协议
  agreement:function(){
    wx.navigateTo({
      url: '/pages/my/applicationMerchant/agreement/agreement',
    })
  },
  // 提交申请
  sumbit:function () {
    let that = this;
    if(that.data.is_agreement){
      const that = this;
      const token = wx.getStorageSync('token');
      const supplier_img_json = JSON.stringify(that.data.shopImages);
      const supplier_name = that.data.supplier_name;
      const supplier_intro = that.data.supplier_intro;
      const address_base = that.data.locationName;
      const address_detail = that.data.address_detail;
      const address_lat = that.data.latitude;
      const address_lng = that.data.longitude;
      const leader_name = that.data.leader_name;
      const leader_tel = that.data.leader_tel;
      // console.log(supplier_img_json,supplier_name,supplier_intro,address_base,address_detail,address_lat,address_lng,leader_name,leader_tel)
      if(supplier_img_json == ''||supplier_name == ''||supplier_intro == ''||address_base == ''||address_detail == ''||address_lat == ''||address_lng == ''||leader_name == ''||leader_tel == ''){
        wx.showModal({
          title:'提示',
          content:'请将信息填写完整',
          showCancel:false,
          confirmText:'确定',
          confirmColor:"#646981",
        })
        return false
      }
      let telReq = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;//校验手机号码
      if(!telReq.test(leader_tel)){
        wx.showToast({
          title:'请输入正确的手机号码',
          icon:'none'
        })
        return false
      }
      utils.util.post(api.addSupplierApply,{
        token:token,
          supplier_name:supplier_name,
          supplier_intro:supplier_intro,
          address_base:address_base,
          address_detail:address_detail,
          address_lat:address_lat,
          address_lng:address_lng,
          leader_name:leader_name,
          leader_tel:leader_tel,
          supplier_img_json:supplier_img_json
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
        title:'请先阅读并同意《平台用户协议》',
        icon:"none"
      })
    }
  }
})