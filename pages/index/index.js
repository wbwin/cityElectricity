//index.js
//获取应用实例
const app = getApp()
var sliderWidth = 26;
Page({
  data: {
    tabs: ["列表", "动态"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    fansNumber: 10,
    // 动态
    triangleShow: false,
    commentInputShow: false,
    commentValue: '',
    // 动态
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
    actionSheetHidden:false,
    previewImageArray:['../../images/25a771df8db1cb1347a6428fda54564e93584b69.jpg']
  },
  onLoad: function () {
    var that = this;
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
    console.log(this.data.triangleShow)
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
  // 动态详情
  dynamicDetails: function () {
    wx.navigateTo({
      url: '/pages/dynamicDetails/dynamicDetails'
    })
  },
  actionSheetChange: function () {
    const that = this;
    that.setData({
      actionSheetHidden:true
    })
  },
  onShareAppMessage: function () {
    return {
      title: '同橙电商',
      path: '/images/template/dynamicList/dynamicList'
    }
  },
  //查看动态 放大图片
  previewImage:function(){
    const that = this
    wx.previewImage({
      // current: 'String', // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: that.data.previewImageArray,
      success: function(res){
        console.log(res)
      },
      fail: function() {
        
      },
      complete: function() {
        // complete
      }
    })
  }

})