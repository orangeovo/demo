// pages/circledetail/circledetail.js
const App = getApp();
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import {
  view,
  getCircle
} from '../../api/circle'
import api from "../../request/api.js"
import {
  getDefaultCard,
} from '../../api/user'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj: null, //整个对象，用于传参
    cardArray: [],
    firstCodeList: [],
    name: '',
    shareNumString:'',
    id: null, //圈子id
    show: false,
    showPainter: false,
    shareimg: '',
    circleObj: {}, //圈子详情
    cardId: [],
    isMy: '',
    isAxamine: ''

  },

  doDel(event) {
    let that = this
    Dialog.confirm({
        message: '确认删除?',
      })
      .then(() => {
        // on confirm
        let params = {}
        params.cid = event.currentTarget.dataset.id
        params.circleid = this.data.id
        api.deleteCardFormCircle(params).then(res => {
          this.getView(this.data.id)
        })
      })
      .catch(() => {
        // on cancel
      });
  },
  //跳转到修改和删除圈子页面
  jumptomanagecircle() {
    let id = this.data.id
    wx.navigateTo({
      url: `/pages/createcircle/createcircle?id=${id}`,
    })
  },
  // 拉人入圈
  Intocircle() {
    let id = this.data.id
    let isMy = this.data.isMy
    let isAxamine = this.data.isAxamine
    wx.navigateTo({
      url: `/pages/linkman/linkman?id=${id}&&isMy=${isMy}&&isAxamine=${isAxamine}`,
    })
  },
  //跳转到供需墙
  jumptosadwall() {
    let that = this
    console.log(that.data.id)
    wx.navigateTo({
      url: '/pages/wall/wall?id=' + that.data.id,
    })
  },
  //跳转到邀请入圈
  jumptoinvite() {
    wx.navigateTo({
      url: `/pages/sharepostercircle/sharepostercircle?id=${this.data.id}&time=${this.data.obj.createTime}`,
    })
    this.setData({
      show: false
    })
  },
  closepopup() {
    this.setData({
      show: false
    })
  },
  async getView() {

    let {
      cardArray,
      firstCodeList,
      name,
      // cardId
    } = this.data
    const data = await view(this.data.id)
    if (data.code == 200) {
      cardArray = data.data.cardList
      // data.data.cardList.forEach(el=>{
      //   cardId.push(el.id)
      // })

      name = data.data.name
      wx.setNavigationBarTitle({
        title: name
      })
      firstCodeList = Array.from(new Set(cardArray.map(el => {
        return el.firstCode
      }))).sort()
      console.log(cardArray);
      if(cardArray.length > 10){
        this.setData({
          shareNumString: '成员：' +cardArray.length +'人'
        })
      }else{
        this.setData({
          shareNumString: ''
        })
      }
      console.log(this.data.shareNumString)
      this.setData({
        cardArray,
        firstCodeList,
        name,
      })
    } else {
      Toast(data.message)
    }
  },
  //跳转到详情
  todetail(e) {
    console.log(e)
  },
  sharecard() {
    this.setData({
      show: true
    })
  },
  onClose() {
    this.setData({
      show: false
    });
  },

  //绘制分享缩略图
  drawShareImage() {
    let that = this
    this.setData({
      showPainter: true,
      template: {
        width: "400rpx",
        height: "300rpx",
        background: '#f03b17',
        views: [{
            type: "image",
            url: 'https://hangbang.obs.cn-east-3.myhuaweicloud.com/businessCard/WechatIMG25.png',
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
            url: that.data.circleObj.avatar,
            css: {
              left: '65rpx',
              top: '33rpx',
              width: '40rpx',
              height: '40rpx',
              borderRadius: '20rpx',
              zindex: '10',
            }
          },
          // 名字
          {
            type: "text",
            text: that.data.circleObj.name,
            css: {
              left: "120rpx",
              top: '35rpx',
              fontSize: "14rpx",
              fontWeight: 'bold',
              color: '#ffffff',

            },
          },

          //成员
          {
            type: "text",
            text: that.data.shareNumString,
            css: {
              left: "120rpx",
              top: '55rpx',
              fontSize: "12rpx",
              color: '#fff',
            },
          },
          // 人数
          
          // 用途
          {
            type: "text",
            text: "用途：",
            css: {
              left: '65rpx',
              top: '85rpx',
              fontSize: "12rpx",
              color: '#fff',

            }
          },


          // 用途内容
          {
            type: "text",
            text: that.data.circleObj.purpose,
            css: {
              width: '260rpx',
              height: "20rpx",
              left: '65rpx',
              top: '105rpx',
              fontSize: "12rpx",
              color: '#fff',
              overflow: "hidden",
              display: ' -webkit-box',
              maxLines: '3',
            }
          },
          // 分割线
          {
            type: "text",
            css: {
              maxLines: 1,
              width: '120rpx',
              height: "4rpx",
              left: "65rpx",
              top: '130rpx',
              backgrouncolor: "#fff",
            },
          },

          // 地址图标
          {
            type: "text",
            // url: 'https://hangbang.obs.cn-east-3.myhuaweicloud.com/businessCard/share-icon-address.png',
            text: "地址:",
            css: {
              left: '65rpx',
              top: '155rpx',
              fontSize: "12rpx",
              color: '#fff',
            }
          },
          // 公司地址
          {
            type: "text",
            text: that.data.circleObj.address,
            css: {
              maxLines: '3',
              width: '260rpx',
              left: "65rpx",
              top: '175rpx',
              fontSize: "14rpx",
              color: '#fff',
              lineHeight: '17rpx'
            },
          },
          {
            type:'image',
            url:'/images/rect.png',
            css:{
                left: '65rpx',
                top: '240rpx',
                width:'270rpx',
                height:'35rpx',
                zidnex: '10'
            }
        },
          // 点击保存按钮
          {
              type: "text",
              text:'立即入圈',
              css: {
                  left: '65rpx',
                  top: '245rpx',
                  width: '288rpx',
                  height: '45rpx',
                  color:'#ffffff',
                  
                  textAlign:'center',
                  padding:'10rpx',
                  fontSize:'20rpx'
              }
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
  //获取默认名片
  async getDefaultCard() {
    const data = await getDefaultCard()
    console.log('data', data)
    this.setData({
      obj: data.data
    })
  },
  async getCircleview() {
    const data = await getCircle(this.data.id)
    console.log('圈子详情', data);
    this.setData({
      circleObj: data.data
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      id: options.id,
      isRead: options.isRead,
      isMy: options.isMy,
      isAxamine: options.isAxamine
    })
    wx.setStorageSync('isMy', options.isMy)

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
    this.getCircleview()
    this.getView()
    await this.getDefaultCard()
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
  onShareAppMessage: function () {
    // console.log(`/pages/result/result?id=${this.data.id}`)
    return {
      title: this.data.obj.name + "邀请你加入圈子",
      path: '/pages/result/result?id=' + this.data.id,
      imageUrl: this.data.shareimg,
      success(res) {}
    }
  }
})