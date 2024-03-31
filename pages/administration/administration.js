import api from "../../request/api.js";
import { viewAll } from '../../api/card'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    view:null,
    avatar:'',
    isWatchful:false,
    cid:''
  },
  toVisitorList(){
    wx.navigateTo({
      url: `/pages/wholooksme/wholooksme?cid=${this.data.view.id}&isMy=0`
    })
  },
  tosetmark(){
    wx.navigateTo({
      url: '/pages/setnotes/setnotes?cid=' + this.data.view.id
    })
  },
  tosetgroup(){
    let data=this.data.cid
    wx.navigateTo({
      url: '/pages/setgroup/setgroup?cid='+ data
    })
  },
  switchchange(e){
    api.setAttention(this.data.view.id,!this.data.isWatchful).then(res => {
      this.setData({
        isWatchful:!this.data.isWatchful
      })
      Toast('设置成功')
    }).catch(err => {
      console.log(err)
      this.setData({
        checked: !e.detail.value
      })
    })
  },
  deletecard(){
    let that = this
    Dialog.confirm({
      message: '确认删除?',
    })
      .then(() => {
        // on confirm
        api.deleteCard(that.data.view.id).then(res => {
          console.log(res)
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          },600)
        })
      })
      .catch(() => {
        // on cancel
      });
  },
  async getView(cid){
    const data = await viewAll(cid)
    console.log('data',data)
    if(data.code == 200){
      this.setData({
        view:data.data.card,
        avatar:data.data.card.avatar,
        isWatchful:data.data.isWatchful == 1,
      })
    }else{
      Toast(data.message)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cid = options.cid
    this.data.cid=cid
    this.getView(cid)
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
