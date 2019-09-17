// pages/goods/goods.js
import config from "../../utils/config"
import api from "../../utils/api"
import utils from "../../utils/utils"
var sliderWidth = 26;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsDetail:'',
    /*轮播*/
    imgUrls: [],
    indicatorDots: false,
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
    /*联系店主*/
    showShopContact: 0,
    /*初始购买数量*/
    shopNumber: '1',
    /*选择规格*/
    isSelect:'',
    //图片地址访问路径
    osscdn:'',
    token:wx.getStorageSync('token'),
    //商品id
    goods_id:'',
    shop_id:'',
    spec_json:"",//规格
    order_goods_spec:[],//选择的规格
    collectType:0,//收藏状态
    stock:0,//选择的商品库存
    goods_video:'',//商品视频
    goods_cover:'',//商品图片
    goods_price:'',//规格商品价格
    videoToPlay:false,
    collect:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    const goods_id = options.goods_id;//商品id
    const shop_id=options.shop_id
    var collect=options.collect
    that.setData({
      goods_id: goods_id,
      shop_id:shop_id,
      collect:collect,
    });
    if(collect==1){
      that.shopFollow()
    }
    
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
    that.setData({
      token:wx.getStorageSync('token')
    })
    that.goodsDetail(that.data.goods_id);//商品详情
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
    // that.setData({
    //   token:wx.getStorageSync('token')
    // })
    // that.goodsDetail(that.data.goods_id);//商品详情
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
    that.goodsDetail(that.data.goods_id);//商品详情
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
    var that=this
    return {
      title: that.data.goodsDetail.goods_name,
      path: '/pages/goods/goods?collect=1&goods_id='+that.data.goods_id+'&shop_id='+that.data.shop_id,
      imageUrl:that.data.osscdn+that.data.goodsDetail.goods_cover
    }
  },
  goodsDetail:function(goods_id){
    console.log(11)
    const that = this;
    utils.util.post(api.goodsDetail,{
      goods_id:goods_id,
      token:wx.getStorageSync('token'),
      shop_id:that.data.shop_id,
    },res=>{
      //判断商品是否有视频
      var banner_img_json=JSON.parse(res.data.banner_img_json)
      var goods_video='';
      for(var i=banner_img_json.length-1;i>=0;i--){
        if(banner_img_json[i].indexOf('.mp4')!=-1){
          goods_video=banner_img_json[i]
          banner_img_json.splice(i,1)
        }
      }
      //显示商品的价格
      var spec_json=JSON.parse(res.data.spec_json)
      if(!spec_json.length>0){
        var spec_json=[]
        spec_json.push(JSON.parse(res.data.spec_json))
      }
      var spec_stock_price=[]
      var goods_price=''
      if(spec_json){
        for(var i in res.data.spec_stock){
          spec_stock_price.push(res.data.spec_stock[i].price)
        }
        spec_stock_price.sort();
        if(spec_stock_price[0]==spec_stock_price[spec_stock_price.length-1]){
          goods_price=spec_stock_price[0]
        }else{
          goods_price=spec_stock_price[0]+'-'+spec_stock_price[spec_stock_price.length-1]
        }
      }else{
        goods_price=res.data.price
      }
      that.setData({
        goodsDetail:res.data,
        imgUrls:banner_img_json,
        goods_video:goods_video,
        osscdn:res.osscdn,
        spec_json:spec_json,
        collectType:res.data.is_collect,
        goods_price:goods_price,
        goods_cover:res.data.goods_cover,
      })
      for(var i in spec_json){
        that.secSelect(i,0)
      }
      
    })
  },
  //图片轮播
  slideImageChange: function (e) {
    var that=this
    if(that.data.goods_video){
      var videoContext = wx.createVideoContext('myVideo')
      videoContext.pause()
    }
    that.setData({
      slideImageIndex: e.detail.current
    })
  },
  //图片轮播
  //切换tab
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft-28,
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
  /*确定*/
  sure: function (e) {
    var that=this
    var spec_json=that.data.spec_json
    var stock=that.data.stock
    var shopNumber=that.data.shopNumber
    var shop_id=that.data.shop_id
    var goods_id=that.data.goods_id
    var spec=that.data.order_goods_spec.join(',')
    var num=that.data.shopNumber
    var order_type=that.data.goodsDetail.label==2?'1':'2'
    
    //判断是否选择了规格
    if(that.data.order_goods_spec.length!=spec_json.length){
      wx.showToast({
        icon:'none',
        title:'请先选择规格'
      })
      return false;
    }
    //判断是否超过库存
    if(shopNumber>=stock){
      wx.showToast({
        icon:'none',
        title:'购买数量不能超过库存数',
      })
      return false
    }
    var orderMsg={
      shop_id:shop_id,
      goods_id:goods_id,
      spec:spec,
      num:num,
      order_type:order_type
    }
    
    console.log(JSON.stringify(orderMsg))
    wx.navigateTo({
      url: '/pages/goods/confirmationOrder/confirmationOrder?orderMsg='+JSON.stringify(orderMsg),
    })
  },
  /*联系店主*/
  showShopContact() {
    var that=this
    wx.showActionSheet({
      itemList: ['拨打电话', '复制微信号'],
      success (res) {
        console.log(res.tapIndex)
        if(res.tapIndex==0){
          that.phoneCall();
        }else{
          that.setClipboardData();
        }
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
    // this.setData({
    //   showShopContact: !this.data.showShopContact
    // })
  },
  /*拨打电话*/
  phoneCall: function () {
    const that = this;
    const phone = that.data.goodsDetail.shop_leader.leader_tel;
    if(phone){
      wx.makePhoneCall({
        phoneNumber:phone
      })
    }else{
      wx.showModal({
        title:'提示',
        content:'店主很懒，没有留下手机号码',
        showCancel:false,
        confirmText:'确定',
        confirmColor:"#646981"
      })
    }
  },
  /*复制微信号*/
  setClipboardData: function () {
    const that = this;
    const wechat = that.data.goodsDetail.shop_leader.leader_wechat;
    if(wechat){
      wx.setClipboardData({
        data:wechat,
        success(res){
          wx.showToast({
            title:'复制成功'
          })
        }
      })
    }else{
      wx.showModal({
        title:'提示',
        content:'店主很懒，没有留下微信号码',
        showCancel:false,
        confirmText:'确定',
        confirmColor:"#646981"
      })
    }
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
    //判断是否超过库存
    var stock=that.data.stock
    if(that.data.shopNumber>=stock){
      wx.showToast({
        icon:'none',
        title:'购买数量不能超过库存数',
      })
      return false
    }
    const shopNumber = ++that.data.shopNumber
    
    that.setData({
      shopNumber: shopNumber
    })
  },
  /*选择不同的规格*/
  select: function (e) {
    console.log(e)
    const that = this
    const spec_index = e.currentTarget.dataset.spec_index
    const spec_children_index=e.currentTarget.dataset.spec_children_index
    var spec_stock=that.data.goodsDetail.spec_stock
    var spec_json=that.data.spec_json
    spec_json[spec_index].isSelect=spec_children_index
    var order_goods_spec=that.data.order_goods_spec
    order_goods_spec[spec_index]=spec_json[spec_index].children[spec_children_index]
    //不同商品规格显示不同价格和图片
    var spec=order_goods_spec.join(',')
    for(var i in spec_stock){
      if(spec==spec_stock[i].spec){
        that.setData({
          goods_price:spec_stock[i].price,
          goods_cover:spec_stock[i].image,
          stock:spec_stock[i].stock,
        })
        break;
      }
    }
    that.setData({
      spec_json:spec_json,
      order_goods_spec:order_goods_spec
    })
    console.log(that.data.order_goods_spec)
  },
   /*传参数选择不同的规格*/
   secSelect: function (spec_index,spec_children_index) {
    const that = this
    // const spec_index = e.currentTarget.dataset.spec_index
    // const spec_children_index=e.currentTarget.dataset.spec_children_index
    var spec_stock=that.data.goodsDetail.spec_stock
    var spec_json=that.data.spec_json
    spec_json[spec_index].isSelect=spec_children_index
    var order_goods_spec=that.data.order_goods_spec
    order_goods_spec[spec_index]=spec_json[spec_index].children[spec_children_index]
    //不同商品规格显示不同价格和图片
    var spec=order_goods_spec.join(',')
    for(var i in spec_stock){
      if(spec==spec_stock[i].spec){
        that.setData({
          goods_price:spec_stock[i].price,
          goods_cover:spec_stock[i].image,
          stock:spec_stock[i].stock,
        })
        break;
      }
    }
    that.setData({
      spec_json:spec_json,
      order_goods_spec:order_goods_spec
    })
    console.log(that.data.order_goods_spec)
  },
  //修改收藏状态
  changeCollect:function(e){
    var that=this
    var collectType=that.data.collectType
    var collect_status=collectType==0?'1':'0'
    utils.util.post(api.setGoodsCollect,{
      token:that.data.token,
      goods_id:that.data.goods_id,
      shop_id:that.data.shop_id,
      collect_status:collect_status
    },res=>{
      if(collect_status==0){
        wx.showToast({
          title: '取消收藏成功',
          icon: 'success',
          duration: 2000
        })
      }else{
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          duration: 2000
        })
      }
      that.setData({
        collectType:collect_status
      })
    })
  },
  //视频处理
  bindplay:function(e){
    var that=this
    that.setData({
      autoplay:false,
    })
  },
  bindpause:function(e){
    var that=this
    that.setData({
      autoplay:true,
      videoToPlay:false,
    })
  },
  bindended:function(e){
    var that=this
    that.setData({
      autoplay:true,
      videoToPlay:false,
    })
  },
  //查看商品图片
  previewImage:function(){
    var that=this
    var img_array=[that.data.osscdn+that.data.goods_cover]
    utils.previewImage(img_array)
  },
  previewImageNav:function(e){
    const that = this
    that.setData({
      onShowTrue:false
    })
    // var imgUrls=JSON.parse(JSON.stringify(that.data.imgUrls))
    var banner_image=that.data.goodsDetail.banner_image
    var imgUrls=[]
    for(var i in banner_image){
      imgUrls.push(banner_image[i].image)
    }
    var index=e.currentTarget.dataset.index
    var osscdn=that.data.osscdn
    for(var i in imgUrls){
      imgUrls[i]=osscdn+imgUrls[i]
    }
    console.log(imgUrls[index])
    console.log(imgUrls)
    utils.previewImage(imgUrls,imgUrls[index])
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
  //用户关注店铺
  shopFollow:function(){
    const that = this;
    const shop_id = that.data.shop_id;
    const token=wx.getStorageSync('token')
    wx.request({
      url: config.ApiUrl + api.setGoodsFans,
      data: {
        token:token,
          fans_status:1,
          shop_id:shop_id,
      },
      method: 'POST',
      success(res) {
        console.log(res)
      },
      complete(data){
        console.log(data)
        // that.getUserShop()
      }
    })
  },
  //回到首页
  backIndex:function(){
    console.log(12)
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
})