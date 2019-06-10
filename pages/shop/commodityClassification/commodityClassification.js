// pages/shop/commodityClassification/commodityClassification.js
var sliderWidth = 26;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*商品分类*/ 
    classifly_list:['全部','外套','卫衣','裙装','上衣','裤装','运动服','配饰'],
    toView:'index0',
    sliderOffset: 0,
    sliderLeft: 0,
    activeIndex:0,
    linewidth:'56px',
    /*商品分类*/
    /*排序分类*/
    sortIndex:0,
    /*排序分类*/
    /*搜索框*/
    inputShowed: false,//搜索框
    inputVal: "",//搜索框内容
    /*搜索框*/
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.getSystemInfo({
      success: function (res) {
        /**
        * sliderLeft 选中览的位置
        * sliderOffset 偏移多少
        * sliderWidth 导航栏的宽度
        */
        that.setData({
          sliderLeft: (res.windowWidth / that.data.classifly_list.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.classifly_list.length * that.data.activeIndex
        });
      }
    });
    
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
  //搜索框
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  //搜索框
  //商品分类选择
  classiflyChoose:function(e){
    var that = this
    var i = e.target.dataset.index
    this.setData({
      toView:'index'+i,
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: i
    })
    /*获取当前元素的宽度*/
    var query = wx.createSelectorQuery();
    query.select('#index'+i).boundingClientRect(function (rect) {
      that.setData({
        linewidth: rect.width + 'px'
      })
    }).exec();
  },
  //商品分类选择
  sortChoose:function(e){
    var that=this
    var index=e.target.dataset.index
    that.setData({
      sortIndex:index
    })
    
  }
  //商品分类选择
})