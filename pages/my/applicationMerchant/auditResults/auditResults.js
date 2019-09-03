// pages/my/applicationMerchant/auditResults/auditResults.js
import api from "../../../../utils/api"
import utils from "../../../../utils/utils"
import config from "../../../../utils/config";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    apply_success:'/images/apply-success.png',
    apply_fail:'/images/apply-fail.png',
    apply_state:'',//申请状态
    shop:'',//承载申请商家
    is_shop:'',
    is_supplier:'',
    supplier:'',//承载申请供应商
    type:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;
    that.getApplyStatus();//拿到申请状态
    let status = options.status;
    let type = options.type;
    if(type == 'shop'){
      if(status == 'success'){
        that.setData({
          apply_state:true,
          is_shop:true,
          type:type
        })
      }else if(status == 'fail'){
        that.setData({
          apply_state:false,
          is_shop:false,
          type:type
        })
      }
    }else if(type == 'supplier'){
      if(status == 'success'){
        that.setData({
          apply_state:true,
          is_supplier:true,
          type:type
        })
      }else if(status == 'fail'){
        that.setData({
          apply_state:false,
          is_supplier:false,
          type:type
        })
      }
    }

    
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
  // 提交申请失败，重新提交信息
  submitInfo:function () {
    //提交失败，判断是店铺申请失败还是供应商申请失败
    let that = this;
    let type = that.data.type;
    if(type == 'shop'){
      wx.redirectTo({
        url: '../../../my/applicationMerchant/shopApplication/shopApplication'
      })
    }
    if(type == 'supplier'){
      wx.redirectTo({
        url: '../../../my/applicationMerchant/supplierApplication/supplierApplication'
      })
    }
  },
  //获取用户申请店铺 供应商状态
  getApplyStatus:function () {
    let that = this;
    let token = wx.getStorageSync('token');
    wx.request({
      url: config.ApiUrl + api.getApplyStatus,
      data: {
        token:token,
        unLoading:true,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        that.setData({
          shop:res.data.data.shop,
          supplier:res.data.data.supplier
        })
      }
    })
  }
})