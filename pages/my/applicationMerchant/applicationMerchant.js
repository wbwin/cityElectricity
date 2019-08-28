// pages/my/applicationMerchant/applicationMerchant.js
import config from "../../../utils/config"
import api from "../../../utils/api"
import utils from "../../../utils/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    applyStatus:'',//保存用户商家、供应商申请状态
    shop_status:'',//保存用户上架申请状态
    supplier_status:''//保存用户供应商申请状态
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
    that.getApplyStatus();//调用获取用户申请商家 供应商状态

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
  //获取用户申请店铺 供应商状态
  getApplyStatus:function () {
    let that = this;
    let token = wx.getStorageSync('token');
    utils.util.post(api.getApplyStatus,{
      token:token
    },res=>{
      that.setData({
        applyStatus:res.data,
        shop_status:res.data.shop.apply_status,
        supplier_status:res.data.supplier.apply_status
      })
      //店主、供应商判断状态
        //apply_status为400为未申请过
        //apply_status为0为未审核
        //apply_status为1为已通过
        //apply_status为2为未通过
    })
   
  },
  // 选择店铺 供应商
  apply_tap:function (e) {
    let that = this;
    let type = e.target.dataset.name;
    if(type == 'shop'){
        switch(that.data.shop_status)
      {
        case 0:
          wx.showModal({
            title:'提示',
            content:'申请正在审核中，请耐心等候',
            showCancel:false,
            confirmText:'确定',
            confirmColor:"#646981"
          })
          break;
        case 1:
          wx.navigateTo({
            url: '../applicationMerchant/auditResults/auditResults?status=success&type=shop'
          })
          break;
        case 2:
          wx.navigateTo({
            url: '../applicationMerchant/auditResults/auditResults?status=fail&type=shop'
          })
          break;
        default:
          wx.navigateTo({
            url: './shopApplication/shopApplication'
          })
          break;
      }
    }else if(type == 'supplier'){
      switch(that.data.supplier_status)
      {
        case 0:
          wx.showModal({
            title:'提示',
            content:'申请正在审核中，请耐心等候',
            showCancel:false,
            confirmText:'确定',
            confirmColor:"#646981",
          })
          break;
        case 1:
          wx.navigateTo({
            url: '../applicationMerchant/auditResults/auditResults?status=success&type=supplier'
          })
          break;
        case 2:
          wx.navigateTo({
            url: '../applicationMerchant/auditResults/auditResults?status=fail&type=supplier'
          })
          break;
        default:
          wx.navigateTo({
            url: './supplierApplication/supplierApplication'
          })
          break;
      }
    }
  }
})