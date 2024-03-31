// pages/wallCircle/wallCircle.js
import api from "../../request/api.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0, // 0供 1需
    supplier: "",
    demander: "",
    indexBar: [],
    listData: [],
    login: false,
    init:false,
  },
  toLogin(){
    wx.navigateTo({
      url:'/pages/login/login'
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
  onShow: async function () {
    this.setData({
      init:false
    })
    if (app.getTokenAuth()) {
      let data = await api.getCicleList()
      let {indexBar, listData} = this.data
      listData = data.data.circleVos ? data.data.circleVos.records : []
      indexBar = listData.map(el => {
        return el.firstCode
      })
      indexBar = Array.from(new Set(indexBar)).sort()
      this.setData({
        indexBar,
        listData,
        login:true,
        init:true,
        supplier: `供方(${data.data.provide || 0})`,
        demander: `需方(${data.data.demand || 0})`,
      })
    }else{
      this.setData({
        login: false,
        init:true,
      })
    }
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
