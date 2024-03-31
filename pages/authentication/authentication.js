const api = require("../../request/api");
import { auth } from '../../api/user'
import { uploadFile } from '../../utils/http'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    realName: '',
    IDcard: '',
    phone: '',
    code: '',
    frontImgUrl: '',
    backImgUrl: '',
    enclosure: [],
    timer:null,
    countDown:60,
  },
  getCode(){
    if(this.data.timer) return
    let that = this
    api.getCode({phone:this.data.phone}).then(res => {
      if(res.code == 200){
        Toast('验证码发送成功，请注意查收')
        that.data.timer = setInterval(()=>{
            let { countDown } = that.data
            if (countDown == 1){
              clearInterval(that.data.timer)
              that.setData({
                timer:null,
                countDown:60
              })
            }else{
              that.setData({
                timer:that.data.timer,
                countDown:countDown - 1
              })
            }
          },1000)

      }
    })
  },
  idCardFront(){
    let that = this
    app.upload((url) => {
      that.setData({
        frontImgUrl:url
      })
    })
  },
  idCardBack(){
    let that = this
    app.upload((url) => {
      that.setData({
        backImgUrl:url
      })
    })
  },
  uploadEnclosure(event){
    const { file } = event.detail;
    let that = this
    app.onlyUpload(file.url,(url) => {
      let enclosure = that.data.enclosure
      enclosure.push({ ...file, url: url })
      that.setData({enclosure})
    })
  },
  delEnclosure(event){
    let enclosure = this.data.enclosure
    enclosure.splice(event.detail.index,1)
    this.setData({enclosure})
  },
  clear(e){
    // console.log(e)
    let index = e.currentTarget.dataset.index
    let enclosure = this.data.enclosure
    enclosure.splice(index,1)
    this.setData({
      enclosure
    })
  },
  async submit(){
    let params = {}
    let temp = this.data.enclosure.map(val => {
      return val.url
    })
    params.attachment = temp.join(',')
    params.captcha = this.data.code
    params.idCard = this.data.IDcard
    params.idCardFront = this.data.frontImgUrl
    params.idCardBack = this.data.backImgUrl
    params.phone = this.data.phone
    params.realName = this.data.realName

    const data = await auth(params)
    console.log('data',data)
    if(data.code === 200){
      Toast('提交成功')
      wx.navigateBack()
    }else{
      Toast(data.message)
    }
  },
  void(){
    //
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //TODO:编译调试使用，正式去掉
    await app.loginValidation()

    let temp = []
    if(app.globalData.userInfo.attachment){
      temp = app.globalData.userInfo.attachment.split(',').map(val => {
        return {
          url:val,
          type:'image',
        }
      })
    }
    this.setData({
      userInfo:app.globalData.userInfo,
      IDcard:app.globalData.userInfo.idCard,
      frontImgUrl:app.globalData.userInfo.idCardFront,
      backImgUrl:app.globalData.userInfo.idCardBack,
      phone:app.globalData.userInfo.phone,
      realName:app.globalData.userInfo.realName,
      enclosure:temp

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
