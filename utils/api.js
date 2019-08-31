const api = {
  // 第一模块
  getBanner:'/public/api/index/getBanner',//首页banner
  getUserShop:'/public/api/shop/getUserShop',//获取用户关注店铺列表
  getPlatformShop:'/public/api/shop/getPlatformShop',//获取平台店铺
  getShopDetail:'/public/api/shop/getShopDetail',//获取店铺详情
  goodsDetail:'/public/api/goods/getGoodsDetail',//商品详情
  setGoodsFans:'/public/api/shop/setGoodsFans',//修改用户关注状态
  getMoreGoodsToCategory:'/public/api/shop/getMoreGoodsToCategory',//获取店铺更多商品--分类
  setGoodsCollect:'/public/api/goods/setGoodsCollect',//修改商品用户收藏状态
  initOrder:"/public/api/order/initOrder",//订单初始化
  createOrder:'/public/api/order/createOrder',//创建商品订单
  payOrder:'/public/api/order/payOrder',//支付商品订单
  getMoreGoods:'/public/api/shop/getMoreGoods',//获取店铺更多商品--推荐
  getShopDynamics:'/public/api/Dynamics/getShopDynamics',//获取店铺动态列表
  //动态模块
  getDynamicsInfo:'/public/api/Dynamics/getDynamicsInfo',//获取平台动态(传token获取用户收藏的动态，不传获取平台全部动态)
  setDynamicsLike:'/public/api/Dynamics/setDynamicsLike',//修改动态的点赞
  getDynamicsInfoToPlatform:'/public/api/Dynamics/getDynamicsInfoToPlatform',//获取平台动态
  getDynamicsDetail:'/public/api/Dynamics/getDynamicsDetail',//获取动态详情
  addDynamicsComment:'/public/api/dynamics/addDynamicsComment',//新增动态的评论
  //订单管理模块
  getUserOrder:'/public/api/order/getUserOrder',//获取我的订单
  getOrderDetail:'/public/api/order/getOrderDetail',//获取订单详情
  completeOrder:'/public/api/order/completeOrder',//订单确认收货
  getRefundDetail:'/public/api/order/getRefundDetail',//获取订单退款详情
  addAftersafeInfo:'/public/api/order/addAftersafeInfo',//提交订单售后申请
  getUserAftersafe:'/public/api/order/getUserAftersafe',//获取我的售后申请
  getAftersafeDetail:'/public/api/order/getAftersafeDetail',//获取订单售后详情
  getUserGroup:'/public/api/order/getUserGroup',//获取我的拼团列表
  getGroupDetail:'/public/api/order/getGroupDetail',//获取我的拼团详情
  addOrderComment:'/public/api/order/addOrderComment',//
  // 第三模块
  getUserInfo:'/public/api/user/getUserInfo',///获取用户信息
  getApplyStatus:'/public/api/apply/getApplyStatus',//获取用户申请商家的状态
  getPlatformProtocol:'/public/api/user/getPlatformProtocol',//关于我们
  getPlatformService:'/public/api/Platform/getPlatformService',//联系客服
  ossUploadImage:'/public/api/index/oss_uploadImage',//上传图片oss文件
  addSupplierApply:'/public/api/apply/addSupplierApply',//供应商申请
  addShopApply:'/public/api/apply/addShopApply',//店铺申请
  getUserCollect:'/public/api/user/getUserCollect',//获取我的收藏列表
  getAdminWallet:'/public/api/user/getAdminWallet',//获取钱包明细
  addWithdrawInfo:'/public/api/User/addWithdrawInfo',//新增提现发起记录
  getWithdrawInfo:'/public/api/User/getWithdrawInfo',//获取提现发起记录
  // 登录模块
  wechatLogin:'/public/api/wechat/wechatLogin',//登录获取openid
  addUserInfo:'/public/api/wechat/addUserInfo',//用户注册接口
  
  getProtocolToApply:'/public/api/Platform/getProtocolToApply'//平台用户协议
}

export default api;