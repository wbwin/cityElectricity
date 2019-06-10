//index.js
//获取应用实例
const app = getApp()
var sliderWidth = 26;
Page({
  data: {

    // 动态
    triangleShow: false,
    commentInputShow: false,
    commentValue: '',
    // 动态

  },
  onLoad: function () {

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
  }
  // 动态
})
