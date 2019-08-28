import config from './config.js'
const util={}
util.getUserInfo=()=>{
   /**
   * 定时器 1.5秒以后可再次进入 直接去登录页面
   */
  console.log('11')
  // wx.getSetting({
  //   success(res){
  //     if(!res.Authorization['scope.userInfo']){
  //       wx.authorize({
  //         scope:'scope.userInfo',
  //         success(){

  //         }
  //       })
  //     }
  //   }
  // })
  //  if (wx.getStorageInfoSync('isToLogin')!='loading'){
  //   wx.setStorageSync('isToLogin', 'loading');
  //   let timer = setTimeout(() => {
  //     wx.getStorageSync('isToLogin') && wx.removeStorageSync('isToLogin');
  //     clearTimeout(timer);
  //   }, 1200);
  //   wx.navigateTo({
  //     url: '/pages/login/index'
  //   })
  // }
}
util.post = (url, data, cb, extra, fail) => {
  console.log(12)
  util.ajax({
    method: 'post',
    url,
    data,
    cb,
    extra,
    fail
  })
}

util.get = (url, data, cb, extra, fail) => {
  util.ajax({
    method: 'get',
    url,
    data,
    cb,
    extra,
    fail
  })
}

util.put = (url, data, cb, extra, fail) => {
  util.ajax({
    method: 'put',
    url,
    data,
    cb,
    extra,
    fail
  })
}

util.ajax = obj => {
  /**
   * formData 数据类型 默认为false
   * loading 是否显示加载 默认不显示加载
   * showModal 是否在错误的时候提示 默认提示
   * isTourist 是否是游客 默认不是游客
   */
  let extra = Object.assign({
    formData: false,
    loading: true,
    showModal: true,
    isTourist: false
  }, obj.extra),
    contentType = 'application/json';
    let key = '';
  // let key = wx.getStorageSync('token');
  // let key = "ubDOgTA4-6593-4575-930b-5fb76d6579fb";
  // if (key || extra.isTourist) {
  //   console.log(13)
  //   request(key);
  // } else {
  //   console.log(13)
  //   util.getUserInfo();
  // }
  

  function request() {
    let data = obj.data;

    if (extra.loading) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
    }
    let header = {
      'content-type': contentType
      // 'token':'ubDOgTA4-6593-4575-930b-5fb76d6579fb'
      // 'token':'olF6B513-6593-4579-930b-5fb76d6579fb'
    }
    // if (key) header.Authorization = key;

    wx.request({
      url: config.ApiUrl + obj.url,
      data: data,
      method: obj.method.toUpperCase(),
      header: header,
      success(res) {
        let data = res.data;
        if(res.data.code == 1){
          wx.stopPullDownRefresh();
          extra.loading && wx.hideLoading();
          console.log(obj.data.page>1)
          obj.data.page>1&&data.data.list.length==0&&wx.showToast({
            icon:'none',
            title:'已经到底啦！'
          })
            typeof obj.cb == 'function' && obj.cb(data);
        }else if(res.data.code == 4){
          wx.navigateTo({
                url: '/pages/login/login'
              })
        }else if(!res.data.code){
          extra.loading && wx.hideLoading();
          console.log('0')
          extra.showModal && wx.showModal({
            title: '提示信息',
            content:data.msg,
            showCancel: false,
            success (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta:1
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          typeof obj.fail == 'function' && obj.fail(res);
        }
        
      },
      fail(res) {
        extra.loading && wx.hideLoading();
        wx.showModal({
          title: "网络超时",
          content: "请关闭刷新",
          confirmText: "知道了",
          showCancel: !1
        })
        typeof obj.fail == 'function' && obj.fail(res);
      },
      complete() { }
    })
  }
  request()
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const intervalTime=function(faultDate,completeTime){//计算两个时间戳相隔的时间
	var stime = Date.parse(new Date(faultDate));
	var etime = Date.parse(new Date(completeTime));
	var usedTime = etime - stime;  //两个时间戳相差的毫秒数
	var days=Math.floor(usedTime/(24*3600*1000));
	//计算出小时数
	var leave1=usedTime%(24*3600*1000);    //计算天数后剩余的毫秒数
	var hours=Math.floor(leave1/(3600*1000));
	//计算相差分钟数
	var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
	var minutes=Math.floor(leave2/(60*1000));
	var time = days + "天"+hours+"小时";
	return time;
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  intervalTime:intervalTime,
  util:util
}
