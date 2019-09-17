// pages/dynamicDetails/dynamicDetails.js
import api from "../../utils/api"
import utils from "../../utils/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 动态
    triangleShow: false,
    commentInputShow: false,
    commentValue: '',
    // 动态
    dynamics_id:'',//动态id
    token:'',
    osscdn:'',
    dynamicsData:'',//动态数据
    openOther:false,//展开点赞人数
    onShowTrue:false,
    videoToPlay:false,
    videoHeight:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var dynamics_id=options.dynamics_id
    that.setData({
      dynamics_id:dynamics_id,
      token:wx.getStorageSync('token')
    })
    that.getDynamicsDetail()
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
    if(!that.data.onShowTrue){
      that.setData({
        onShowTrue:true
      })
        return false
    }
    that.getDynamicsDetail()
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
    var that=this
    that.getDynamicsDetail()
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
      var dynamics_id=that.data.dynamics_id
      var dynamicsData=that.data.dynamicsData
      var imageUrl=dynamicsData.img_json.length>0?that.data.osscdn+dynamicsData.img_json[0]:'/images/logo.png'
      console.log(res.target)
      return {
        title: dynamicsData.shop_info.shop_name+dynamicsData.content,
        path: '/pages/dynamicDetails/dynamicDetails?dynamics_id='+dynamics_id,
        imageUrl:imageUrl
      }
    }else{
      return {
        title: '同橙电商',
        path: '/pages/my/my',
        imageUrl:'/images/logo.png',
      }
    }
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
  getDynamicsDetail:function(){
    var  that=this
    var dynamics_id=that.data.dynamics_id
    utils.util.post(api.getDynamicsDetail,{
      dynamics_id:dynamics_id,
      token:that.data.token,
      // unLoading:true,
    },res=>{
      var dynamicsData=res.data
      dynamicsData.img_json=JSON.parse(dynamicsData.img_json)
      dynamicsData.video_json=JSON.parse(dynamicsData.video_json)
      that.setData({
        dynamicsData:dynamicsData,
        osscdn:res.osscdn
      })
    })
  },
  openOtherTap:function(){
    var that=this
    var openOther=!that.data.openOther
    that.setData({
      openOther:openOther
    })
  },
  //赞
  fabulous:function(e){
    var that=this
    var dynamics_id=e.currentTarget.dataset.dynamics_id
    var like_status=e.currentTarget.dataset.is_like
    var dynamicsData=that.data.dynamicsData
    like_status=like_status==0?'1':'0'
    utils.util.post(api.setDynamicsLike,{
      dynamics_id:dynamics_id,
      like_status:like_status,
      token:wx.getStorageSync('token')
    },res=>{
      if(like_status==1){
        wx.showToast({
          icon:'none',
          title:'点赞成功'
        })
        var userAvatar=wx.getStorageSync('loginResult').avatar
        dynamicsData.like_info.push({avatar:userAvatar,user_id:wx.getStorageSync('userId')})
      }else{
        wx.showToast({
          icon:'none',
          title:'取消点赞成功'
        })
        for(var i in dynamicsData.like_info){
          if(dynamicsData.like_info[i].user_id==wx.getStorageSync('userId')){
            dynamicsData.like_info.splice(i,1)
          }
        }
      }
      dynamicsData.is_like=like_status
      that.setData({
        dynamicsData:dynamicsData,
        triangleShow: !that.data.triangleShow
      })
    })
  },
  //发送评论
  sendComment:function(){
    var that=this
    var dynamics_id=that.data.dynamics_id
    var commentValue=that.data.commentValue
    if(commentValue==''){
      return false
    }
    console.log(wx.getStorageSync('userId'))
    utils.util.post(api.addDynamicsComment,{
      dynamics_id:dynamics_id,
      content:commentValue,
      token:that.data.token,
      id:wx.getStorageSync('userId')
    },res=>{
      that.setData({
        commentInputShow:false,
        commentValue:'',
      })
      wx.showToast({
        icon:'none',
        title:'评论成功'
      })
      setTimeout(function(){
        that.getDynamicsDetail()
      },1500)
      
    })
  },
  //查看大图
  previewImage:function(e){
    var that=this
    that.setData({
      onShowTrue:false
    })
    var index=e.currentTarget.dataset.index
    var dynamicsData=that.data.dynamicsData
    var img_array=JSON.parse(JSON.stringify(dynamicsData.img_json))
    var osscdn=that.data.osscdn
    for(var i in img_array){
      img_array[i]=osscdn+img_array[i]
    }
    utils.previewImage(img_array,img_array[index])
  },
  //动态地址
  openDynamicLocation:function(e){
    var that=this
    var dynamicsData=that.data.dynamicsData
    var shop_info=dynamicsData.shop_info
    utils.openLocation(Number(shop_info.address_lat),Number(shop_info.address_lng),shop_info.address_base+shop_info.address_detail)
  },
  //视频处理
  bindplay:function(e){
    var that=this
  },
  bindpause:function(e){
    var that=this
    that.setData({
      videoToPlay:false,
    })
  },
  bindended:function(e){
    var that=this
    that.setData({
      videoToPlay:false,
    })
  },
  //
  videoPlay:function(){
    var that=this
    var videoplay = wx.createVideoContext('myVideo')
    videoplay.play()
    that.setData({
      videoToPlay:true
    })
  },
  imageLoad:function(e){
    var that=this
    console.log(e)
    var height=375/e.detail.width*e.detail.height
    that.setData({
      videoHeight:height
    })
  }
})