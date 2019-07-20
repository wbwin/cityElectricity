// pages/goods/goods.js
var sliderWidth = 26;
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    slideImageIndex: 0,
    /*轮播*/
    /*切换*/
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    /*切换*/
    /*显示弹出层*/
    showBuyFram: false,
    animationData: {},
    /*显示弹出层*/
    /*拼团弹出层*/
    // showAssembleFrame:false,
    assembleFrame: 0,
    /*拼团弹出层*/
    /*联系店主*/
    showShopContact: 0,
    /*初始规则选择*/
    isSelect: '',
    /*购买数量*/
    shopNumber: '1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    /*切换*/
    wx.getSystemInfo({
      success: function (res) {
        /**
         * sliderLeft 选中览的位置
         * sliderOffset 偏移多少
         * sliderWidth 导航栏的宽度
         */
        that.setData({
          sliderLeft: (res.windowWidth / 2 - sliderWidth) / 2,
          sliderOffset: res.windowWidth / 2 * that.data.activeIndex
        });
      }
    });
    /*切换*/
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
  //图片轮播
  slideImageChange: function (e) {
    this.setData({
      slideImageIndex: e.detail.current
    })
  },
  //图片轮播
  //切换tab
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.dataset.index
    });
  },
  //切换tab
  /*弹出层*/
  showBuyFram: function () {
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 300,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(0).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      showBuyFram: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },
  hideBuyFram: function (e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(846).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function () {
      animation.translateY(846).step()
      that.setData({
        animationData: animation.export(),
        showBuyFram: false
      })
    }, 500)
  },
  /*弹出层*/
  // showAssembleFrame:function(e){
  //   var that=this
  //   that.setData({
  //     showAssembleFrame: true
  //   })
  // },
  // hideAssembleFrame:function(e){
  //   var that=this
  //   that.setData({
  //     showAssembleFrame: false
  //   })
  // },
  /*联系店主*/
  showShopContact() {
    this.setData({
      showShopContact: !this.data.showShopContact
    })
  },
  /*联系电话*/
  phoneCall: function () {
    wx.makePhoneCall({
      phoneNumber: '10086'
    })
  },
  /*复制微信号*/
  setClipboardData: function () {
    wx.setClipboardData({
      data: 'wx10086',
      success: function () {
        wx.showToast({
          icon: 'none',
          title: '复制成功'
        })
      }
    })
  },
  /*选择规则*/
  select: function (e) {
    console.log(e)
    const that = this
    const index = e.currentTarget.dataset.index
    that.setData({
      isSelect: index
    })
  },
  /*减少购买数量*/
  reduceShopNumber: function () {
    const that = this
    let shopNumber = that.data.shopNumber
    if (shopNumber <= 1) {
      wx.showToast({
        icon: 'none',
        title: '购买数量不能小于1'
      })
      return false
    }
    shopNumber = --shopNumber
    that.setData({
      shopNumber: shopNumber
    })
  },
  /*增加购买数量*/
  addShopNumber: function () {
    const that = this
    const shopNumber = ++that.data.shopNumber
    that.setData({
      shopNumber: shopNumber
    })
  },
  /*确定订单*/
  sure: function () {
    wx.navigateTo({
      url: '/pages/goods/confirmationOrder/confirmationOrder'
    })
  }
})