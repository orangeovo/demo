// pages/ifjoincircle/ifjoincircle.js
import api from "../../request/api.js"
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list:[],
        circleId:'',
        currentID:null, // 当前选中名片ID
    },

    //获取当前选中名片
    getRadio(event){
        this.data.currentID = event.detail
    },
    //获取我的所有名片接口
    getMycard(){
        api.getMyCards().then(res=>{
            if(res.code == 200){
                this.setData({
                    list:res.data
                })
            }
        })
    },
    //确认加入
    confirmjoin(){
        if(!this.data.currentID){
            Toast('请选择名片')
            return
        }
        let data={}
        data.circleid=this.data.circleId
        data.cardid=this.data.currentID

        api.confirmJoin(data).then(res=>{
            if(res.code == 200){
                Toast('申请成功')
                wx.switchTab({
                    url:'/pages/circleindex/circleindex'
                })
            }else{
              Toast('您已加入圈子或者申请正在审核中，请耐心等待')
              wx.switchTab({
                url:'/pages/circleindex/circleindex'
            })
            }
        })
    },

    //创建名片
    jumptocreate(){
        wx.navigateTo({
          url: '/pages/choosemode/choosemode',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.circleId = options.circleid
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
        //TODO: 测试阶段
        await app.getUserInfo()
        this.getMycard()
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
