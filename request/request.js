import { baseUrl, tokenName, } from "../utils/config";

const Request = (options) =>{
  if(!options.method){
      options.method='POST'
  }
  let type = 'application/json;charset=UTF-8';
  if(options.type=='get'){
      let type = 'application/x-www-form-urlencoded'
  }
  let header={'Content-Type': type}
  let obj={}
  if(options.method == 'POST'){
      options.data = JSON.stringify(options.data);
  }else{
      options.data = Object.assign(obj,options.data);
  }
  return new Promise((resolve, reject) => {
    wx.showLoading();
    if(!options.noToken){
      header.token = wx.getStorageSync(tokenName) ? wx.getStorageSync(tokenName):''
    }
    // console.log("header",header)
    wx.request({
      url: baseUrl + options.url || '',
      data: options.data || {},
      method: options.method || 'POST',
      header,
      success (res) {
        if(res.statusCode === 200){
          if(res.data.code == 200){
            wx.hideLoading();
            resolve(res.data);
          }
          else if(res.data.code == 202){   // 登录过期，需重新登陆
            wx.hideLoading();
            wx.navigateTo({
              url: '/pages/login/login'
            })
            wx.showToast({
              title: '请登录',
              icon:"none"
            })
          }
          else if(res.data.code == 500){
            wx.hideLoading();
            wx.showToast({
              title: res.data.message,
              icon:"none"
            })
            resolve(res.data)
          } else if(res.data.code == 250){

            // 参数缺失
            wx.hideLoading();
            wx.showToast({
              title: res.data.message,
              icon:"none"
            })
            resolve(res.data)
          } else{
            wx.hideLoading();
            resolve(res.data)
          };
        }else{
          wx.hideLoading();
          wx.showToast({
            title: res.errMsg,
            icon:"none"
          })
        };
      },
      fail (res) {
        console.error(res)  
        wx.showToast({
          title: "网络开小差了",
          icon:"none"
        })
        reject(res);
      }
    })
  })
};

module.exports = {
  baseURL: baseUrl,
  Request
};
