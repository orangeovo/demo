// pages/wall/wall.js
const app = getApp();
import api from "../../request/api.js"
import {
  articleList
} from '../../api/circle'
import {
  getcollectlist
} from '../../api/demo'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import {
  diaplayTime
} from '../../utils/util';
const pageSize = 10
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total1: '', //新增供方数量
    total2: '', //新增需方数量
    searchTxt: '',
    active: 0, // 0供 1需 2收藏
    supplyList: [], // 供给列表
    supplyPage: 1, // 供给页码
    supplyNoMore: false, // 供给noMore
    needList: [], // 需求列表
    needPage: 1, // 需求页码
    needNoMore: false, // 需求noMore
    id: null, // 圈子ID
    supplier: "",
    demander: "",
    collect:"",
    collectList: [], // 收藏列表
    collectPage: 1, // 收藏页码
    collectNoMore: false, // 收藏noMore
    tabIndex:1,
  },

  tabClicik(event){
    let active = event.currentTarget.dataset.index
    this.setData({
      tabIndex: active
    })
    switch (active) {
      case '1':
        getSupplyList()
        break;
    
      default:
        break;
    }
  },

  jumptodetail(event) {
    var id = event.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/gongxudetail/gongxudetail',
      success: function (res) {
        res.eventChannel.emit('detail', id)
      }
    })
  },
  onChange(event) {
    let active = event.detail.index
    // console.log(this.data.active);
    this.data.active = active

  },
  //获取供给墙列表
  async getSupplyList(f5 = false) {
    let {
      supplyList,
      supplyPage,
      searchTxt,
      supplyNoMore
    } = this.data
    // 不是刷新且为最后一页，返回
    if(supplyNoMore && !f5) return
    let params = {}
    params.circleId = this.data.id
    params.title = searchTxt
    if (f5) {
      params.page = 1
      params.size = supplyPage * pageSize
    } else {
      params.page = supplyPage
      params.size = pageSize
    }
    params.type = 1
    console.log(params)

    const data = await articleList(params)
    this.setData({
      total1: data.data.total,
      supplier: '求购' + `(${ data.data.total})`,
    })
    console.log('supplyList', data)
    if (data.code == 200) {
      data.data.records.forEach(el => {
        el.tagArr = el.tags != '' ? el.tags.split(',') : []
        el.createTime = diaplayTime(el.createTime)
        el.typeTxt='寻找'
      })
      if (params.page == 1) {
        supplyList = data.data.records
      } else {
        supplyList = [...supplyList, ...data.data.records]
      }
      //判断是否最后一页
      supplyNoMore = supplyList.length >= data.data.total
      this.setData({ supplyList, supplyNoMore })
    } else {
      Toast(data.message)
    }
  },

  // 获取收藏墙列表
