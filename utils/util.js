import config from './config.js'
const util={}
util.getUserInfo=()=>{
   /**
   * 定时器 1.5秒以后可再次进入 直接去登录页面
   */
  if (wx.getStorageInfoSync('isToLogin')!='loading'){
    wx.setStorageSync('isToLogin', 'loading');
    let timer = setTimeout(() => {
      wx.getStorageSync('isToLogin') && wx.removeStorageSync('isToLogin');
      clearTimeout(timer);
    }, 1200);
    wx.navigateTo({
      url: '/pages/login/index'
    })
  }
}
util.post = (url, data, cb, extra, fail) => {
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
    loading: false,
    showModal: true,
    isTourist: false
  }, obj.extra),
    contentType = 'application/json';
  let key = wx.getStorageSync('token');
  if (key || extra.isTourist) {
    request(key);
  } else {
    util.getUserInfo();
  }


  function request(key) {
    let data = obj.data;

    if (extra.loading) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
    }
    let header = {
      'content-type': contentType
    }
    if (key) header.Authorization = key;

    wx.request({
      url: config.ApiUrl + obj.url,
      data: data,
      method: obj.method.toUpperCase(),
      header: header,
      success(res) {
        let data = res.data;
        extra.loading && wx.hideLoading();
        if (data.success) {
          typeof obj.cb == 'function' && obj.cb(data);
        } else {
          extra.showModal && wx.showModal({
            title: '提示信息',
            content: data.errorMessage,
            showCancel: false
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
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}
