// pages/setup/setup.js
import api from "../../request/api.js";
import {tokenName} from "../../utils/config.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notdisturb: 1,
    autorequest: 1,
  },
  //点击勿扰
  switchchange_notdisturb(e) {
    try {
      let open = {
        open: e.detail.value
      }
      api.isDND(open).then(res => {
        if (res.code != 200) {
          return wx.showToast({
            icon: 'error',
            title: '修改失败',
          })
        }
        this.getUserStatus()
      })
    } catch (error) {
      console.log(error);
    }
  },
  // 是否通过
  switchchange_autorequest(e) {
    try {
      let open = {
        open: e.detail.value
      }
      api.isAutomaticExchange(open).then(res => {
        if (res.code != 200) {
          return wx.showToast({
            icon: 'error',
            title: '修改失败',
          })
        }
        this.getUserStatus()
      })
    } catch (error) {
      console.log(error);
    }
  },
  logout() {
    wx.removeStorage({
      key: tokenName,
      success() {
        wx.showToast({
          title: '退出成功'
        })
        app.globalData.userInfo = null
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 600);
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserStatus()
  },
  // 获取当前设置
  getUserStatus() {
    try {
      api.settings().then(res => {
        if (res.code != 200) {
          return wx.showToast({
            title: '获取失败',
          })
        }
        this.setData({
          notdisturb: res.data.noDisturb,
          autorequest: res.data.autoPass
        })

      })
    } catch (error) {
      console.log(error);
    }
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
