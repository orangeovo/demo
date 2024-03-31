// pages/myconcern/myconcern.js
import api from "../../request/api.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    conditions: "",
    list: [],
    noMore:false,
  },
  // 添加按钮
  toAdd(){
    wx.switchTab({
      url:"/pages/cardholder/cardholder"
    })
  },
  // 搜索
  doSearch(event){
    this.data.conditions = event.detail
    this.getList()
  },
  // 清空搜索
  doClear(){
    this.data.conditions = ''
    this.getList()
  },
  async getList(){
    let params = {
      page:this.data.page,
      conditions:this.data.conditions
    }
    const data = await api.myConcern(params)
    console.log('data',data)
    if(data.code == 200){
      let list;
      if(this.data.page == 1){
        list = data.data.records
      }else{
        list = [...this.data.list,...data.data.records]
      }
      if(list.length >= data.data.total){
        this.setData({
          list,
          noMore:true
        })
      }else{
        this.setData({
          list
        })
      }
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
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.noMore){
      return
    }
    this.data.page ++
    this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
