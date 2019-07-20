// pages/shop/shop.js
var sliderWidth = 26;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*列表切换*/ 
    tabs: ["商品", "动态","介绍"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    /*列表切换*/
    /*轮播*/ 
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    /*轮播*/
    // 动态
    triangleShow: false,
    commentInputShow: false,
    commentValue: '',
    // 动态
    /*商品分类*/
    goodsClassify:[
      {icon:'../../images/shop_all_icon.png',name:'全部'},
      { icon: '../../images/shop_coat_icon.png', name: '外套' },
      { icon: '../../images/shop_skirt_icon.png', name: '裙装' },
      { icon: '../../images/shop_Jacket_icon.png', name: '上装' },
      { icon: '../../images/shop_pants_icon.png', name: '裤装' },
      { icon: '../../images/shop_pants_other.png', name: '其他' }

    ],
    /*商品分类*/
    /*商家商品类型*/
    
    /*商家商品类型*/
    /*联系店主*/
    showShopContact: 0,
    /*联系店主*/
    src:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    wx.request({
      url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=23_EdrgUS7MxtR7ajHPBGMszqihc0dmik7RLs6Gaot3cLnGywN35cv9Y4ohZSPQtiLBLQjW2AGZr4yFP3bZq6HoWppDs6jE6UwTMNS1kvq2SasS7mQJqGTU5VmMp19cYgAMvuOWAIivsuu0iQ3SLYJbACAREP',
      data:{
        scene:'000',
        page:'/pages/index/index'
      },
      method: 'POST',
      responseType:'arraybuffer',//设置相应类型
      success(res){
        console.log(res)
        var src = wx.arrayBufferToBase64(res.data);
        that.setData({
          src:that.data.src
        })

      },
      fail: function() {
        // fail
      }
    })
    /*列表切换*/
    wx.getSystemInfo({
      success: function (res) {
        /**
        * sliderLeft 选中览的位置
        * sliderOffset 偏移多少
        * sliderWidth 导航栏的宽度
        */
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    /*列表切换*/
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
   tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  // 动态
  triangleClick: function () {
    var triangleShow = !this.data.triangleShow
    this.setData({
      triangleShow: triangleShow
    })
    console.log(this.data.commentValue)
  },
  showInput: function () {
    this.setData({
      commentInputShow: !this.data.commentInputShow,
      triangleShow: false,
    })

  },
  commentInput: function (e) {
    this.setData({
      commentValue: e.detail.value
    })
  },
  onPageScroll: function (e) {
    if (this.data.commentInputShow) {
      this.setData({
        commentInputShow: false,
      })
    }
  },
  // 动态
  /*联系店主*/
  showShopContact() {
    this.setData({
      showShopContact: !this.data.showShopContact
    })
  },
  // 动态详情
  dynamicDetails:function () {
    wx.navigateTo({
      url: '/pages/dynamicDetails/dynamicDetails'
    })
  }
  /*联系店主*/
})