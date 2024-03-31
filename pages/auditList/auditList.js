// pages/auditList/auditList.js
import {
  circleExamineList,
  examine
} from '../../api/circle'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [], //审核列表
    circleId: '', //圈子id,
    passShow: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async getList() {
    try {
      const data = await circleExamineList(this.data.circleId)
      if (data.code != 200) {
        return wx.showToast({
          title: '获取失败',
          icon:'error'
        })
      } else {
        this.setData({
          list: data.data
        })
        console.log(this.data.list);
      }
      console.log(data);
    } catch (error) {

    }
  },
  // 同意
  async pass(e) {
    if (this.data.passShow == 0) {
      this.setData({
        passShow: 1
      })
      console.log('锁住');
      try {
        let eid = e.currentTarget.dataset.eid
        let status = '5'
        const data = await examine(eid, status)
        if (data.code == 200) {
          wx.showToast({
            title: '成功入圈',
            icon: 'success',
            duration: 2000,
          })
          this.getList()
          setTimeout(() => {
            this.setData({
              passShow: 0
            })
          }, 1000);
        }

      } catch (error) {
        console.log(error);
      }
    }


  },
  //拒绝
  async refuse(e) {
    try {
      let eid = e.currentTarget.dataset.eid
      let status = '10'
      const data = await examine(eid, status)
      this.getList()
    } catch (error) {
      console.log(error);
    }
  },
  onLoad: function (options) {
    console.log('圈子id', options);
    this.data.circleId = options.id
    // this.setData({
    //   circleId: options.id
    // })
    this.getList()
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