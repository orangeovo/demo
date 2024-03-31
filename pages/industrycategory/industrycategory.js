import api from "../../request/api.js"
const App=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
        category:[
          {fathername:'农林畜牧业',ifchose:0,son:[
            {sonname:'农业',ifchose:0,grandson:['林木育种和育苗a','造林和更新','森林改培','林木育种和育苗a','造林和更新','森林改培']},
            {sonname:'林业',ifchose:0,grandson:['林木育种和育苗b','造林和更新','森林改培']}
          ]},
          {fathername:'采矿业',ifchose:0,son:[
            {sonname:'农业',ifchose:0,grandson:['林木育种和育苗c','造林和更新','森林改培']},
            {sonname:'林业',ifchose:0,grandson:['林木育种和育苗d','造林和更新','森林改培']}
          ]},{fathername:'制造业',ifchose:0,son:[
            {sonname:'农业',ifchose:0,grandson:['林木育种和育苗e','造林和更新','森林改培']},
            {sonname:'林业',ifchose:0,grandson:['林木育种和育苗f','造林和更新','森林改培']}
          ]}
        ],
          
        chose:'',
        currentfather:'',
        currentson:'',
        selectflag:true,
        selectedtag:[],
        grandsonbox:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
         
    this.setData({
     statusbarheight:App.globalData.statusHeight
    })
    this.getCategory()
    
 },

  //获取分类列表
  getCategory(){
    api.categoryList().then(res=>{
      console.log(res)
      this.setData({
        category:res.data
      })
    })
  },

 //点击第一级导航
 clickfather(event){
    
    this.data.currentfather = event.currentTarget.dataset.index 
    let category=this.data.category
    
    if(category[collecteState].ifchose==0){
      category.forEach(element => {element.ifchose=0});category[collecteState].ifchose=1;}
    else if(category[collecteState].ifchose==1){category[collecteState].ifchose=2}
    else if(category[collecteState].ifchose==2){
      category.forEach(element => {element.ifchose=0});category[collecteState].ifchose=1}
    this.setData({
      category:category,
      chose:collecteState
    })
    this.data.sonflag=!this.data.sonflag
 },
 clickson(event){
  
  var collecteState = event.currentTarget.dataset.index 
  let category=this.data.category
  if(category[this.data.chose].son[collecteState].ifchose==0){
    category.forEach(element => element.son.forEach(s=>s.ifchose=0 ));
    category[this.data.chose].son[collecteState].ifchose=1;this.data.grandsonbox=category[this.data.chose].son[collecteState].grandson
  }
  else if(category[this.data.chose].son[collecteState].ifchose==1){category[this.data.chose].son[collecteState].ifchose=2;this.data.grandsonbox=[]}
  else if(category[this.data.chose].son[collecteState].ifchose==2){category[this.data.chose].son[collecteState].ifchose=1;this.data.grandsonbox=category[this.data.chose].son[collecteState].grandson}
  
  this.setData({
    category:category,
    grandsonbox:this.data.grandsonbox
  })
  this.data.sonflag=!this.data.sonflag
  },
  clickgrandson(event){
    var name = event.currentTarget.dataset.grand 
    this.data.selectedtag.forEach(element => {
        if(element==name){this.data.selectflag=false}
    });
    if(this.data.selectflag){
      this.data.selectedtag.push(name)
    }
    this.data.selectflag=true
    this.setData({
      selectedtag:this.data.selectedtag
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