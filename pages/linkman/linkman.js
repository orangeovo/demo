// pages/linkman/linkman.js
import {
  formatInitialsData
} from "../../utils/util.js"
import {
  userCard
} from '../../api/user'
import {
  pullIn,
  usercircleList
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
    resultObj: [],
    id: '', //圈子id
    cardList: [], // 序列化后的名片列表
    // firstCodeList: [] //字母数组
    cardArray: [], // 未序列化后的名片列表
    pitch: [], //选中,
    loading: true,

  },
  onChange(event) {
    let item = event.target.dataset.item
    let id = item.id.toString()
    let {
      result,
      resultObj,
    } = this.data
    // 判断是选中还是取选
    if (result.indexOf(id) == -1) {
      // 选中
      
      // 判断是否存在相同用户
      let res = resultObj.filter(el => {
        return el.uid == item.uid
      })
      if (res.length != 0) {
        Toast(`${res[0].name}与${item.name}属于同一用户，请不要重复选择`)
        return
      }
      result = [...result, id]
      resultObj = [...resultObj, item]
    } else {
      // 取选
      let s= result.indexOf(id)
      result.splice(s, 1)
      resultObj.splice(s, 1)
    }
    
    this.setData({
      result,
      resultObj
    });
    
    this.xuanZhong()
    console.log('item',item)
      console.log('resultObj',this.data.resultObj)
  },

  // toggle(event) {
  //   const {
  //     index
  //   } = event.currentTarget.dataset;
  //   const checkbox = this.selectComponent(`.checkboxes-${index}`);
  //   checkbox.toggle();
  // },
  noop() {},
  async getCardList() {
    const data = await usercircleList(this.data.id, {
      conditions: this.data.searchText
    })
    // console.log('拉人列表', data);
    if (data.code == 200) {
      // 名片夹列表
      let userCards = [...data.data.userCardVos]
      // 已加入圈子/已申请列表名片uid列表
      let circleCardUids = [...data.data.examineUserCardVos].map(el => {
        return el.uid
      })
      // 已加入圈子/已申请列表名片id列表
      let circleCards = [...data.data.examineUserCardVos].map(el => {
        return el.id
      })
      // 名片夹列表过滤掉已加入圈子/已申请列（根据UID来过滤,已经加过的用户不能在加）
      // 如果是录入名片，显示
      userCards = userCards.filter(el => {
        // 手动录入名片,过滤在圈子名片列表中的
        // 非手动录入名片，过滤掉用户在圈子列表中的
        if (el.type == 0) return false
        else return circleCardUids.indexOf(el.uid) == -1
      })

      let arr = []
      formatInitialsData(userCards).forEach(el => {
        el.data.forEach(data => {
          arr.push(data)
        })
      })

      this.setData({
        cardList: formatInitialsData(userCards),
        cardArray: userCards,
      })

      console.log('名片字母', this.data.cardList);
      console.log('名片列表', this.data.list);
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
        if (el == li.id) {
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
    console.log(e);
    console.log(this.data.result);
    this.data.result.forEach((el, index) => {
      if (el == e.currentTarget.dataset.cid) {
        this.data.result.splice(index, 1)
        this.data.resultObj.splice(index, 1)
        this.setData({
          result: this.data.result
        })
      }
    })
    this.data.pitch.forEach((el, index) => {
      if (el.id == e.currentTarget.dataset.cid) {

        this.data.pitch.splice(index, 1)
        this.setData({
          pitch: this.data.pitch
        })
      }
    })

  },
  // 判断此字母下的名片是否全部入圈

  // 拉人入圈
  async holding() {
    if (this.data.loading) {
      this.setData({
        loading: false
      })
      let Obj = {}
      Obj.id = parseInt(this.data.id)
      Obj.ids = this.data.result.map(el => {
        return parseInt(el)
      })
      const res = await pullIn(Obj)
      if (res.code == 200) {
        if (this.data.isMy == 1) {
          wx.showToast({
            title: '成功入圈',
            icon: 'success',
            duration: 1000,
          })
        } else if (this.data.isMy == 0 && this.data.isAxamine == 1) {
          wx.showToast({
            title: '审核中...',
            icon: 'success',
            duration: 1000,
          })
        } else if (this.data.isMy == 0 && this.data.isAxamine == 0) {
          wx.showToast({
            title: '成功入圈',
            icon: 'success',
            duration: 1000,
          })
        }
        setTimeout(() => {
          wx.navigateBack({
            delta: 1,
          })
        }, 1000)
      } else {
        Toast(res.message)
      }

    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    console.log(options);
    this.data.id = options.id
    this.setData({
      isMy: options.isMy,
      isAxamine: options.isAxamine
    })
    // this.data.cardArray = options.cardArray.split()
    await this.getCardList()
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
