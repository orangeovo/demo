// pages/exchanged/exchanged.js
import { sharePath } from "../../utils/config";

const app = getApp();
import api from "../../request/api.js";
import {
  outView
} from '../../api/card'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gid: null, // 分组ID
    circleId: null, // 圈子ID 通过圈子进入会带上
    linkInfo: '', // 交换事由
    isShow: false,
    cid: null, // 名片ID
    obj: null, // 整个名片对象，用于传参
    init: false,
    isShare:0,
    isMyCircle:0,//是否是圈主
    share: 0, // 是否通过别人分享的链接进入
    show: false, // 是否显示分享弹窗
    adminShow: false, // 管理名片弹窗
    shareimg: '',
    template: {},
    tempPath: '',
    showPainter: false,
    shareAdminShow: false,
    maskFlag:false,//遮罩层flag
  },
  toMyCard(){
    wx.navigateTo({
      url:'/pages/mycard/mycard'
    })
  },
  async submit() {
    let that = this
    let params = {}
    params.cardid = that.data.cid
    params.circleid = that.data.circleId
    if(!this.data.linkInfo){
      params.linkinfo ="分享交换"
    }else{
        params.linkinfo = this.data.linkInfo
    }
    wx.requestSubscribeMessage({
      tmplIds:['h8qmDxqKP23fHzXENat9WFyjguya6tqJdKJg6znFfIg'],
      fail(e){
        console.log(e)
      },
      async complete(){
        // 三种形式的交换名片 普通交换  圈子交换  分组交换
        if (that.data.circleId) {
          // 圈子内交换名片
          const data = await api.sendCardandcircle(params)
          if (data.code == 200) {
            Toast('发送申请成功')
          }
        }else if(that.data.gid){
          // 分组交换名片
          let data = await api.changeandjoingroup(that.data.gid)
          if(data.code == 200){
            Toast('发送申请成功')
          }
        } else {
          // 普通交换名片
          params.id = that.data.obj.id
          const data = await api.sendCard(params)
          if (data.code == 200) {
            Toast('发送申请成功')
          }
        }
        that.setData({
          linkInfo:''
        })
      }
    })
  },
  // 交换名片
  doExchanged() {
    let that = this
    app.auth(() => {
      that.setData({
        isShow:true,
        shareAdminShow: false,
        linkInfo:''
      })
    })
    .catch(() => {});
  },
  // 收藏
  doCollect() {
    app.auth(() => {
      let data = {}
      data.cardid = this.data.obj.id
      data.flag = this.data.obj.isCollect == 1 ? false : true
      api.collectCard(data).then(res => {
        if (res.code == 200) {
          Toast(data.flag ? '已收藏' : '已取消')
          this.setData({
            shareAdminShow:false
          })
          this.getView()
        } else {
          Toast(res.message)
        }
      })
    })
  },
  // 分享名片事件
  doShareCard() {
    this.setData({
      show: true
    })
  },

  onClose() {
    this.setData({
      show: false,
      adminShow: false,
      shareAdminShow: false,
      linkInfo:'',
    });
  },
  // 关闭分享弹窗
  onCloseShare() {
    this.setData({
      show: false,
    });
  },
  // 分享名片海报
  toPoster() {
    let url = `/pages/shareposter/shareposter?cid=${this.data.obj.id}`
    wx.navigateTo({
      url,
    })
    this.setData({
      show: false
    })
  },
  // 打开管理名片弹窗
  openAdminCard() {
    this.setData({
      adminShow: true
    })
  },
  //
  openShare() {
    this.setData({
      shareAdminShow: true
    })
  },
  // 跳转首页
  toTabar() {
    wx.switchTab({
      url: '/pages/cardholder/cardholder',
    })
  },
  // 删除名片成功回调函数
  delSuccess() {

    if (this.data.share) {
      // 分享页,关闭弹窗，刷新
      this.getView()
      this.onClose()
    } else {
      // 普通页，关闭弹窗，返回上一层
      this.onClose()
      Toast('删除成功')
      setTimeout(() => {
        wx.navigateBack()
      }, 600)

    }
  },
  async getView() {
    let data = null
    let cid = this.data.cid
    if (app.globalData.userInfo == null) {
      // 未登录
      data = await outView(cid)
      data.data.isMy = 0
    } else {
      // 已登录
      data = await api.getCardDetail(cid)
      // 判断是否查看自己的名片
      if (app.globalData.userInfo.id == data.data.uid) {
        data.data.isMy = 1
      } else {
        data.data.isMy = 0
      }
    }
    console.log('data',data)
    let obj = data.data
    obj.imgs = obj.imgUrl.split(',')
    this.data.isShare =  obj.inUserCard
    // 判断是否可以显示完全
    // 1 不是我的名片 2 不是分享来的 3 没有被我加入名片夹
    // console.log(obj.inUserCard);
    // console.log(!obj.isMy);
    // && !this.data.share  //名片隐藏内容信息
    if (!obj.isMy && !this.data.share &&  obj.inUserCard == 0) {
      console.log('遮罩层显示----');
      // 无法显示完成，隐藏部分信息, 手机号，邮箱，公司名称显示首尾两个字段，地址显示前四个字段
      obj.phone = this.encrypt(obj.phone)
      obj.email = this.encrypt(obj.email)
      // obj.companyName = this.encrypt(obj.companyName)
      obj.companyAddress = this.encrypt(obj.companyAddress, 2)
      // console.log(obj);
      this.setData({
        maskFlag:true,
      })
      wx.hideShareMenu()
    }
    this.setData({
      obj,
      init: true,
    })
    wx.setNavigationBarTitle({
      title: data.data.name + "的名片",
    })
  },
  // 加密字段
  encrypt(str, type = 1) {
    if (type == 1) {
      //首尾两个字段,如果小于等于四个字段，则显示首两个字段
      if (str.length > 4) {
        let start = str.slice(0, 2)
        let end = str.slice(-2)
        return start + '***' + end
      } else {
        return str.slice(0, 2) + '***'
      }
    } else {
      // 首四个字段
      return str.slice(0, 4) + '*************'
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(options)
    // 分组参数
    let gid
    // 圈子参数
    let circleId
    // 分享参数
    let share
    // 名片参数，必带
    let cid
    // 以上参数有两种接收方式 1 路径 2 二维码解析
    if (options.cid) {
      cid = options.cid
      gid = options.groupid
      circleId = options.circleId
      share = parseInt(options.share) ? 1 : 0
    } else {
      let scene = decodeURIComponent(options.scene)
      cid = scene.split('&')[0].split('=')[1]
      if(scene.split('&')[1].split('=')[0] == 'gid'){
        gid = scene.split('&')[1].split('=')[1]
      }
      // 扫描二维码进入，必定是分享
      // share = 1
    }
    console.log('gid',gid)
    console.log('circleId',circleId)
    console.log('cid',cid)
    console.log('share',share)
    this.setData({
      gid,circleId,share,cid
    })

  },
  //点击关闭弹窗
  closepopup() {
    this.setData({
      show: false
    })
  },

  drawShareImage() {

    let that = this
    this.setData({
      showPainter: true,
      template: {
        width: "400rpx",
        height: "300rpx",
        background: '#f03b17',
        views: [

          {
            type: "image",
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
              left: '295rpx',
              top: '73rpx',
              width: '40rpx',
              height: '40rpx',
              // padding: '30rpx',
              borderRadius: '20rpx',
              boxShadow: '0rpx 5rpx 11rpx 2rpx rgba(50,108,236,0.23)',
              // background:'white',
              zindex: '10',
            }
          },
          // 名字
          {
            type: "text",
            text: that.data.obj.name + "  |  ",
            css: {
              left: "70rpx",
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
              left: (91 + that.data.obj.name.length * 14) + "rpx",
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
              left: "70rpx",
              top: '100rpx',
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
      }
    })
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
  //跳转到新建名片页面
  jumptocreatecard() {
    app.auth(() => {
      wx.navigateTo({
        url: '/pages/makecard/makecard?type=' + this.data.obj.type,
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    let isMyCircle = wx.getStorageSync('isMy')
    console.log("是否是圈主：" + isMyCircle)
    this.setData({
      isMyCircle:isMyCircle
    })
    await app.getUserInfo()
    // 判断是否登录，根据是否登录，调用不同的查看名片接口
    await this.getView()
    this.drawShareImage()
    // if(this.data.isShare == 0){
    //   wx.hideShareMenu()
    // }
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
    this.setData({
      maskFlag:false,
    })
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
    // wx.hideShareMenu()
    let url = `${sharePath}?cid=${this.data.cid}&share=${this.data.isShare}`

    if(this.data.circleId){
      url += `&circleId=${this.data.circleId}`
    }
    if(this.data.gid){
      url += `&gid=${this.data.gid}`
    }
    console.log(url)
    return {
      title: this.data.obj.companyName + '-' + this.data.obj.name,
      path: url,
      imageUrl: this.data.shareimg,
      success(res) {}
    }
  }
})
