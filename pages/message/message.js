// pages/setup/setup.js
import api from "../../request/api.js";
import {
  getxxtzlist
} from '../../api/demo'
import {tokenName} from "../../utils/config.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notdisturb: 1,
    autorequest: 1,
    datalist:[], // 消息通知数组
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

  barChange(event){
    // url:'/pages/login/login'
    // console.log(event.currentTarget.dataset.url);
    wx.switchTab({
      url:event.currentTarget.dataset.url
    })
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserStatus()
  },

  // 查看更多
  check(e){
    console.log(e.target.dataset.item.id);
  },

  // 获取当前设置
  async getUserStatus() {
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

    // await wx.request({
    //   url: 'http://127.0.0.1:8082/getxxtzlist',
    //   dataType:"json",
    //   success(res){
    //     console.log(res);
    //     datalist = res.data
    //   }
    // })
    let {datalist} = this.data
    const data = await getxxtzlist()
    console.log(data);
    if(data.code==200){
      // datalist = data.data
         datalist = [
              {
                    "id":1,
              "title":"44444",
              "content":"123123123123123",
              "date":2013,
              "flag":true
              },
              {
                      "id":2,
                "title":"sdasdasda",
                "content":"123123123123123",
                "date":2013,
                "flag":true
                },
                {
                        "id":3,
                  "title":"czxczxcz",
                  "content":"123123123123123",
                  "date":2013,
                  "flag":false
                 },

            ]
    }
    // console.log(this.data.datalist,'--------------------');
    setTimeout(() => {
      this.setData({
        datalist:datalist,
      })
      // console.log(this.data.datalist);
      // console.log(datalist);
    }, 5000);
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
