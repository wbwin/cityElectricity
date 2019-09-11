// pages/my/wallet/detailsOfAmount/detailsOfAmount.js
import api from "../../../../utils/api"
import utils from "../../../../utils/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    walletList: '',
    toggle: 1,
    page: 1,
    onShowTrue: false,
    showBottomTips: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    const toggle = options.toggle
    const type = options.type
    var title = toggle == 1 ? '已结算金额明细' : '未结算金额明细';
    title = type == 2 ? '供应商' + title : '店主' + title
    wx.setNavigationBarTitle({
      title: title
    })
    that.setData({
      toggle: toggle,
      type: type,
      page: 1,
      token: wx.getStorageSync('token')
    })
    that.getAdminWallet()
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
    var that = this
    that.setData({
      token: wx.getStorageSync('token')
    })
    if (!that.data.onShowTrue) {
      that.setData({
        onShowTrue: true
      })
      return false
    }
    that.getAdminWallet()
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
    var that = this
    that.setData({
      page: 1,
    })
    that.getAdminWallet(); //加载数据
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    if (that.data.showBottomTips || that.data.walletList.length == 0) {
      return false
    }
    var page = Number(that.data.page) + 1
    that.setData({
      page: page
    })
    that.getAdminWallet()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this
    if (res.from == "button") {

    } else {
      return {
        title: '同橙电商',
        path: '/pages/my/my',
        imageUrl: '/images/logo.png',
      }
    }
  },
  //获取钱包明细
  getAdminWallet: function () {
    var that = this
    var toggle = that.data.toggle
    var type = that.data.type
    var is_settle = toggle == 1 ? '1' : '0'
    var page = that.data.page
    var walletList = page == 1 ? [] : that.data.walletList
    if (page == 1) {
      that.setData({
        showBottomTips: false
      })
    }
    utils.util.post(api.getAdminWallet, {
      is_settle: is_settle,
      token: that.data.token,
      unLoading: true,
      type: type,
      page: page,
      limit: 10
    }, res => {
      var list = res.data.list
      if (list.length > 0) {
        walletList = walletList.concat(list)
        that.setData({
          walletList: walletList,
          osscdn: res.osscdn
        })
      } else {
        that.setData({
          showBottomTips: page == 1 ? false : true,
          walletList: walletList,
        })
      }
    })
  },

})