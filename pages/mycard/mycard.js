// pages/mycard/mycard.js
import api from "../../request/api.js"
import {
  getVipDesc,
  getUserCover
} from '../../api/user'
import {
  sharePath,
  tokenName
} from '../../utils/config'
const app = getApp()
import {
  getDefaultCard,
  whohim
} from '../../api/user'
const App = getApp();
const scale = wx.getSystemInfoSync().windowWidth / 750
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    vipDesc: '',
    obj: null, //整个对象，用于传参
    hasCard: false, // 是否拥有默认名片
    init: false,
    longitude: "",
    latitude: "",
    address: '',
    title: '新建名片',
    show: false,
    imgs: [], // 图片
    name: '', // 姓名
    position: '', // 职位
    companyName: '', // 公司名称
    phone: '', //手机号
    email: '', //邮箱
    companyAddress: '', //公司地址
    companyDesc: '', //公司介绍
    viewNum: 0, //查看次数
    id: '',
    videoUrl: "", //视频
    login: false, // 是否登录
    shareimg: '',
    template: {},
    tempPath: '',
    showPainter: false,
    cardcover: "https://hangbang.obs.cn-east-3.myhuaweicloud.com/businessCard/home.png"
  },
  toMakeCard: function () {
    app.auth(() => {
      wx.navigateTo({
        url: '/pages/choosemode/choosemode',
      })
    })

  },
  //跳转到切换身份页面
  changeIdentity() {
    wx.navigateTo({
      url: '../switchidentity/switchidentity',
    })
  },
  //跳转到谁在看我
  toseen() {
    wx.navigateTo({
      url: '/pages/wholooksme/wholooksme'
    })
  },

  //获取默认名片
  async getDefaultCard() {
    const data = await getDefaultCard()
    if (data.code === 200) {
      App.globalData.currentcardid = data.data.id
      let temp = data.data.imgUrl.split(",")
      let obj = data.data
      obj.imgs = temp
      obj.isMy = 1
      App.globalData.currentuid = data.data.uid
      this.setData({
        hasCard: true,
        login: true,
        init: true,
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
        videoUrl: data.data.videoUrl,
        obj,
      })

    } else if (data.code == 201) {
      // 没有默认名片
      const cardcover = await api.getCardCover()
      this.setData({
        hasCard: false,
        init: true,
        cardcover: cardcover.data
      })
    } else {
      Toast(data.message)
    }
  },
  // 分享名片事件
  doShareCard() {
    this.setData({
      show: true,
      showcanvas: true

    })
  },
  onClose() {
    this.setData({
      show: false,
    });
  },
  // 分享海报页
  toPoster() {
    wx.navigateTo({
      url: '/pages/shareposter/shareposter?cid=' + this.data.id,
    })
    this.setData({
      show: false
    })
  },
  // 获取默认封面
  async getCover() {
    try {
      const data = await getUserCover()
      this.setData({
        cardcover: data.data
      })
      console.log('默认封面', data);
    } catch (error) {

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.getCover()
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  //绘制分享缩略图
  drawShareImage() {
    if(this.data.login && this.data.hasCard){
      let that = this
      let bg = "https://hangbang.obs.cn-east-3.myhuaweicloud.com/businessCard/share-bg.png";
      this.setData({
        
        template: {
          width: "400rpx",
          height: "300rpx",
          // background: '#1559F3',
          views: [
            {
              type: "image",
              // url:bg,
              url: 'https://hangbang.obs.cn-east-3.myhuaweicloud.com/businessCard/share-bg.png',
              css: {
                left: '0rpx',
                top: '0rpx',
                width: '400rpx',
                zidnex: '1'

              }
            },
            //头像
            {
              type: "image",
              url: that.data.obj.avatar,
              css: {
                left: '65rpx',
                top: '73rpx',
                width: '40rpx',
                height: '40rpx',
                borderRadius: '20rpx',
                zindex: '10',
              }
            },
            // 名字
            {
              type: "text",
              text: that.data.obj.name + "  |  ",
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
                left: (141 + that.data.obj.name.length * 14) + "rpx",
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
              css: {
                left: '65rpx',
                top: '125rpx',
                width: '18rpx',
                height: '18rpx',
                zindex: '10',

              }
            },

            // 联系电话
            {
              type: "text",
              text: that.data.obj.phone,
              css: {
                maxLines: 1,
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
              css: {
                left: '65rpx',
                top: '155rpx',
                width: '18rpx',
                height: '18rpx',
                zindex: '10',
              }
            },

            // 电子邮箱
            {
              type: "text",
              text: that.data.obj.email,
              css: {
                maxLines: 1,
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
              css: {
                left: '65rpx',
                top: '185rpx',
                width: '18rpx',
                height: '18rpx',
                zindex: '10',
              }
            },
            // 公司地址
            {
              type: "text",
              text: that.data.obj.companyAddress,
              css: {
                maxLines: 2,
                width: '260rpx',
                left: "95rpx",
                top: '185rpx',
                fontSize: "14rpx",
                color: '#fff',
                lineHeight: '17rpx'
              },
            },

          ]
        },
        showPainter: true
      })
    }

  },
  onImgOK(e) {
    this.setData({
      shareimg: e.detail.path
    })
    console.log(e.detail.path)
  },
  onImgErr(e) {
    console.log(e)
  },
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    // 判断是否登录
    let token = wx.getStorageSync(tokenName)
    if (token) {
      // 已登录
      // 获取默认名片
      await this.getDefaultCard()
      this.drawShareImage()

      // setData放在getDefaultCard里执行
    } else {
      // 未登录
      this.setData({
        login: false,
        init: true
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
    return {
      title: this.data.companyName + '-' + this.data.name,
      path: `${sharePath}?cid=${this.data.id}&share=1`,
      imageUrl: this.data.shareimg,
      success(res) {}
    }
  }
})
