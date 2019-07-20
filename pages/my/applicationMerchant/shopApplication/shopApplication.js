// pages/my/applicationMerchant/shopApplication/shopApplication.js
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
    is_supplier:false//初始状态，未勾选申请成为供应商
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
  onShareAppMessage: function () {

  },
  //选择店铺头像
  // chooseShopHead:function(e){
  //   var that=this
  //   wx.chooseImage({
  //     count:1,
  //     success: function(res) {
  //       that.setData({
  //         shopHead: res.tempFilePaths[0]
  //       })
  //     },
  //   })
  // },
  //选择店铺头像
  //选择店铺图片
  chooseShopImages:function(e){
    var that=this
    var shopImages = that.data.shopImages
    wx.chooseImage({
      count: 5 - shopImages.length,
      success: function (res) {
        shopImages=shopImages.concat(res.tempFilePaths)
        that.setData({
          shopImages: shopImages
        })
      },
    })
  },
  //选择店铺图片
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
  //选择开始时间
  //选择结束时间
  bindEndTimeChange(e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  //选择结束时间
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
  }
})