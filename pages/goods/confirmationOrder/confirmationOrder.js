// pages/goods/confirmationOrder/confirmationOrder.js
import api from "../../../utils/api"
import utils from "../../../utils/utils"
var sliderWidth = 26;
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk = new QQMapWX({
  key: 'MWKBZ-4TAKP-XOTDF-VKWQT-3WLQV-7YFHZ' //必填 暂时用了其他的项目密码
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*配送信息*/
    tabs: ["商家配送", "到店自取"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    /*配送信息*/
    /*地址信息*/
    addressName: '',
    addressPhone: '',
    addressMsg: '',
    addressTransformation: '',
    osscdn: '',
    token: wx.getStorageSync('token'),
    orderMsg: {}, //订单上传的信息
    orderData: '', //订单信息
    pay_price: '', //订单支付价格
    userLocation: '', //用户地址经纬度
    user_note: '', //留言
    get_name: '', //到店自取姓名
    get_tel: '', //到店自取电话
    order_sn: '', //订单编号
    logistics_price: 0,
    countDownText: '获取验证码',
    vcPhone: '', //验证码手机号
    verificationCode:'',//验证码
    mobileMask:false,//绑定手机提示框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // that.chooseAddress();
    /*切换*/
    var orderMsg = JSON.parse(options.orderMsg)
    console.log(orderMsg)
    that.setData({
      orderMsg: orderMsg
    })
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
    // that.setData({
    //   token:wx.getStorageSync('token')
    // })
    // that.initOrder()

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
    that.initOrder()

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
    that.initOrder()
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
    var that = this
    if (res.from == "button") {

    } else {
      return {
        title: '同橙电商',
        path: '/pages/index/index',
        imageUrl: '/images/logo.png',
      }
    }
  },
  //切换tab
  tabClick: function (e) {
    var that = this
    var orderData = that.data.orderData
    var activeIndex = e.currentTarget.id
    if (activeIndex == 0) {
      if (that.data.addressTransformation) {
        wx.showLoading();
        that.getCoder(that.data.addressTransformation)
      }
    } else {
      orderData.logistics_price = 0
      var pay_price = (Number(orderData.order_price) + Number(orderData.logistics_price)).toFixed(2)
      that.setData({
        orderData: orderData,
        pay_price: pay_price
      })
    }
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: activeIndex
    });
  },
  //切换tab
  //选择地址
  chooseAddress: function (e) {
    var that = this
    if (wx.chooseAddress) {
      wx.chooseAddress({
        success: function (res) {
          console.log(JSON.stringify(res))
          wx.setStorageSync("defaultAddress", JSON.stringify(res))
          that.setData({
            addressName: res.userName,
            addressPhone: res.telNumber,
            addressMsg: res.provinceName + ' ' + res.cityName + ' ' + res.countyName + ' ' + res.detailInfo,
            addressTransformation: res.provinceName + res.cityName + res.countyName + res.detailInfo,
          })
          //将chooseAddress返回的详细地址转为经纬度
          that.getCoder(that.data.addressTransformation)
        },
        fail: function (err) {
          if (that.data.addressName === '') {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
  },
  //选择地址
  //显示店家地址
  openLocation: function (e) {
    var that = this
    var orderData = that.data.orderData
    var address_lat = Number(orderData.address_lat)
    var address_lng = Number(orderData.address_lng)
    wx.openLocation({
      latitude: address_lat,
      longitude: address_lng,
      name: orderData.address_base + orderData.address_detail
    })
  },
  // 调用微信sdk将地址转为经纬度
  getCoder: function (address) {
    var that = this
    var orderData = that.data.orderData
    console.log(orderData)
    qqmapsdk.geocoder({
      address: address,
      success: function (res) {
        console.log(res)
        if (res.status == 0) {
          that.setData({
            userLocation: res.result.location
          })
          qqmapsdk.calculateDistance({
            from: {
              latitude: res.result.location.lat,
              longitude: res.result.location.lng
            },
            to: [{
              latitude: orderData.address_lat,
              longitude: orderData.address_lng
            }], //strs为字符串，末尾的“；”要去掉
            success: function (res) {
              wx.hideLoading()
              console.log(res)
              if (res.status == 0) {
                var distance = (Number(res.result.elements[0].distance) / 1000).toFixed(2)
                if (distance < orderData.max_logistics_length) {
                  orderData.logistics_price = 0
                  var pay_price = (Number(orderData.order_price)).toFixed(2)
                } else {
                  orderData.logistics_price = that.data.logistics_price
                  var pay_price = (Number(orderData.order_price) + Number(orderData.logistics_price)).toFixed(2)
                }
                that.setData({
                  orderData: orderData,
                  pay_price: pay_price
                })
              }
            }
          })
        }
      }
    })

  },
  //订单初始化
  initOrder: function (e) {
    var that = this
    var orderMsg = that.data.orderMsg
    utils.util.post(api.initOrder, {
      token: that.data.token,
      shop_id: orderMsg.shop_id,
      goods_id: orderMsg.goods_id,
      spec: orderMsg.spec,
      num: orderMsg.num,
      order_type: orderMsg.order_type,
    }, res => {
      var pay_price = (Number(res.data.order_price) + Number(res.data.logistics_price)).toFixed(2)
      that.setData({
        osscdn: res.osscdn,
        orderData: res.data,
        pay_price: pay_price,
        logistics_price: res.data.logistics_price
      })
      //默认地址
      if (wx.getStorageSync('defaultAddress')) {
        wx.showLoading()
        var defaultAddress = JSON.parse(wx.getStorageSync('defaultAddress'))
        console.log(163)
        that.setData({
          addressName: defaultAddress.userName,
          addressPhone: defaultAddress.telNumber,
          addressMsg: defaultAddress.provinceName + ' ' + defaultAddress.cityName + ' ' + defaultAddress.countyName + ' ' + defaultAddress.detailInfo,
          addressTransformation: defaultAddress.provinceName + defaultAddress.cityName + defaultAddress.countyName + defaultAddress.detailInfo,
        })
        //将chooseAddress返回的详细地址转为经纬度
        that.getCoder(that.data.addressTransformation)
      }
      //判断是否绑定过手机号
      if (res.data.is_tel == 0) {
        that.setData({
          mobileMask:true
        })
      }
    })
  },
  //确认支付
  sure_pay: function (e) {
    var that = this
    var logistics_action = that.data.activeIndex == 0 ? '1' : '2';
    var user_note = that.data.user_note
    var get_name = that.data.get_name
    var get_tel = that.data.get_tel
    var addressName = that.data.addressName
    var addressPhone = that.data.addressPhone
    var addressTransformation = that.data.addressTransformation
    var userLocation = that.data.userLocation
    var orderMsg = that.data.orderMsg
    if (logistics_action == 1) { //商家配送
      if (!userLocation) {
        wx.showModal({
          title: '提示',
          content: '请设置您的收货地址',
          showCancel: true,
          confirmText: '确定',
          confirmColor: "#646981",
          success(res) {
            if (res.confirm) {
              that.chooseAddress();
            }
          }
        })
        return false
      }
      var data = {
        token: that.data.token,
        shop_id: orderMsg.shop_id,
        goods_id: orderMsg.goods_id,
        spec: orderMsg.spec,
        num: orderMsg.num,
        order_type: orderMsg.order_type,
        user_note: user_note,
        get_name: addressName,
        get_tel: addressPhone,
        logistics_action: logistics_action,
        get_address_text: addressTransformation,
        get_address_lng: userLocation.lng,
        get_address_lat: userLocation.lat,
      }
    } else { //到店自取
      if (get_name == '' || get_tel == '') {
        wx.showToast({
          icon: 'none',
          title: '请先填写取货人和联系电话'
        })
        return false
      }
      var data = {
        token: that.data.token,
        shop_id: orderMsg.shop_id,
        goods_id: orderMsg.goods_id,
        spec: orderMsg.spec,
        num: orderMsg.num,
        order_type: orderMsg.order_type,
        user_note: user_note,
        get_name: get_name,
        get_tel: get_tel,
        logistics_action: logistics_action,
        get_address_text: '1',
        get_address_lng: '1',
        get_address_lat: '1',
      }
    }

    utils.util.post(api.createOrder, data, res => {
      utils.util.post(api.payOrder, {
        token: that.data.token,
        order_sn: res.data.order_sn
      }, res => {
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success(result) {
            wx.redirectTo({
              url: '/pages/goods/payresult/payresult?price=' + that.data.pay_price + '&order_type=' + that.data.orderData.order_type
            })
          },
          fail(res) {
            wx.showToast({
              icon: 'none',
              title: '尚未支付，即将前往我的订单！'
            })
            setTimeout(function () {
              wx.redirectTo({
                url: "/pages/my/orderManagement/orderManagement?type=0"
              })
            }, 1500)
          }
        })
      })

    })
  },
  //留言input框
  userNoteInput: function (e) {
    var that = this
    that.setData({
      user_note: e.detail.value
    })
  },
  //取货人input框
  getNameInput: function (e) {
    var that = this
    that.setData({
      get_name: e.detail.value
    })
  },
  //联系电话input框
  getTelInput: function (e) {
    var that = this
    that.setData({
      get_tel: e.detail.value
    })
  },
  //获取验证码
  getVC: function () {
    var that = this
    var countDownText = that.data.countDownText
    if (countDownText != '获取验证码') {
      return false
    }
    var counts = 60
    var vcPhone = that.data.vcPhone
    if (!vcPhone) {
      wx.showToast({
        icon:'none',
        title:'请输入手机号码',
      })
      return false
    }
    utils.util.post(api.checkPhoneToSms,{
      tel:vcPhone,
      token:that.data.token
    },res=>{
      wx.showToast({
        icon:'none',
        title:'验证码发送成功'
      })
      var codeTime = setInterval(() => {
        if (counts <= 1) {
          clearInterval(codeTime)
          that.setData({
            countDownText:'获取验证码'
          })
        } else {
          counts--
          that.setData({
            countDownText:counts + 's'
          })
        }
      }, 1000)
    })
    
  },
  phoneInput:function(e){
    var that=this
    that.setData({
      vcPhone: e.detail.value
    })
  },
  vcInput:function(e){
    var that=this
    that.setData({
      verificationCode: e.detail.value
    })
  },
  //隐藏弹框
  mobileMaskHide:function(){
    var that=this
    that.setData({
      mobileMask:false,
    })
  },
  //确认绑定手机
  bindPhoneSure:function(){
    var that=this
    var vcPhone = that.data.vcPhone
    var verificationCode=that.data.verificationCode
    utils.util.post(api.addUserPhone,{
      tel:vcPhone,
      number:verificationCode,
      token:that.data.token
    },res=>{
      wx.showToast({
        icon:'none',
        title:'手机号码绑定成功'
      })
      that.setData({
        mobileMask:false
      })
    })
  }
})