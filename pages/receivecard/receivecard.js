// pages/receivecard/receivecard.js
import api from "../../request/api.js";
import { cardApplyListSend,cardApplyListReceive,getCardApplyTotalNum,getCardVisitTotalNum } from '../../api/user'
const app = getApp()
let moment = require('../../utils/moment.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totNum: 0, // 已经投递的总数
    totalNum: 0,
    type:0, // 0投递的列表 1接收的列表
    list: [], // 数据列表
    initList:{}, // 序列化后的数组 key是日期  value是日期对应的名片数组
    noMore:false, // 没有数据
    articleId:null,
    params:{
      page:1,
      size:10
    },
    userInfo:null,
    init:false,
  },
  toVip(){
    wx.navigateTo({
      url:'/pages/vipcenter/vipcenter'
    })
  },
  transmit(e){
    const id = e.currentTarget.dataset.id
    let that = this
    api.cardExchangeOrReject(id,5).then(res => {
      that.getList(true)

      wx.showToast({
        title: '交换成功'
      })
    })
  },
  todetail(e){
    let cid = e.currentTarget.dataset.cid
    console.log(cid)
    return
    // 如果是接收列表，点击可以查看名片完整信息
    wx.navigateTo({
      url: `/pages/exchanged/exchanged?cid=${cid}&share=${this.data.type}`
    })
  },
  /**
   * 拒绝交换
   * @param e
   */
  doRefuse(e){
    const id = e.currentTarget.dataset.id
    let that = this
    api.cardExchangeOrReject(id,10).then(res => {
      that.getList(true)
      wx.showToast({
        title: '拒绝成功'
      })
    })
  },
  async getList(f5 = false){
    let data = null
    let tatalData = null
    let params = {}
    if(this.data.noMore && !f5) return
    if(f5){
      // 刷新
      params.page = 1
      params.size = this.data.params.page * this.data.params.size
    }else{
      // 翻页
      params = this.data.params
    }
    if(this.data.articleId){
      params.articleId = this.data.articleId
    }

    if(this.data.type == 0){
      // 递出名片列表
      data = await cardApplyListSend(params)
     tatalData = await getCardApplyTotalNum()
      
    
    }else{
      // 收到名片列表
      data = await cardApplyListReceive(params)
     tatalData = await getCardVisitTotalNum()
    }
    console.log('data',data)
    if(data.code ==200){
      // 获取数据
      let { list, initList, } = this.data
      if( params.page == 1){
        list = [...data.data.records]
      }else{
        list = [...list,...data.data.records]
      }
      // 判断是否还有数据
      let noMore = false
      if(list.length >= data.data.total){
        noMore = true
      }

      let totNum = data.data.total
      let totalNum = tatalData.data
      console.log(totalNum)
      // 序列化数组
      initList = {}
      list.forEach(el=>{
        let key = moment(el.createTime).format('YYYY-MM-DD')
        if(!initList[key]){
          initList[key] = []
        }
        initList[key].push(el)
      })
      //未交换名片不显示完整信息
      // list.map(v => {
      //   if(v.status !== 5){
      //     if(v.companyName.length <= 4){
      //       v.companyName = v.companyName.replace(v.companyName.substr(2),'**')
      //     }else{
      //       v.companyName = v.companyName.replace(v.companyName.substr(2,v.companyName.length - 4),'****')
      //     }
      //   }
      // })
      console.log(initList)
      this.setData({
        list,
        initList,
        noMore,
        totNum,
        totalNum,
      })
    }else{

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.setData({init:false})
    this.data.articleId = options.article
    await wx.setNavigationBarTitle({title: options.type == 0 ? '递出的名片' : '收到的名片',})
    this.setData({
      init:true,
      type:options.type
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
  onShow: async function () {
    await app.getUserInfo()
    await this.getList(true)
    this.setData({
      userInfo:app.globalData.userInfo,
    })
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
  onPullDownRefresh: async function () {
    this.data.noMore = false
    await this.getList(true)
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    if(this.data.noMore) return
    this.data.params.page ++
    await this.getList()


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
