// pages/viewOtherCard/viewOtherCard.js
import api from "../../request/api.js";
import { getCircleCard } from '../../api/card'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import {sharePath} from "../../utils/config";
import { outView } from "../../api/card.js";


Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:true,
    shareShow:false,
    view:null,
    isAll: 0,
    id:'',
    flag:false, //是否收藏判断
    collectclass:0, //css样式判断条件
   
  },
  //联系他
  doCall(){
    wx.makePhoneCall({
      phoneNumber: this.data.view.phone,
    })
  },
  doShare(){
    this.setData({
      shareShow:true
    })
  },
  toPoster() {
    wx.navigateTo({
      url: '/pages/shareposter/shareposter?cardid=' + this.data.id,
    })
  },
  doClose(){
    this.setData({
      shareShow:false
    })
  },
  doCollect(){
    let data={}
    data.cardid=this.data.id
    data.flag=!this.data.flag
    api.collectCard(data).then(res=>{
      if(res.code==200){
        if(this.data.flag){
          this.setData({
            collectclass:2
          })
          setTimeout(()=>{
            this.setData({
              flag:data.flag
            })
          },300)
        }else{
          this.setData({
            collectclass:1
          })
          setTimeout(()=>{
            this.setData({
              flag:data.flag
            })
          },300)
        }
        
      }
    })
    
    
  },
  async getView(cid){
    const data = await outView(cid)
    console.log('data',data)
    data.data.imgs = data.data.imgUrl.split(',')
    let {name,companyName,position,viewNum,companyDesc,imgUrl,id,uid,isAll,phone,email,companyAddress,isCollect} = data.data
    this.data.view = {name,companyName,position,viewNum,companyDesc,imgs:imgUrl.split(','),id,uid,isAll,phone,email,companyAddress,isCollect}
    wx.setNavigationBarTitle({
      title: data.data.name+"的名片",
    })
    if(this.data.view.isCollect==1){this.setData({flag:true})}else{this.setData({flag:false})}
  
  },
  //交换名片
  exchangecard(){
    let that = this.data
      Dialog.confirm({
          title: '交换名片',
          message: '确定要与他交换名片吗?'
      })
      .then(async () => {
        api.sendCard(that.id).then(data=>{
          console.log(data)
          if(data.code == 200){
              Toast.success('发送成功，等待对方验证')
          }else{
              Toast(data.message)
          }
        }).catch(err => {
          if(err.code == 205){
              Toast.success('交换成功')
          }
        })
      })
      .catch(() => {
        // on cancel
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log('options',options.id)
    
    await this.getView(options.id)
    let that = this
    this.setData({
      loading:false,
      view:that.data.view,
      id:options.id
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
    return {
      title: this.data.view.companyName + '-' + this.data.view.name,
      path: '/pages/viewOtherCard/viewOtherCard?id='+this.data.id,
      success(res) {
      }
    }
  }
})
