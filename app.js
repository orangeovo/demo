// app.js
import {getDefaultCard, info} from './api/user'
import { tokenName } from "./utils/config";
import { uploadFile } from "./utils/http";
import Toast from "./miniprogram_npm/@vant/weapp/toast/toast";

App({
  onLaunch() {},
  globalData: {
    userInfo: null,
    defaultCard:null,
    statusHeight:0,
    currentuid:'',
    currentcardid:'',
    currentgid:'',
    groupinfo:{},
  },
  async loginValidation(){
    // 是否有token
    let token = wx.getStorageSync(tokenName)
    if(token){
      // 判断token是否过期
      const data = await info()
      if(data.code === 200){
        this.globalData.userInfo = data.data
      }else{
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
    }else{
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  //获取默认名片
  async getDefaultCard() {
    const data = await getDefaultCard()
    if (data.code === 200) {
      this.globalData.defaultCard = data.data
    } else if (data.code == 201) {
      // 没有默认名片
      this.globalData.defaultCard = null
    }
  },
  // 查看登录凭证
  getTokenAuth(){
    let token = wx.getStorageSync(tokenName)
    return token ? token : ''
  },
  // 获取用户信息
  async getUserInfo(){
    let token = wx.getStorageSync(tokenName)
    if(token){
      const data = await info()
      if(data.code === 200){
        this.globalData.userInfo = data.data
        console.log('app.js:',data.data)
      }
    }
  },
  upload(successFun,failFun = ()=>{}){
    
    wx.chooseImage({
      count:1,
      async success (res) {
        wx.showLoading({
          title: '上传中',
        })
        const data = await uploadFile(res.tempFilePaths[0])
        wx.hideLoading({
          success: (res) => {},
        })
        if(data.code == 200){
          successFun(data.data)
        }else{
          Toast(data.message)
        }
      },
      fail(){
        if(failFun)
          failFun()
      },
    })
  },
  async onlyUpload(path,successFun){
    const data = await uploadFile(path)
    if(data.code == 200){
      Toast('上传成功')
      successFun(data.data)
    }else{
      Toast(data.message)
    }
  },
  // 登录验证 包含用户是否认证
  async auth(successFun = ()=>{}){
    // 登录验证
    let token = wx.getStorageSync(tokenName)
    if(token){
      if(!this.globalData.userInfo){
        await this.getUserInfo()
      }
      successFun()
    }else{
      // 之前未登录过
      wx.showToast({
        icon:'none',
        title:'请先登录'
      })
      setTimeout(()=>{
        wx.navigateTo({
          url:'/pages/login/login'
        })
      },1000)
    }
  }
})
