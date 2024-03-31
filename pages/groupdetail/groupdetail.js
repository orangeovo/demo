// pages/cardholder/cardholder.js
import api from "../../request/api.js";
import {formatInitialsData} from "../../utils/util.js"
import { cardOcrg } from '../../api/card'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import { sharePath } from '../../utils/config'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import {getDefaultCard} from '../../api/user'
const app = getApp()
import WeCropper from '../we-cropper/we-cropper.js'
import { baseUrl } from "../../utils/config"
import { uploadFile } from '../../utils/http'
const device = wx.getSystemInfoSync() // 获取设备信息
const width = device.screenWidth // 示例为一个与屏幕等宽的正方形裁剪框
const height = device.screenHeight  -40
var isonShow;  //是否执行onshow判断条件
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardlist: [],
    num: 0,
    groupname:'',
    groupid:'', // 分组ID
    grouppurpose:'',
    cid:'',
    show:false,
    avatar:'',
    searchkey:'',
    popupshow:false,
    cardid:'',
    shareimg:'',
    template:{},
    tempPath:'',
    showPainter:false,
    obj:'', //当前账号默认名片信息
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
          const data = await cardOcrg(data1.data)
          // console.log('data',data)
          if(data.code == 200){
            data.data.imgs=data1.data
            wx.hideLoading()
            Toast('扫描成功')
            wx.navigateTo({
              url:`/pages/makecard/makecard?gid=${this.data.groupid}&isEntering=1`,
              success(res){
                res.eventChannel.emit('scan', { data: data.data })
              }
            })
          }else{
            Toast(data.message)
          }
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
  touchStart(e) {
    this.cropper.touchStart(e)
  },
  touchMove(e) {
    this.cropper.touchMove(e)
  },
  touchEnd(e) {
    this.cropper.touchEnd(e)
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
  // 扫描名片
  
  doScanCard(){
    let that=this
    isonShow= true;
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
        })
        const src = res.tempFilePaths[0];
        setTimeout(() => {
        that.wecropper.pushOrign(src);
        }, 100);
        console.log(src)
      }

    })
   
   
  },
  // 手动录入
  tomakecard(){
    let id = this.data.groupid
    wx.navigateTo({
      url: `/pages/makecard/makecard?gid=${this.data.groupid}&isEntering=1`,
    })
  },
  //跳转到管理分组页面
  tomanagegroup(){
    wx.navigateTo({
      url: `/pages/managegroup/managegroup?id=${this.data.groupid}`,
    })
  },
  //跳转到分享海报页面
  async toshare(e){
    await app.getDefaultCard()
    if(!app.globalData.defaultCard){
      Toast('请先创建名片')
      return
    }
    let path='pages/confirmjoingroup/confirmjoingroup'
    console.log(path)
    wx.navigateTo({
      url: '/pages/shareposter/shareposter?cid='+app.globalData.defaultCard.id+'&path='+path+'&groupid='+this.data.groupid
    })
    this.setData({
      popupshow:false
    })
  },
  closepopup(){
    this.setData({
      popupshow:false
    })
  },

  //跳转到管理名片页面
  tomanage(e){
    let cid = e.currentTarget.dataset.cid

    wx.navigateTo({
      url: '/pages/administration/administration?cid=' + cid
    })
  },

  //搜索名片
  search(){
    let data={}
    data.groupingsId=this.data.groupid
    data.name=this.data.searchkey
    console.log(this.data.searchkey)
    api.getGroupDetail(data).then(res=>{
      //整合请求到的数据
      const cardlist = formatInitialsData(res.data.groupingsListVOList)
      this.setData({
        cardlist,
        num: res.data.groupingsListVOList.length})
    })
  },
  //从分组中删除名片
  deletecard(e){
    let cid = e.currentTarget.dataset.id
    let that = this
    Dialog.confirm({
      message: '确认将该名片移出分组?',
    })
      .then(async () => {
        const data = await api.removegroup(cid)
        if(data.code == 200){
          Toast('移出成功')
          that.getView()
        }
      })
      .catch(() => {
        // on cancel
      });
  },

  /**
   * 获取分组详情，包含分组名片列表
   */
  async getView(){
    let data={}
    data.groupingsId = this.data.groupid
    api.getGroupDetail(data).then(res=>{
      console.log('data',res)
      wx.setNavigationBarTitle({
        title:res.data.name
      })
      //整合请求到的数据
      const cardlist = formatInitialsData(res.data.groupingsListVOList)
      this.setData({
        cardlist,
        num: res.data.groupingsListVOList.length
      })
    })
  },
  sharecard() {
    this.setData({
      popupshow: true
    })
  },
  onClose() {
    this.setData({
      popupshow: false
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    let id = options.id
    let name = options.name
    this.setData({
      groupid:id
    })
    this.data.name = name

  },
  drawShareImage() {

    let that = this
    this.setData({
      showPainter:true,
        template:{
          width:"400rpx",
          height:"300rpx",
          background:'#f03b17',
          views:[

            {
              type: "image",
              url: 'https://hangbang.obs.cn-east-3.myhuaweicloud.com/businessCard/share-bg.png',
              css:{
                  left: '0rpx',
                  top: '0rpx',
                  width: '400rpx',
                  zidnex:'1'

              }
            },
            //头像
            {
              type: "image",
              url: that.data.obj.avatar,
              css:{
                  left: '65rpx',
                  top: '73rpx',
                  width:'40rpx',
                  height:'40rpx',
                  borderRadius:'20rpx',
                  zindex:'10',
              }
            },
            // 名字
            {
              type: "text",
              text: that.data.obj.name+"  |  ",
              css: {
                  left: "120rpx",
                  top: '75rpx',
                  fontSize: "14rpx",
                  fontWeight: 'bold',
                  color: '#ffffff',

              },
            },
            // 职位
            {
                type: "text",
                text: that.data.obj.position,
                css: {
                    left: (141+that.data.obj.name.length*14)+"rpx",
                    top: '77rpx',
                    fontSize: "12rpx",
                    color: '#fff',
                    fontWeight: 'bold',
                },
            },
            // 公司名称
            {
              type: "text",
              text: that.data.obj.companyName,
              css: {
                  left: "120rpx",
                  top: '95rpx',
                  fontSize: "12rpx",
                  color: '#fff',
              },
            },
            // 手机图标
            {
                type: "image",
                url: 'https://hangbang.obs.cn-east-3.myhuaweicloud.com/businessCard/share-icon-phone.png',
                css:{
                    left: '65rpx',
                    top: '125rpx',
                    width:'18rpx',
                    height:'18rpx',
                    zindex:'10',

                }
            },

             // 联系电话
            {
              type: "text",
              text: that.data.obj.phone,
              css: {
                  maxLines:1,
                  width: '380rpx',
                  left: "95rpx",
                  top: '125rpx',
                  fontSize: "14rpx",
                  color: '#fff',

              },
            },
            // 邮箱图标
            {
              type: "image",
              url: 'https://hangbang.obs.cn-east-3.myhuaweicloud.com/businessCard/share-icon-email.png',
              css:{
                left: '65rpx',
                top: '155rpx',
                width:'18rpx',
                height:'18rpx',
                zindex:'10',
              }
            },

             // 电子邮箱
            {
              type: "text",
              text: that.data.obj.email,
              css: {
                maxLines:1,
                width: '380rpx',
                left: "95rpx",
                top: '155rpx',
                fontSize: "14rpx",
                color: '#fff',
              },
            },

            // 地址图标
            {
                type: "image",
                url: 'https://hangbang.obs.cn-east-3.myhuaweicloud.com/businessCard/share-icon-address.png',
                css:{
                  left: '65rpx',
                  top: '185rpx',
                  width:'18rpx',
                  height:'18rpx',
                  zindex:'10',
                }
            },
            // 公司地址
            {
              type: "text",
              text: that.data.obj.companyAddress,
              css: {
                maxLines:2,
                width: '260rpx',
                left: "95rpx",
                top: '185rpx',
                fontSize: "14rpx",
                color: '#fff',
                lineHeight:'17rpx'
              },
            },

          ]
        }
      })
      },
      onImgOK(e){
        this.setData({
          shareimg:e.detail.path
        })
        console.log(e.detail.path)
      },
      onImgErr(e) {
        console.log(e)
    },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  async getDefaultCard() {

    const data = await getDefaultCard()
    console.log('data', data)
    if (data.code === 200) {
      let temp = data.data.imgUrl.split(",")
      let obj = data.data
      obj.imgs = temp
      obj.isMy = 1
      this.setData({
        hasCard: true,
        login:true,
        init:true,
        id: data.data.id,
        imgs: temp,
        name: data.data.name,
        position: data.data.position,
        companyName: data.data.companyName,
        phone: data.data.phone,
        email: data.data.email,
        companyAddress: data.data.companyAddress,
        companyDesc: data.data.companyDesc,
        viewNum: data.data.viewNum,
        videoUrl:data.data.videoUrl,
        obj,
      })

    } else if (data.code == 201) {
      // 没有默认名片
      this.setData({
        hasCard: false,
        init: true
      })
    } else {
      Toast(data.message)
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow:async  function () {
    await this.getDefaultCard()
    this.getView()
    this.drawShareImage()
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
  onShareAppMessage: async function () {
    await app.getDefaultCard()
    if(!app.globalData.defaultCard){
      Toast('请先创建名片')
      return
    }
    return {
      title: this.data.obj.name+'邀请你加入他的分组'+ this.data.groupname,
      path: `${sharePath}?groupid=${this.data.groupid}&cid=${app.globalData.defaultCard.id}&share=1`,
      imageUrl:this.data.shareimg,
      success(res) {
      }
    }
  }
})