async getcollect(f5 = false){
  let {
    collectList,
    collectPage,
    searchTxt,
    collectNoMore
  } = this.data
  // 不是刷新且为最后一页，返回
  if(collectNoMore && !f5) return
  let params = {}
  params.circleId = this.data.id
  params.title = searchTxt
  if (f5) {
    params.page = 1
    params.size = collectPage * pageSize
  } else {
    params.page = collectPage
    params.size = pageSize
  }
  // 求购值修改
  params.type = 1
  // mock请求
  console.log('收藏数据');
  const res = await getcollectlist(params)
  console.log(res);
  if(res.code==200){
        res.data.records.forEach(el => {
        el.tagArr = el.tags != '' ? el.tags.split(',') : []
        el.createTime = diaplayTime(el.createTime)
        el.typeTxt='收藏'
      })
      if (params.page == 1) {
        collectList = res.data.records
      } else {
        collectList = [...collectList, ...res.data.records]
      }
      collectNoMore = collectList.length >= res.data.records.length
      // console.log(collectList);
  }

  // console.log(data);
  // await wx.request({
  // url: 'http://127.0.0.1:8082/getcollectlist',
  // dataType:"json",
  //   success(res){
  //     console.log(res);
  //     console.log(res,'--------------------');
  //     res.data.forEach(el => {
  //       el.tagArr = el.tags != '' ? el.tags.split(',') : []
  //       el.createTime = diaplayTime(el.createTime)
  //       el.typeTxt='收藏'
  //     })
  //     if (params.page == 1) {
  //       collectList = res.data
  //     } else {
  //       collectList = [...collectList, ...res.data]
  //     }
  //     //判断是否最后一页
  //     collectNoMore = collectList.length >= res.data.length
  //     console.log(collectList);
  //     // this.setData({ collectList, collectNoMore })
  //   }
  // })
  setTimeout(() => {
    this.setData({
      total1: collectList.length,
      collect: '收藏' + `(${ collectList.length})`,
      // collectList, collectNoMore
      collectList, collectNoMore
    })
  }, 0);
  console.log(this.data.supplyList,'--------');
  console.log(collectList);
  // console.log(params)

  // this.setData({
  //   total1: data.data.total,
  //   collect: '收藏' + `(${ data.data.total})`,
  // })
  // console.log('collectList', data)
  // if (data.code == 200) {
  //   data.data.records.forEach(el => {
  //     el.tagArr = el.tags != '' ? el.tags.split(',') : []
  //     el.createTime = diaplayTime(el.createTime)
  //     el.typeTxt='喜欢'
  //   })
  //   if (params.page == 1) {
  //     collectList = data.data.records
  //   } else {
  //     collectList = [...collectList, ...data.data.records]
  //   }
  //   //判断是否最后一页
  //   collectNoMore = collectList.length >= data.data.total
  //   this.setData({ collectList, collectNoMore })
  // } else {
  //   Toast(data.message)
  // }
},
  //获取需求墙列表
  async getNeedList(f5 = false) {
    let {
      needList,
      needPage,
      searchTxt,
      needNoMore,
    } = this.data
    if(needNoMore && !f5) return
    let params = {}
    params.circleId = this.data.id
    params.title = searchTxt
    if (f5) {
      params.page = 1
      params.size = needPage * pageSize
    } else {
      params.page = needPage
      params.size = pageSize
    }
    params.type = 2

    const data = await articleList(params)
    this.setData({
      total2: data.data.total,
      demander: '求销' + `(${data.data.total})`,
    })
    console.log('needList', data)
    if (data.code == 200) {
      data.data.records.forEach(el => {
        el.tagArr = el.tags != '' ? el.tags.split(',') : []
        el.createTime = diaplayTime(el.createTime)
        el.typeTxt='推荐'
      })
      console.log(data.data.records);
      if (needPage == 1) {
        needList = data.data.records
      } else {
        needList = [...needList, ...data.data.records]
      }
      //判断是否最后一页
      needNoMore = needList.length >= data.data.total
      console.log(needList);
      this.setData({
        needList,
        needNoMore,
      })
    } else {
      Toast(data.message)
    }
  },
  //我要发布
  issue() {
    let {
      id,
      active,
    } = this.data
    let that = this
    wx.navigateTo({
      url: `/pages/gongxuissue/gongxuissue?id=${id}&type=${active+1}`,
      events: {
        f5: (params) => {
          that.getSupplyList(true)
          that.getNeedList(true)
          that.getcollect(true)
        }
      }
    })
  },
  clear(){
    this.data.searchTxt = ''
    this.search()
  },
  search() {
    this.data.needNoMore = false
    this.data.supplyNoMore = false
    this.data.needPage = 1
    this.data.supplyPage = 1
    this.data.collectPage = 1
    this.getSupplyList()
    this.getNeedList()
    this.getcollect()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let id = options.id
    this.data.id = id
    // 采用了页面方式跳转，需要setdata,否则页面上的id会是Null
    this.setData({
      id
    })
    await this.getSupplyList()
    await this.getNeedList()
    await this.getcollect()

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
    await this.getSupplyList(true)
    await this.getNeedList(true)
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
    await this.getSupplyList(true)
    await this.getNeedList(true)
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.active == 0) {
      // 供墙
      this.data.supplyPage++
      this.getSupplyList()
    } else if(this.data.active==1) {
      // 需墙
      this.data.needPage++
      this.getNeedList()
    }else{
      this.data.collectPage++
      this.getcollect()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
