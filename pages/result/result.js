const api = require("../../request/api");

// pages/result/result.js
const app = getApp();

import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

import { outView } from '../../api/circle'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id:null,
        view:'', // 圈子信息
        name:'',// 部分已加入成员信命
        num:0,// 已加入人数
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        if(options.id){
            // 正常进入
            this.data.id = options.id
        }else{
            // 通过扫码进入
            const scene = decodeURIComponent(options.scene)
            let id = scene.split('&')[0].split('=')[1]
            this.data.id = id
        }

        const data = await outView(this.data.id)
        if(data.code == 200){
            let num = data.data.cardList.length
            let temp = data.data.cardList.map((el)=>{
                return el.name
            })
            let name = ''
            if(temp.length > 20000){
                name = `${temp[0]}、${temp[1]}等`
            }else{
                name = temp.join('、')
            }
            this.setData({
                view:data.data.circle,
                name,
                num:num
            })
        }else{
            Toast(data.message)
        }
     },
    //确认加入
    confirm(){
        app.auth(()=>{
            wx.navigateTo({
                url: '/pages/ifjoincircle/ifjoincircle?circleid='+this.data.id,
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
