// pages/exchanged/exchanged.js
import {sharePath} from "../../utils/config";

const app = getApp();
import api from "../../request/api.js";
import { outView } from '../../api/card'
import { tokenName } from '../../utils/config'

import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupId:null,// 组ID
    cid:null, // 当前显示名片ID
    obj:null,// 整个名片对象，用于传参
    init:false,
    show:false,// 是否显示分享弹窗
    adminShow:false,// 管理名片弹窗
  },
  // 交换名片
  doExchanged(){
    let str = '';
    if(this.data.obj.inUserCard == 0){
      str = '确定要与对方交换名片吗？\n' +
        '交换成功后，可以查看彼此完整的信息'
    }else{
      str = "确认加入分组?"
    }
    let that = this
    app.auth(()=>{
      Dialog.confirm({
        message: str,
      })
        .then(async () => {
          const data = await api.changeandjoingroup(that.data.groupId)
          if(data.code == 200){
            Toast(that.data.obj.inUserCard == 0 ? '交换成功' : '加入成功')
            this.getView()
          }
        })
        .catch(() => {
          // on cancel
        });
    })
  },
  // 收藏
  doCollect(){
    let data={}
    data.cardid = this.data.obj.id
    data.flag = this.data.obj.isCollect == 1 ? false : true
    api.collectCard(data).then(res=>{
      if(res.code==200){
        Toast(data.flag ? '已收藏' : '已取消')
        this.getView()
      }else{
        Toast(res.message)
      }
    })
  },
  // 分享名片事件
  doShareCard() {
    this.setData({
      show: true
    })
  },
  toMyCard(){
    wx.navigateTo({
      url:'/pages/switchidentity/switchidentity'
    })
  },
  // 打开管理名片弹窗
  openAdminCard(){
    this.setData({
      adminShow:true
    })
  },
  onClose() {
    this.setData({
      show: false,
      adminShow:false
    });
  },
  delSuccess(){
    Toast('删除成功')
    this.getView()
    this.onClose()
  },
  // 分享名片海报
  toPoster() {
    wx.navigateTo({
      url: '/pages/shareposter/shareposter?cid=' + this.data.obj.id,
    })
    this.setData({
      show:false
    })
  },
  async getView(){
    let data = null
    let cid = this.data.cid
    let gid = this.data.groupId
    if(app.globalData.userInfo == null){
      // 未登录
      data = await outView(cid,gid)
    }else{
      // 已登录
      data = await api.getCardDetail(cid,gid)
    }
    console.log('data',data)
    let obj = data.data
    obj.imgs = obj.imgUrl.split(',')
    obj.isMy = 0
    // 判断是否显示信息
    // 不在名片列表里，也不在分组里，不显示全部内容
    if(obj.viewAll == 0 && obj.inGroup == 0){
      // 无法显示完成，隐藏部分信息, 手机号，邮箱，公司名称显示首尾两个字段，地址显示前四个字段
      obj.phone = this.encrypt(obj.phone)
      obj.email = this.encrypt(obj.email)
      obj.companyName = this.encrypt(obj.companyName)
      obj.companyAddress = this.encrypt(obj.companyAddress,2)
    }
    this.setData({
      init:true,
      obj
    })
    wx.setNavigationBarTitle({
      title: data.data.name+"的名片",
    })
  },
  // 加密字段
  encrypt(str,type=1){
    if(type == 1){
      //首尾两个字段,如果小于等于四个字段，则显示首两个字段
      if(str.length > 4){
        let start = str.slice(0,2)
        let end = str.slice(-2)
        return start + '***' + end
      }else{
        return str.slice(0,2) + '***'
      }
    }else{
      // 首四个字段
      return str.slice(0,4) + '*************'
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log('options',options)
    if(options.cid){
      // 正常小程序内点击进入
      this.data.cid = options.cid
      this.data.groupId = options.groupid
    }else{
      // 扫码进入
      const scene = decodeURIComponent(options.scene)
      let id = scene.split('&')[0].split('=')[1]
      let gid = scene.split('&')[1].split('=')[1]
      this.data.groupId = gid
      this.data.cid = id
    }
    await app.getUserInfo()
    await this.getView()
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
    // 判断是否登录，根据是否登录，调用不同的查看名片接口

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
    return {
      title: this.data.obj.companyName+'-'+this.data.obj.name,
      path: `/pages/confirmjoingroup/confirmjoingroup?groupid=${this.data.groupid}&cid=${this.data.cid}`,
      success(res) {}
    }
  }
})
