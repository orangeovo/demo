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
        currentcircleid:13,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
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
            
        });
        })
    },

    //确认加入
    confirmjoin(){
        let data={}
        data.gid=App.globalData.currentgid
        data.cardId=this.data.currentcardid
        api.switchgroup(data).then(res=>{
            wx.redirectTo({
                url: '/pages/cardholder/cardholder',
              })
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