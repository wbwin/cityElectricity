// pages/my/wallet/cashWithdrawal/cashWithdrawal.js
import api from "../../../../utils/api"
import utils from "../../../../utils/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: '', //可提现的金额
    if_withdrawal: false,
    bankName:'',
    bankNumber:'',
    name:'',
    cashPrice:'',
    token:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.money)
    const that = this
    const money = options.money
    if (money > 100) {
      that.setData({
        money: money,
        if_withdrawal: true
      })
    } else {
      that.setData({
        money: money
      })
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
    var that=this
    that.setData({
      token:wx.getStorageSync('token')
    })
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
  //提现记录
  record:function(){
    wx.navigateTo({
      url: '/pages/my/wallet/discountRecord/discountRecord'
    })
  },
  //提现
  cash:function(){
    var that=this
    var bankName=that.data.bankName
    var bankNumber=that.data.bankNumber
    var name=that.data.name
    var cashPrice=that.data.cashPrice
    if(!that.data.if_withdrawal){
      wx.showModal({
        title:'提示',
        content:'金额不足100元，无法提现',
        showCancel:false,
        confirmText:'确定',
        confirmColor:"#646981",
      })
      return false
    }
    if(cashPrice<100){
      wx.showModal({
        title:'提示',
        content:'提现金额不能小于100',
        showCancel:false,
        confirmText:'确定',
        confirmColor:"#646981",
      })
      return false
    }
    if(!bankName||!bankNumber||!name||!cashPrice){
      wx.showModal({
        title:'提示',
        content:'请将信息填写完整',
        showCancel:false,
        confirmText:'确定',
        confirmColor:"#646981",
      })
      return false
    }
    if(!utils.checkCard(bankNumber)){
      wx.showModal({
        title:'提示',
        content:'银行卡号格式错误',
        showCancel:false,
        confirmText:'确定',
        confirmColor:"#646981",
      })
      return false
    }
    utils.util.post(api.addWithdrawInfo,{
      real_name:name,
      price:cashPrice,
      bank_name:bankName,
      bank_account:bankNumber,
      token:that.data.token,
    },res=>{
      wx.showModal({
        title:'提示',
        content:'提现申请成功',
        showCancel:false,
        confirmText:'好的',
        confirmColor:"#646981",
        success (res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/my/wallet/discountRecord/discountRecord'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    })
  },
  //银行名称
  bankNameInput:function(e){
    const that = this;
    that.setData({
      bankName:e.detail.value
    })
  },
  //卡号
  bankNumberInput:function(e){
    const that = this;
    that.setData({
      bankNumber:e.detail.value
    })
  },
  //姓名
  nameInput:function(e){
    const that = this;
    that.setData({
      name:e.detail.value
    })
  },
  cashPriceInput:function(e){
    const that = this;
    that.setData({
      cashPrice:e.detail.value
    })
  }
})