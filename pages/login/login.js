// pages/login/login.js
import api from "../../request/api.js"
import {
  tokenName
} from "../../utils/config";
import {
  getDefaultCard,
} from '../../api/user'
const app = getApp()
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isclick: true,
    radio:false,
  },
  torule(){
    wx.navigateTo({
      url: '/pages/rule/rule',
    })
},
  topolicy(){
    wx.navigateTo({
      url: '/pages/policy/policy',
    })
  },
  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },
  login() {
    if (this.data.radio) {
      if(this.data.isclick){
        this.data.isclick = false
        console.log('---------------');
        console.log(wx.getUserProfile());
        wx.getUserProfile({
          desc:'展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            console.log(res)
            this.data.userInfo = JSON.parse(res.rawData)
            this.toLogin()
          },
          error:(err)=>{
            console.log(err,'-----------');
          }
        })
        setTimeout(() => {
        this.data.isclick = true
      }, 2000)
    }
  }else{
    Toast("请勾选同意使用条款和隐私政策")
  }

  },
  toLogin() {
    var that = this;
    wx.login({
      async success(res) {
        console.log(res)
        if (res.code) {
          console.log(res)
          var data = {
            avatar: that.data.userInfo.avatarUrl,
            nickname: that.data.userInfo.nickName,
            code: res.code
          }
          console.log(JSON.stringify(data) )
          wx.setStorageSync('code', res.code)
          // 登录
          // console.log('登录=========================');
          await api.login(data).then(async res => {
            // console.log('成功=========================');
            console.log(res);
            // 存本地缓存
            wx.setStorageSync(tokenName, res.data)
            await app.getUserInfo()
            wx.navigateBack()
            const data = await getDefaultCard()
            wx.setStorageSync('cardname', data.data.name)
            wx.setStorageSync('cardavatar', data.data.avatar)
          })
          // 获取用户信息
          // app.getUserInfo()
        } else {
          // console.log('失败*************************');
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})