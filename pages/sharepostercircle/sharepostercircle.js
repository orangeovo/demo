// pages/shareposter/shareposter.js
import {
  outView,
  getQrCode
} from '../../api/card'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import api from '../../request/api';
const app = getApp();
import {
  getsharebg
} from '../../api/user'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    // backgroundimg:'',
    backgroundimg: "../../images/quanzibeijing.png",
    view: null,
    userInfo: null,
    loading: true,
    qrCode: '',
    showPainter: false,
    template: {},
    tempPath: '',
    url: 'pages/result/result',
    circleid: ''
  },
  onSave() {
    Toast.loading({
      message: '海报生成中...',
      forbidClick: true,
    });
    let that = this
    
    this.setData({
      showPainter: true,
      template: {
        width: "750rpx",
        height: "1334rpx",
        background: "#f8f8f8",
        views: [
          // 背景图片
          {
            type: "image",
            url: that.data.backgroundimg,
            // url: "https://cardcase.obs.cn-east-3.myhuaweicloud.com/quanzibeijing.png",
            css: {
              "width": '750rpx',
              "height": '1334rpx',
              "top": "0px",
              "left": "0px",
              "rotate": "0",
              "borderRadius": "",
              "borderWidth": "",
              "borderColor": "#F7FBFE",
              "shadow": "",
              "mode": "scaleToFill"
            }
          },

          // 圈子名称
          {
            type: "text",
            text: that.data.view.name,
            css: {
              left: '56rpx',
              top: '105rpx',
              fontSize: "36rpx",
              fontWeight: 'bold',
              color: '#414141',
            },
          },
          // 圈主label
          {
            type:"text",
            text:'圈主',
            css:{
              borderRadius: '5rpx',
              background: '#EDCBA6',
              height: '33rpx',
              lineHeight: '33rpx',
              color: '#613F1C',
              padding:'0 10rpx',
              fontSize: '22rpx',
              position: 'absolute',
              left: '65rpx',
              top: '565rpx',
            }
          },
          // 圈主名称
          {
            type:"text",
            text:'微信用户',
            css:{
              position: 'absolute',
              left: '130rpx',
              top: '568rpx',
              fontSize: '20rpx',
              color: '#232323',
            }
          },
          // 卡片背景
          {
            type: "image",
            url: '../../images/card_bg.jpg',
            css:{
              top: '177rpx',
              width: '656rpx',
              height: '367rpx',
              left: '50rpx',
              // 56rpx
            }
          },
          // 圈子简介
          {
            type: "text",
            text: that.data.view.purpose  || '暂未填写',
            css: {
             width: '630rpx',
              left: '63rpx',
              top: '634rpx',
              fontSize: "20rpx",
              display: '-webkit-box',
              color: '#2F3336',
              lineClamp: '2',
              overflow: 'hidden',
            },
          },
          // 圈子地址
          {
            type: "text",
            text: '地区 · ' + that.data.view.address || '暂未填写',
            css: {
              color: '#232323',
              fontSize: '20rpx',
              position: 'absolute',
              right: '55rpx',
              top: '568rpx',
            },
          },
          // 标签
          {
            type: "text",
            text: '#核心材料 #科技 #机器人',
            css: {
              display: 'flex',
              left: '63rpx',
              position: 'absolute',
              top: '730rpx',
              fontSize: '22rpx',
              color: '#3E3E3E',
              width: '646rpx',
            },
          },
          {
            type:'image',
            url:'../../images/lineHB.png',
            css:{
              width: '656rpx',
              height:'10rpx',
              top: '770rpx',
              left: '63rpx',
            }
          },
          {
            type:'text',
            text:'长按扫码查看详情',
            css:{
              fontSize: '20rpx',
              color: '#879093',
              position: 'absolute',
              left: '56rpx',
              top: '865rpx',
            }
          },
          {
            type:'text',
            text:'加入圈子',
            css:{
              fontSize: '26rpx',
              color: '#326CEC',
              fontWeight: 'bold',
              position: 'absolute',
              left: '56rpx',
              top: '903rpx',
            }
          },
          // 二维码
          {
            type: "image",
            url: that.data.qrCode,
            css: {
              top: '815rpx',
              right: '70rpx',
              width: '170rpx',
              height: '170rpx',
            }
          },
        ]
      }
    })
    
  },
  async getView(id) {
    let res = await getsharebg(1)
    this.setData({
      backgroundimg: res.data
      // backgroundimg:"https://cardcase.obs.cn-east-3.myhuaweicloud.com/quanzibeijing.png"
      // backgroundimg:"../../images/quanzibeijing.png"
    })
    api.getCircleDetailQR(id).then(data => {
      console.log('圈子', data)
      if (data.code == 200) {
        this.setData({
          view: data.data
        })
      } else {
        Toast(data.message);
      }
    })

  },

  onImgOK(e) {
    Toast.clear()
    console.log(e.detail.path)
    wx.saveImageToPhotosAlbum({
      filePath: e.detail.path,
      success: (res) => {
        Toast('保存成功');
      },
      fail: (err) => {
        Toast(err)
      }
    })
  },
  async getQrCode(id, path) {
    const data = await getQrCode(id, path)
    console.log(data)
    if (data.code == 200) {
      this.setData({
        qrCode: data.data
      })
    } else {
      Toast(data.message);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.data.id = options.id
    await this.getQrCode(this.data.id, this.data.url)
    await this.getView(this.data.id)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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