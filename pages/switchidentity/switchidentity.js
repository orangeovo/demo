// pages/switchidentity/switchidentity.js
import api from "../../request/api.js"
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import {updavatar} from '../../api/card.js'
//裁剪图片所需参数
import {
  baseUrl
} from "../../utils/config"
import WeCropper from '../we-cropper/we-cropper.js'

const device = wx.getSystemInfoSync() // 获取设备信息
const width = device.screenWidth // 示例为一个与屏幕等宽的正方形裁剪框
const height = device.screenHeight -40

const App=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    list:[],
    defaultCard:{},
    ifhad:false,
    show:false,
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


  //设置默认名片
  setDefault(event){
    let cid = event.currentTarget.dataset.cid
    api.setDefaultCard(cid).then(res=>{
      this.getMycard()
    })

  },
  clickavatar(e){
    this.setData({
      id:e.currentTarget.dataset.id,
      show:true
    })
  },
  onClose(){
    this.setData({
      show:false
    })
  },
  uploadImg() {
    let that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
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
  //获取我的所有名片接口
  async getMycard() {
      await api.getMyCards().then(res => {
        console.log(res)
        let { list,defaultCard } = this.data
        list = res.data
        if(list.length != 0){
          list.forEach(el=>{
            if(el.idDefault == 1)
              defaultCard = el
          })
          this.setData({
            list,defaultCard,
            ifhad:true,
          })
        }
      }).catch(res=>{
        console.log(res)
      })
  },

  //跳转到新建名片页面
  jumptocreatecard(){
    wx.navigateTo({
      url: '/pages/choosemode/choosemode',
    })
  },
  toDetail(event){
    console.log('cid',event.currentTarget.dataset.cid)
    wx.navigateTo({
      url:'/pages/exchanged/exchanged?cid='+event.currentTarget.dataset.cid
    })
  },
  
  // 更多选择
  morePopShow(event){
    wx.showActionSheet({
      itemList: ['设为默认','删除名片','修改名片'],
      success:async (res)=>{
        let cid = event.currentTarget.dataset.cid
        let data = null
        // console.log(res);
        // console.log(cid);
        console.log(this.data);
        switch (res.tapIndex) {
         case 0:
          api.setDefaultCard(cid).then(res=>{
            this.getMycard()
          })
          break;
           case 1:
          Dialog.confirm({
            message: '是否删除',
          })
          .then(() => {
            api.deleteMyCard(cid).then(res=>{
              that.getMycard()
            })
          })
          break;
          default:
            data = await api.getCardDetail(cid)
            console.log(data);
            if(data.code==200){
              if(data.type == 0){
                wx.navigateTo({
                  url: '/pages/makecard/makecard?isEntering=1',
                  success: function (res) {
                    // 通过eventChannel向被打开页面传送数据
                    res.eventChannel.emit('data',data.data)
                  }
                })
              }else{
                wx.navigateTo({
                  url: '/pages/choosemode/choosemode',
                  success: function (res) {
                    // 通过eventChannel向被打开页面传送数据
                    res.eventChannel.emit('data', data.data)
                  }
                })
              }
            }
            // wx.navigateTo({
            //   url: '/pages/choosemode/choosemode',
            // })
            break;
        }
       
        // case 2:
        //   wx.navigateTo({
        //     url: '/pages/choosemode/choosemode',
        //   })
        //   break;
      }
    })
  },

  //删除名片
  deleteCard(event){
    let that = this
    let cid = event.currentTarget.dataset.cid
    Dialog.confirm({
      message: '是否删除',
    })
    .then(() => {
      api.deleteMyCard(cid).then(res=>{
        that.getMycard()
      })
    })
    .catch(() => {
      // on cancel
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

              let data={
                url:data1.data,
                id:that.data.id,
              }
              await updavatar(data)
              that.onShow()
            }
          },
          fail(res) {
            wx.hideToast()
            Toast(`文件上传错误`)
          }
        })
      } else {
        console.log('获取图片地址失败，请稍后重试')
      }
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
  closeTap() {
    this.setData({
      iscropper: false
    })
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
    this.getMycard()
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
