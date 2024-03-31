// pages/wholooksme/wholooksme.js
import api from "../../request/api.js";
const app = getApp()
import {
  whoLooksMe,
  cardApply,
} from '../../api/user'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [], // 数据列表
    dateList: [], // 日期列表
    noMore: false, // 没有数据
    isvip: true,
    userInfo: null,
    params: {
      page: 1,
      size: 10
    },
    cid: null, //是在看他的名片ID，如果是谁在看我，则为空
    isShow: false,
    linkInfo: ""
  },
  async apply(e) {
    this.setData({
      isShow: true,
      linkInfo:'',
      cardId: e.currentTarget.dataset.item.cardId
    })
  },
  onClose(){
    this.setData({
      isShow: false,
      linkInfo:'',
    })
  },
  async submit() {
    let that = this
    let linkInfo = this.data.linkInfo
    if(!this.data.linkInfo){
     linkInfo ="分享交换"
    }else{
      linkInfo = this.data.linkInfo
    }
    app.auth(() => {
      wx.requestSubscribeMessage({
        tmplIds:['h8qmDxqKP23fHzXENat9WFyjguya6tqJdKJg6znFfIg'],
        async complete(){
          const data = await cardApply(that.data.cardId, {
            linkInfo: linkInfo
          })
          if (data.code == 200) {
            Toast('发送成功，等待对方验证')
            that.getList()
          }else {
            Toast(data.message)
          }
          that.setData({
            linkInfo:''
          })
        }
      })
    })
    .catch(() => {
      // on cancel
    });
  },
  /**
   * 获取访问者列表
   * @param id 被访问者uid，如果是本人  不用传
   * @returns {Promise<void>}
   */
  async getList(id) {
    let params = this.data.params
    if (this.data.cid) {
      params.beVisitCardUid = this.data.cid
    }
    const data = await whoLooksMe(params)
    if (data.code === 200) {
      let dateList = this.data.dateList
      let list = data.data.records
      list.forEach(el => {
        // console.log(el)
        // 提取日期
        let day = el.createTime.slice(0, 10)
        // 如果没有在日期数组里，则添加
        if (dateList.indexOf(day) == -1) {
          dateList.push(day)
        }
      })
      //未交换名片不显示完整信息
      list.map(v => {
        if (v.isExchange == 0) {
          if (v.companyName.length <= 4) {
            v.companyName = v.companyName.replace(v.companyName.substr(2), '**')
          } else {
            v.companyName = v.companyName.replace(v.companyName.substr(2, v.companyName.length - 4), '****')
          }
        }
      })
      if (this.data.params.page > 1) {
        list = [...this.data.list, ...list]
      }
      // 判断是否还有数据
      let noMore = false
      if (list.length >= data.data.total) {
        noMore = true
      }
      this.setData({
        list,
        dateList,
        noMore,
      })
    } else {
      Toast(data.message)
    }
  },
  toVip() {
    wx.navigateTo({
      url: '/pages/vipcenter/vipcenter'
    })
  },
  todetail(e) {
    let cid = e.currentTarget.dataset.cid
    let status = e.currentTarget.dataset.status

    wx.navigateTo({
      url: '/pages/exchanged/exchanged?cid=' + cid
    })


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.data.cid = options.cid
    // 获取当前用户信息，是否VIP
    await app.getUserInfo()
    this.setData({
      userInfo: app.globalData.userInfo
    })

    if (options.cid && options.isMy == 0) {
      wx.setNavigationBarTitle({
        title: '谁在看他'
      })
    }
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
    this.getList()
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
    if (this.data.noMore) return
    this.data.params.page++
    this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
