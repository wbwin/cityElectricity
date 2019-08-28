// pages/my/orderManagement/applyForRefund/applyForRefund.js
import config from "../../../../utils/config"
import api from "../../../../utils/api"
import utils from "../../../../utils/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    voucherImage:[],
    refundImages:[],
    rightIcon:'../../../../images/content_more_right.png',
    shopIcon:'../../../../images/25a771df8db1cb1347a6428fda54564e93584b69.jpg',
    token:'',
    osscdn:'',
    order_sn:'',
    orderData:'',
    aftersafe_content:'',//退款原因
    type:1//1退款2售后
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var _title=options.type==1?'申请退款':'申请售后'
    wx.setNavigationBarTitle({
      title: _title
    })
    that.setData({
      order_sn:options.order_sn,
      type:options.type,
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
    var that=this
    that.setData({
      token:wx.getStorageSync('token')
    })
    that.getOrderDetail()
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
    that.getOrderDetail()
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
  //选择店铺图片
  chooseVoucherImages: function (e) {
    var that = this
    var voucherImage = that.data.voucherImage
    wx.chooseImage({
      count: 3 - voucherImage.length,
      success: function (res) {
        console.log()
        voucherImage = voucherImage.concat(res.tempFilePaths)
        that.setData({
          voucherImage: voucherImage
        })
        console.log(that.data.voucherImage)
      },
    })
  },
  //选择店铺图片
  //删除图片
  imgDel:function(e){
    var that=this
    var i =e.currentTarget.dataset.index
    var voucherImage = that.data.voucherImage
    voucherImage.splice(i,1);
    that.setData({
      voucherImage:voucherImage,
    })
  },
  //获取订单退款详情
  getOrderDetail:function(){
    var that=this
    utils.util.post(api.getOrderDetail,{
      token:that.data.token,
      order_sn:that.data.order_sn,
    },res=>{
      
      var orderData=res.data
      orderData.createtime=utils.formatTime(new Date(orderData.createtime*1000))
      orderData.paytime=utils.formatTime(new Date(orderData.paytime*1000))
      that.setData({
        osscdn:res.osscdn,
        orderData:orderData
      })
    })
  },
  //退款原因
  refundInput:function(e){
    var that=this
    that.setData({
      aftersafe_content: e.detail.value
    })
  },
  //提交
  submit:function(e){
    var that=this
    var aftersafe_content=that.data.aftersafe_content
    var voucherImage=that.data.voucherImage
    if(aftersafe_content==''){
      wx.showToast({
        icon:'none',
        title:'请填写退款原因'
      })
      return false
    }
    if(voucherImage.length>0){
      wx.showLoading({
        title: '正在上传图片',
        mask: true
      })
      for(var i in voucherImage){
        wx.getFileSystemManager().readFile({
          filePath: voucherImage[i],//选择图片返回的相对路径
          encoding:'base64',
          success:res => {
            let shopImagesBae64 = res.data;
            that.uploadImage(shopImagesBae64);//调用上传图片文件oss
          }
        });  
      }
    }else{
      var aftersafe_img_json=JSON.stringify(that.data.refundImages)
      console.log(aftersafe_img_json)
      utils.util.post(api.addAftersafeInfo,{
        token:that.data.token,
        order_sn:that.data.order_sn,
        aftersafe_content:aftersafe_content,
        aftersafe_img_json:aftersafe_img_json,
        type:that.data.type
      },res=>{

      })
    }
      
  },
  // 上传图片到oss文件
  uploadImage:function(shopImagesBae64){
    let that = this;
    var token = wx.getStorageSync('token');
    var refundImages = that.data.refundImages;
    wx.request({
      url: config.ApiUrl + api.ossUploadImage,
      data: {
        token:token,
        base64:'data:image/jpeg;base64,'+shopImagesBae64
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        refundImages.push(res.data.data.file)
        that.setData({
          refundImages: refundImages
        })
        //提交退款
        console.log(refundImages)
        if(refundImages.length==that.data.voucherImage.length){
          var aftersafe_img_json=JSON.stringify(that.data.refundImages)
          utils.util.post(api.addAftersafeInfo,{
            token:that.data.token,
            order_sn:that.data.order_sn,
            aftersafe_content:that.data.aftersafe_content,
            aftersafe_img_json:aftersafe_img_json,
            type:that.data.type
          },res=>{
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              showCancel:false,
              content: '退款申请已提交，请耐心等候',
              confirmText:'好的',
              success (res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta:1,
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          })
        }
      }
    })
  }
})