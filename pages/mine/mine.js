// pages/mine/mine.js
//裁剪图片所需参数
import {
  baseUrl
} from "../../utils/config"
import WeCropper from '../we-cropper/we-cropper.js'

const device = wx.getSystemInfoSync() // 获取设备信息
const width = device.screenWidth // 示例为一个与屏幕等宽的正方形裁剪框
const height = device.screenHeight -40
var isonShow;  //是否执行onshow判断条件
const app = getApp()

import api from "../../request/api.js";
import {
  getDefaultCard,
  countInfo,
  getsandr,upduseravatar
} from '../../api/user'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendnum: '', //递出的名片数量
    receivenum: '', //收到的名片数量
    userInfo: null, // 用户信息
    defaultCard: null, // 默认名片
    login: false,
    lookMeNum: 0, // 谁在看我数量
    watchfulNum: 0, // 我关注的数量
    cardNum: 0, // 我的名片数量
    init:false,
    xxtztotal:999,
    //裁剪蒙版参数
    iscropper: false,
    imgSrc: '', //确定裁剪后的图片
    ifDo:false,
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
         height: width  // 裁剪框高度
       }
     },
  },
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },
  toNavigation(event) {
    app.auth(() => {
      wx.navigateTo({
        url: event.currentTarget.dataset.url
      })
    })
  },
  // 获取统计数据
  async getCountInfo() {
    const data = await countInfo()
    if (data.code == 200) {
      this.setData({
        lookMeNum: data.data.lookMeNum,
        watchfulNum: data.data.watchfulNum,
        cardNum: data.data.cardNum,
        
      })
    }
  },
  toMyCard() {
    wx.navigateTo({
      url: '/pages/mycard/mycard'
    })
  },
  //上传头像
  upavatar() {
    let that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        wx.hideTabBar({
          animation:true
        })
        that.setData({
          show: false,
          iscropper: true,
          videoUrl: ''
        })
        const src = res.tempFilePaths[0];
        that.wecropper.pushOrign(src);
      }
    })
    
  },
  getCropperImage() {
    let that = this;
    wx.showToast({
      title: '上传中',
      icon: 'loading',
      duration: 20000
    })
    // 如果有需要两层画布处理模糊，实际画的是放大的那个画布
    this.wecropper.getCropperImage((src) => {
      console.log(src)
      if (src) {
        that.setData({
          imgSrc: src,
          iscropper: false
        })
        wx.uploadFile({
          filePath: src,
          name: 'file',
          url: baseUrl + '/file/upload',
          async success(res) {
            wx.hideToast()
            if (res.statusCode==413) {
              wx.showToast({
                title: '文件太大',
                icon: 'error'
              })
            }else{
              let data1 = JSON.parse(res.data);
              console.log(data1)
              let data = { 
                url: data1.data, 
                id: that.data.userInfo.id 
              }
              await upduseravatar(data)
               wx.showTabBar({
                 animation: true,
               })
                that.onShow()
                Toast('更换头像成功')
              
            }
          },
          fail(res) {
            wx.showTabBar({
              animation: true,
            })
            wx.hideToast()
            Toast(`文件上传错误`)
          }
          
        })
      } else {
        console.log('获取图片地址失败，请稍后重试')
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  closeTap() {
    this.setData({
      iscropper: false
    })
    wx.showTabBar({
      animation: true,
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
        const src = res.tempFilePaths[0];
        self.wecropper.pushOrign(src);
      }
    })
  },
  touchStart (e) {
    this.cropper.touchStart(e)
  },
  touchMove (e) {
    this.cropper.touchMove(e)
  },
  touchEnd (e) {
    this.cropper.touchEnd(e)
  },
  onLoad: async function (options) {
        //裁剪图片的准备
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
        //刷新画面
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
  onShow: async function () {
     
    if (!isonShow) {
      wx.showTabBar({
    })
      isonShow= false;
    };

    if (app.getTokenAuth()) {
      // 已登录情况
      await app.getUserInfo()
      // 获取统计数据
      await this.getCountInfo()
      // 获取默认名片
      await app.getDefaultCard()
      let unReadData = await getsandr()
      this.setData({
        defaultCard: app.globalData.defaultCard,
        userInfo: app.globalData.userInfo,
        login: true,
        sendnum: unReadData.data.sendNum,
        receivenum: unReadData.data.receiveNum,
        init:true,
      })
      // 消息通知参数 根据用户信息内字段替换 xxtztotal
      console.log(this.data);
    } else {
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
