const api = require("../../request/api")

import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

// pages/setgroup/setgroup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cid:null,
    dataList:[],
    firstCodeList:[],
    currentFirstcd:'',
    currentGid:'', // 当前选中分组ID
  },
  setnewgroup(){
    wx.navigateTo({
      url: '/pages/managegroup/managegroup',
    })
  },
  onChange(event){
    this.data.currentGid = event.detail
  },
  //设置分组
  async setgroup(){
    if(!this.data.currentGid){
      Toast('请选择分组')
      return
    }
    let data={}
    data.gid=this.data.currentGid
    data.cardId=this.data.cid
    await api.switchgroup(data)
    wx.showToast({
      title: '设置成功',
      icon: 'success'
    })
    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      })
    }, 600);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({cid: options.cid})

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
    api.cardInGroup(this.data.cid).then(res => {
      console.log(res)
      const {groupingsId,groupingsListVOList} = res.data
      this.setData({
        currentGid:groupingsId,
        dataList:groupingsListVOList,
      })
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
