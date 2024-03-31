// pages/sharesgongxu/sharesgongxu.js
import {
  outView,
  getQrCode
} from '../../api/card'
import api from "../../request/api.js"
import {
  sharePath
} from '../../utils/config'
import {
  circleQrCode
} from '../../api/circle'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import {
  getsharebg
} from '../../api/user'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backgroundimg:'',
    id: null, //文章id
    view: {},
    url: 'pages/gongxudetail/gongxudetail',
    qrCode: '',
    gid: '',
    showPainter: false,
    howPainter: false,
    name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */


  onLoad: function (options) {
    console.log(options);
    this.setData({
      id: options.id,
      type: options.type
    })
    this.getsadwalldetail()
    this.getQrCode()
    
  },
  //获取供需详情
  getsadwalldetail() {
   
    let data = {}
    data.id = this.data.id
    api.sadwalldetail(data).then(res => {
      console.log('供需详情', res);
      if (res.code == 200) {
        this.setData({
          view: res.data,
          id: res.data.cardId,
          name:res.data.name.slice(0,1)
        })
      }
    })
  },
  async getQrCode() {
    
    let res=await getsharebg((this.data.type==1?'2':'3'))
    console.log(res.data)
    this.setData({
        backgroundimg:res.data
    })
    if (this.data.gid) {
      // 获取分享组二维码
      const data = await getGroupQrCode(this.data.id, this.data.gid, this.data.url)
      if (data.code == 200) {
        this.data.qrCode = data.data
      } else {
        Toast(data.message);
      }
    } else {
      // 获取普通名片二维码
      const data = await circleQrCode(this.data.id, this.data.url)
      if (data.code == 200) {
        console.log('二维码', data);
    
        this.data.qrCode = data.data
      } else {
        Toast(data.message);
      }
    }
    this.setData({
      qrCode:this.data.qrCode
    })
  },
  onSave() {
    Toast.loading({
      message: '海报生成中...',
      forbidClick: true,
    });
    let bgimg=(this.data.type==1?'/images/gongbg.png':'/images/xubg.png')
    let that = this
    this.setData({
      showPainter: true,
      template: {
        width: "750rpx",
        height: "1300rpx",
        background: '#fff',
        views: [
          // 背景框
          {
            type: 'rect',
            css: {
              width: "690rpx",
              height: "1240rpx",
              left: '30rpx',
              top: '30rpx',
              color: "#ffffff",
              borderWidth: '1rpx',
              borderColor: '#eeeeee',
              borderRadius: '10rpx',
            }
          },
          // 背景图
          {
            type: "image",
            url: that.data.backgroundimg,
            css: {
              left: '30rpx',
              width: '690rpx',
              height: '1240rpx',
            }
          },
        
          // 供应标题
          {
            type: "text",
            text: that.data.view.title,
            css: {
              maxLines: 1,
              width: '510rpx',
              left: "80rpx",
              top: '530rpx',
              fontSize: "32rpx",
              color: '#000000',
            },
          },
          // 供应详情
          {
            type: "text",
            text: that.data.view.content,
            css: {
              maxLines: 5,
              width: '510rpx',
              left: "80rpx",
              top: '580rpx',
              fontSize: "24rpx",
              color: '#666666',
            },
          },
          
          // 头像
          {
            type: "image",
            url: that.data.view.avatar || that.data.view.imgs[0],
            css: {
                width: '100rpx',
                height: '100rpx',
                top: '870rpx',
                left: '100rpx',
                borderRadius: '50rpx',
            }
        },
         // 名称
         {
          type: "text",
          text: that.data.name+'**',
          css: {
            maxLines: 1,
            width:'100rpx',
            left: "230rpx",
            top: '870rpx',
            fontSize: "32rpx",
            color: '#000000',
          },
        },
         // 职位
         {
          type: "text",
          text: that.data.view.position,
          css: {
            maxLines: 1,
            left: "330rpx",
            top: '870rpx',
            fontSize: "24rpx",
            color: '#666666',
          },
        },
         // 公司
         {
          type: "text",
          text: "公司: ",
          css: {
            maxLines: 1,
            left: "230rpx",
            top: '930rpx',
            fontSize: "24rpx",
            color: '#666666',
          },
        },
         // 公司
         {
          type: "text",
          text:that.data.view.companyName,
          css: {
            maxLines: 1,
            left: "300rpx",
            top: '930rpx',
            fontSize: "24rpx",
            color: '#666666',
          },
        },
          // 二维码
          {
            type: "image",
            url: that.data.qrCode,
            css: {
              left: '441rpx',
              top: '1000rpx',
              width: '150rpx',
              height: '150rpx',
            }
          },
        ]
      }
    })
  },
  onImgOK(e) {
    Toast.clear()
    console.log(e.detail.path)
    wx.saveImageToPhotosAlbum({
      filePath: e.detail.path,
      success: (res) => {
        console.log(res)
      },
      fail: (err) => {
        console.log(err)
      }
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