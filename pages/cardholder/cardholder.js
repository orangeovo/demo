// pages/cardholder/cardholder.js
import api from "../../request/api.js";
import {formatInitialsData} from "../../utils/util.js"
import { cardOcr } from '../../api/card'
import { userCard } from '../../api/user'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import {mapKey, tokenName} from '../../utils/config'
import WeCropper from '../we-cropper/we-cropper.js'
import { baseUrl } from "../../utils/config"
import { uploadFile } from '../../utils/http'
const device = wx.getSystemInfoSync() // 获取设备信息
const width = device.screenWidth // 示例为一个与屏幕等宽的正方形裁剪框
const height = device.screenHeight  -40
var isonShow;  //是否执行onshow判断条件
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardList: [],
    num: 0,
    searchText:'',
    login:false,
    cardiniId: '',
     //裁剪蒙版参数
     iscropper: false,
     imgSrc: '', //确定裁剪后的图片
     cropperOpt: {
       id: 'cropper',
       width: width, // 画布宽度
       height: height, // 画布高度
       scale: 2.5, // 最大缩放倍数
       zoom: 8, // 缩放系数
       cut: {
         x: 0, // 裁剪框x轴起点
         y: (height * 0.5 - 370 * 0.5), // 裁剪框y轴期起点
         width, // 裁剪框宽度
         height: width * 0.75 // 裁剪框高度
       }
     },
  },
  doSearch(event){
    let that = this
    app.auth(()=>{
      that.setData({searchText: event.detail})
      that.getList()
    })

  },
  uploadTap() {
    const self = this
    isonShow= true;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        wx.hideTabBar({
        })
        const src = res.tempFilePaths[0];
        self.wecropper.pushOrign(src);
      }
    })
  },
  closeTap() {
    this.setData({
      iscropper: false
    })
    wx.showTabBar({
      animation: true,
    })
  },
  getCropperImage() {
    let that = this;

    // 如果有需要两层画布处理模糊，实际画的是放大的那个画布
    that.wecropper.getCropperImage(async (src) => {
      if (src) {
        wx.showToast({
          title: '扫描中...',
          icon: 'loading',
        })
        that.setData({
          imgSrc: src,
          iscropper: false
        })
        const data1 = await uploadFile(src)
        if(data1.code == 200){
          const data = await cardOcr(data1.data)
          wx.hideToast()

          if(data.data){
            data.data.imgs=data1.data
          }
          if(data.code == 200){
            wx.showTabBar({
              animation: true,
            })
            Toast('扫描成功')
            wx.navigateTo({
              url: '/pages/makecard/makecard?isEntering=1',
              success(res){
                res.eventChannel.emit('scan', { data: data.data })
              }
            })
          }else{
            Toast(data.message)
          }
          console.log(height)
          wx.showTabBar({
            animation: true,
          })
        }else{
          wx.hideToast()
          Toast(`扫描失败，文件上传错误`)
        }
      } else {
        Toast(`获取图片信息失败，请稍后重试`)
      }
      wx.showTabBar({
        animation: true,
      })
    })
  },
  clearstxt(){
    this.setData({searchText: ''})
    this.getList()
  },
  todetail(e){
    let cid = e.currentTarget.dataset.cid
    wx.navigateTo({
      url: '/pages/exchanged/exchanged?cid=' + cid
    })
  },
  // 扫描名片
  doScanCard(){
    let that=this
    isonShow= true;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        wx.hideTabBar({
          animation:true
        })
        that.setData({
          show: false,
          iscropper: true,
        })
        const src = res.tempFilePaths[0];
        setTimeout(() => {
          that.wecropper.pushOrign(src);
        }, 100);
      }

    })
  },
  // 手动录入
  tomakecard(){
    app.auth(()=>{
      wx.navigateTo({
        url: '/pages/makecard/makecard?isEntering=1',
      })
    })
  },
  // 保存通讯录
  tomail(){
    wx.navigateTo({
      url: '/pages/savetomail/savetomail',
    })
  },
  togroup(){
    app.auth(()=>{
      wx.navigateTo({
        url: '/pages/grouplist/grouplist',
      })
    })
  },
  tomanage(e){
    let cid = e.currentTarget.dataset.cid
    console.log(e);
    wx.navigateTo({
      url: '/pages/administration/administration?cid='+cid
    })
  },
  //跳转到圈子列表
  tocircle(){
    wx.switchTab({
      url: '/pages/circleindex/circleindex',
    })
  },
  async getList(){
    const data = await userCard(this.data.searchText)
    if(data.code == 200){
     
      this.setData({
        cardList:formatInitialsData(data.data),
        num: data.data.length
      })
      
      
    }else{
      Toast(data.message)
    }
  },
  toLogin(){
    wx.navigateTo({
      url:'/pages/login/login'
    })
  },
  //右侧首字母筛选
  scrollinto(e){
    this.setData({cardiniId: e.currentTarget.dataset.iniid})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:  function (options) {
    const {
      cropperOpt
    } = this.data

    this.cropper = new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        wx.hideToast()
      })
    // 刷新画面
    this.wecropper.updateCanvas()
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
    
    if (!isonShow) {
          wx.showTabBar({
        })
          isonShow= false;
    };
    let token = wx.getStorageSync(tokenName)
    this.setData({
      login:token ? true : false
    })
    if(token){
      this.getList()
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
  touchStart(e) {
    this.cropper.touchStart(e)
  },
  touchMove(e) {
    this.cropper.touchMove(e)
  },
  touchEnd(e) {
    this.cropper.touchEnd(e)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
