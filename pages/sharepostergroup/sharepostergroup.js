// pages/shareposter/shareposter.js
import { outView,getQrCode } from '../../api/card'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
const app=getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        view:null,
        userInfo:null,
        loading:true,
        qrCode:'',
        showPainter:false,
        template:{},
        tempPath:'',
        url:'pages/viewOtherCard/viewOtherCard'
    },
    onSave(){
        let that = this
        this.setData({
            showPainter:true,
            template:{
                width:"750rpx",
                height:"1300rpx",
                background:'#fff',
                views:[
                    // 头像
                    {
                        type: "image",
                        url: that.data.userInfo.avatar,
                        width:'100rpx',
                        height:'100rpx',
                        css:{
                            top: '30rpx',
                            left: '30rpx',
                        }
                    },
                    // 名字
                    {
                        type: "text",
                        text: that.data.view.name,
                        css: {
                            left: "130rpx",
                            top: '35rpx',
                            fontSize: "28rpx",
                        },
                    },
                    // 公司名称
                    {
                        type: "text",
                        text: that.data.view.companyName,
                        css: {
                            left: "130rpx",
                            top: '80rpx',
                            fontSize: "24rpx",
                            color: 'rgba(102, 102, 102, 1)',
                        },
                    },
                    // 公司介绍
                    {
                        type: "text",
                        text: that.data.view.companyDesc,
                        css: {
                            maxLines:3,
                            width: '600rpx',
                            left: "30rpx",
                            top: '130rpx',
                            fontSize: "24rpx",
                            color: 'rgba(102, 102, 102, 1)',
                            lineHeight:'40rpx'
                        },
                    },
                    {
                        type: "image",
                        url: that.data.qrCode,
                        css:{
                            top: '400rpx'
                        }
                    },
                ]
            }
        })
    },
    async getView(id){
        
        const data = await outView(id,)
        if(data.code == 200){
            this.data.view = data.data
        }else{
            Toast(data.message);
        }
    },
    onImgOK(e){
        wx.saveImageToPhotosAlbum({
            filePath: e.detail.path,
            success:(res)=>{
                console.log(res)
            },
            fail:(err)=>{
                console.log(err)
            }
        })
    },
    async getQrCode(id,path){
        const data = await getQrCode(id,path)
        if(data.code == 200){
            this.data.qrCode = data.data
        }else{
            Toast(data.message);
        }
    },

    async geturl(){
        let _this=this
        const  eventChannel = this.getOpenerEventChannel()
        eventChannel.on('url', function(res) {
            if(res!=''){
                _this.setData({
                    url:res,
                })}
           
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        
        await this.geturl()
        await this.getView(app.globalData.currentcardid)
        await this.getQrCode(app.globalData.currentcardid,this.data.url)
        // TODO:开发使用，正式删除
        await app.getUserInfo()
        this.setData({
            loading:false,
            view: this.data.view,
            qrCode: this.data.qrCode,
            userInfo: app.globalData.userInfo
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
