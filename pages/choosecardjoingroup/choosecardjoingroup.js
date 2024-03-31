// pages/ifjoincircle/ifjoincircle.js
import api from "../../request/api.js"
const App=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mycard:[],
        currentradio:'',
        currentcardid:'',
        groupid:'',
        flag:true,
        cardid:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            groupid:options.groupid,
            cardid:options.cardid
        })
        console.log("options.id:"+options.id)

        this.setData({
            statusbarheight:App.globalData.statusHeight
            })
        this.getMycard()
    },

    //获取当前选中名片
    getRadio(event){
        this.data.currentcardid=this.data.mycard[event.detail.value].id
       
    },

    //获取我的所有名片接口
    getMycard(){
        api.getMyCards().then(res=>{
            res.data.forEach(element => {
            let info={}
            info.name=element.name;
            info.position=element.position;
            info.companyName=element.companyName;
            info.avatar=element.avatar
            info.id=element.id
            this.data.mycard.push(info)

            this.setData({
                mycard:this.data.mycard,
            })
            if(this.data.mycard.length==0){
                this.setData({
                    flag:false
                })
            }else{
                this.setData({
                    flag:true
                })
            }
        });
        })
    },

    //确认加入
    async confirmjoin(){
        let data={}
        data.gid=this.data.groupid
        data.cardid=this.data.cardid
        data.ucardid=this.data.currentcardid
        api.changeandjoingroup(data).then(res=>{
            wx.switchTab({
                url: '/pages/cardholder/cardholder',
            })
        })
        
        
    },

    //创建名片
    jumptocreate(){
        wx.navigateTo({
          url: '/pages/makecard/makecard',
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