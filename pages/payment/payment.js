// pages/payment/payment.js
import api from "../../request/api.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {},
    payways: [
      {
        icon: '',
        name: '微信'
      }
    ],
    currentpayway: ''
  },
  radioChange(e) {
    console.log(e)
    this.setData({currentpayway: e.detail.value})
  },
  confirmpay(){
    let that=this;
console.log(that.data)
    wx.requestSubscribeMessage({
      tmplIds:['eX10b-gfpA9nt3hqHg2oafq6_OT7XvNhsQVC8VMl0zo'],
      complete(){
        const {price,id} = that.data.order
        api.openVip(price,id).then(res => {
          console.log(res)
          const {nonceStr,paySign,timeStamp} = res.data

          wx.requestPayment({

            nonceStr,
            package: res.data.package,
            paySign,
            timeStamp: String(timeStamp),
            signType: 'RSA',
            success(res){
              console.log(res)

              wx.navigateBack()
            },
            fail(res){
              console.log(res)
              if(res.errMsg == 'requestPayment:fail cancel'){
                wx.showToast({
                  title: '交易取消',
                  icon: 'error'
                })
              }
            }
          })
        })
      }
  })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', data => {
      console.log(data)
      this.setData({order: data.data})
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
