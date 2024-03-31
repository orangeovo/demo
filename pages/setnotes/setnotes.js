// pages/newgroup/newgroup.js
import api from "../../request/api.js";
import { viewAll } from '../../api/card'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    remarkName: '',
    describe: '',
    card:null,
    fileList:[], // 对应名片图片
    tags:[],// 标签的数组形式
    addTagShow:false,// 新增标签弹窗
    tagValue:'',
    remark:'', // 备注
    description:'',// 描述
  },
  onClose(){
    this.setData({
      addTagShow:false
    })
  },
  showAddTag(){
    this.setData({
      addTagShow:true
    })
  },

  onAddTag(){
    setTimeout(() => {
      let { tags } = this.data
      tags.push(this.data.tagValue)
      this.setData({
        tags,
        tagValue:'',
      })
  }, 200);
  },
  getlabelipt(event) {
    this.setData({
      tagValue: event.detail.value
    })

},
  closeTag(event){
    let index = event.currentTarget.dataset.index
    let { tags } = this.data
    tags.splice(index,1)
    this.setData({
      tags
    })
  },
  savechange(){
    const userCardSetBo ={}
    const { card,remark,description,tags,fileList, } = this.data
    userCardSetBo.description = description
    userCardSetBo.id = card.id
    userCardSetBo.remark = remark
    userCardSetBo.tags = tags.join(',')
    userCardSetBo.url = fileList.length == 1 ? fileList[0].url : ''
    api.setNotes(userCardSetBo).then(res => {
      console.log(res)
      wx.showToast({
        title: '设置成功'
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        })
      }, 600);
    })
  },
  uploadSuccess(event){
    const { file } = event.detail;

    let that = this
    app.onlyUpload(file.url,(url)=>{
      const { fileList } = that.data;
      fileList.push({ ...file, url: url });
      this.setData({ fileList });
      // console.log('file',that.data.fileList)
    })
  },
  delFile(event){
    let index = event.detail.index
    const { fileList } = this.data;
    fileList.splice(index,1)
    this.setData({ fileList });
  },
  async getView(id){
    const data = await viewAll(id)
    console.log('data',data)
    if(data.code == 200){
      let { fileList,tags,description,remark, } = this.data;
      if(data.data.url)
        fileList = [{ url:data.data.url,isImage: true, }]
      if(data.data.tags)
        tags = data.data.tags.split(',')
      description = data.data.description
      remark = data.data.remark
      this.setData({
        card:data.data.card,
        fileList,
        tags,
        description,
        remark
      })
    }else{
      Toast(data.message)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cid = options.cid
    this.getView(cid)
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
