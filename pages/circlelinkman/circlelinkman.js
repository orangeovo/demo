// pages/linkman/linkman.js
import {
  formatInitialsData
} from "../../utils/util.js"
import {
  userCard
} from '../../api/user'
import {
  pullIn
} from '../../api/circle'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '', //搜索
    searchText: "",
    list: [],
    result: [],
    id: '', //圈子id
    cardList: [],
    // firstCodeList: [] //字母数组

    pitch: [] //选中
  },
  onChange(event) {
    console.log('选中', event.detail);
    this.setData({
      result: event.detail,
    });
    this.xuanZhong()
  },

  // toggle(event) {
  //   const {
  //     index
  //   } = event.currentTarget.dataset;
  //   const checkbox = this.selectComponent(`.checkboxes-${index}`);
  //   checkbox.toggle();
  // },

  async getCardList() {
    const data = await userCard(this.data.searchText)
    if (data.code == 200) {

      data.data = data.data.filter(el=>{ return el.type != 0 })

      let arr = []
      console.log(data.data)
      formatInitialsData(data.data).forEach(el => {
        el.data.forEach(data => {
          arr.push(data)
        })
      })
      this.setData({
        cardList: formatInitialsData(data.data),
     
      })

      console.log('名片列表', this.data.cardList);
    } else {
      Toast(data.message)
    }
    this.setData({
      result: this.data.result,
    });
  },
  // 搜索
  onSearch(event) {
    this.setData({
      searchText: event.detail
    })
    this.getCardList()
  },
  xuanZhong() {
    let pitch = []
    this.data.result.forEach(el => {
      this.data.list.forEach(li => {
        if (el == li.cardId) {
          pitch.push(li)
        }
      })
    })
    this.setData({
      pitch
    })

  },
  // 取消选中
  cancle(e) {
    this.data.result.forEach((el, index) => {
      if (el == e.currentTarget.dataset.cid) {
        this.data.result.splice(index, 1)
        this.setData({
          result: this.data.result
        })
      }
    })

    this.data.pitch.forEach((el, index) => {
      if (el.cardId == e.currentTarget.dataset.cid) {
        this.data.pitch.splice(index, 1)
        this.setData({
          pitch: this.data.pitch
        })
      }
    })

  },

  // 拉人入圈
  async holding() {
    console.log('最后选中', this.data.pitch);
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2]; //上一页 -1为当前页面
    prevPage.setData({
      valid: this.data.pitch, //valid  是要传给A页面使用
    })

    this.setData({
      pitch: []
    })
    setTimeout(() => {
      wx.navigateBack({
        delta: 1 //想要返回的层级
      })
    }, 1000)

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    let that=this
    // console.log(options);
    this.data.id = options.id
    await this.getCardList()

    const eventChannel = this.getOpenerEventChannel()
  
          eventChannel.on('valid', function (data) {
            if(data){
            console.log(data);
            let arr=[]
            data.map(res=>{
              arr.push(res.cardId.toString())
            })
           that.setData({
             pitch:data,
            result:arr
           })
          }
        })
        let arr = []
      this.data.cardList.map(el=>{
        el.data.forEach(data => {
          arr.push(data)
        })
      })
       this.setData({
         list:arr
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
