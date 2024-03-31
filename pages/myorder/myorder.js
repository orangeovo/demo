// pages/myorder/myorder.js
import api from "../../request/api.js";
import {
  getOrders
} from '../../api/vip'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderlist: [],
    page: 1,
    noMore: false,
    tabs: ['全部', '已支付', '未支付'],
    tabIndex: 0
  },
  async getList() {
    let params = {}
    params.page = this.data.page
    const data = await getOrders(params)
    console.log('data', data)
    if (data.code == 200) {
      let list = []
      if (this.data.page == 1) {
        list = data.data.records
      } else {
        list = [...this.data.orderlist, ...data.data.records]
      }
      if (list.length >= data.data.total) {
        this.setData({
          orderlist: list,
          noMore: true
        })
      } else {
        this.setData({
          orderlist: list,
        })
      }
    }

  },
  // 处理点击tab
  async onTabClick(e) {
    let id = e.currentTarget.id;

    let params = {}
    params.page = this.data.page
    const data = await getOrders(params)
    console.log('data', data)
    if (data.code == 200) {
var newOrderList = data.data.records
    if (id == 1) {
      var successOrderList = newOrderList.filter(function (res) {
        return res.isPay === 1
      });
      this.setData({
        tabIndex: id,
        orderlist: successOrderList,
        noMore: true
      })
    } else if (id == 2) {
      var faildOrderList = newOrderList.filter(function (res) {
        return res.isPay === 0
      });
      this.setData({
        tabIndex: id,
        orderlist: faildOrderList,
        noMore: true
      })
    }else{
      this.setData({
        tabIndex: id,
        orderlist: newOrderList,
        noMore: true
      })
    }
    }
    

    // else if(id ==2){
    //   var newOrderList =this.data.orderlist
    //   var successOrderList = newOrderList.filter(function(res){
    //    return res.isPay===0
    //   });
    // }




  },
  confirmpay(e) {
    console.log(e)
    const orderData = e.currentTarget.dataset.value
    if (orderData.isPay == 0) {
      // let that=this;

      wx.requestSubscribeMessage({
        tmplIds: ['eX10b-gfpA9nt3hqHg2oafq6_OT7XvNhsQVC8VMl0zo'],
        complete() {
          // const {price,id} = that.data.order
          api.toPayVip(orderData.id).then(res => {
            console.log(res)
            const {
              nonceStr,
              paySign,
              timeStamp
            } = res.data

            wx.requestPayment({

              nonceStr,
              package: res.data.package,
              paySign,
              timeStamp: String(timeStamp),
              signType: 'RSA',
              success(res) {
                console.log(res)

                wx.navigateBack()
              },
              fail(res) {
                console.log(res)
                if (res.errMsg == 'requestPayment:fail cancel') {
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
    }


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
    // api.getOrderList().then(res => {
    //   console.log(res)
    //   this.setData({orderlist: res.data.records})
    // })
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
    if (this.data.noMore) {
      return
    }
    this.data.page++
    this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})