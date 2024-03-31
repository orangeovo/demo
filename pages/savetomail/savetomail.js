// pages/savetomail/savetomail.js
import api from "../../request/api.js";
import {
  formatInitialsData
} from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardlist: []
  },
  choose(e) {
    let currentitem = e.currentTarget.dataset.item
    console.log(currentitem)
    this.setData({
      currentitem
    })
  },
  savetomail() {
    // console.log('phone',this.data.currentitem)
    wx.addPhoneContact({
      firstName: this.data.currentitem.name,
      mobilePhoneNumber: this.data.currentitem.phone,
      fail() {}
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },
  getList(query) {
    console.log(query);
    api.getCardHolderList(query).then(res => {
      console.log(res)
      //整合请求到的数据
      const cardlist = formatInitialsData(res.data)
      cardlist.map(item => {
        item.data.map(i => i.ischoose = false)
      })
      console.log(cardlist)
      this.setData({
        cardlist
      })
    })
  },
  // 输入搜索
  handleinput(e) {
    let query = {
      conditions: ""
    }
    // 拿到输入框的值
    query.conditions = e.detail.value.trim()
    // 判断值
    // if (!query.conditions.trim()) {
    //   return 
    // }
    // 防抖
    clearTimeout(this.timeout);
    // 发送请求
    this.timeout = setTimeout(() => {
      this.getList(query)
    }, 1000);
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