// pages/vipcenter/vipcenter.js
const app = getApp()
import api from "../../request/api.js";
import { vipTimes } from '../../api/vip'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {avatar:'https://img1.baidu.com/it/u=3755297117,609162545&fm=26&fmt=auto',realName:'未获取到个人信息'},
    package: [],
    list: [], // 套餐列表
    currentindex: 0,
    vipdesc: ''
  },
  choosepack(e){
    let index = e.currentTarget.dataset.index
    this.setData({currentindex: index})
  },
  openvip(){
    wx.navigateTo({
      url: '/pages/payment/payment',
      success: res => {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: this.data.list[this.data.currentindex] })
      }
    })
  },
  toNavigation(event) {
    app.auth(() => {
      wx.navigateTo({
        url: event.currentTarget.dataset.url
      })
    })
  },
  async getList(){
    const data = await vipTimes()
    console.log('data',data)
    if(data.code == 200){
      let list = data.data
      this.setData({list})
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    await app.getUserInfo()
    this.setData({
      userInfo:app.globalData.userInfo
    })
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
