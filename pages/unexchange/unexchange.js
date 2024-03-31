// pages/exchanged/exchanged.js
import {sharePath} from "../../utils/config";
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const App=getApp();
import api from "../../request/api.js";

import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        ani1: '',
        ani2: '',
        ismask: false,
        id:null,
        name:'',
        position:'',
        companyName:'',
        viewNum:'',
        phone:'',
        email:'',
        companyAddress:'',
        companyDesc:'',
        imgs:[],
        swiperCurrent: 0,
        isAll:'',
    },
    swiperChange(e) {
        //防止轮播图抖动bug
        let {current, source} = e.detail
        if(source === 'autoplay' || source === 'touch') {
          this.setData({
            swiperCurrent: current
          })
        }
      },
    toseen(){
        //待做。。。
        wx.navigateTo({
          url: '/pages/wholooksme/wholooksme?uid=' + this.data.uid + '&cid=' + this.data.cid
        })
    },
    call(){
        let that = this
        wx.makePhoneCall({
            phoneNumber:that.data.phone
        })
    },
    setAttention(){
        // const databo = {}
        // databo.cardId = this.data.cid
        // databo.otherUid = this.data.uid
        // api.collectingCard(databo).then(res => {
        //     console.log(res)
        //     Toast(res.data)
        // })
        Toast('暂未开放')
    },
    share(){
        let ani1 = wx.createAnimation({
          duration: 500,
          timingFunction: 'ease'
        })
        ani1.width('100%').opacity(1).step()
        this.setData({
            ani1: ani1.export(),
            ismask: true
        })
    },
    
    closeshare(){
        let ani1 = wx.createAnimation({
          duration: 300,
          timingFunction: 'ease'
        })
        ani1.width(0).opacity(0).step()
        this.setData({
            ani1: ani1.export(),
            ismask: false
        })
    },
    //分享海报
    toshareposter(){
        wx.navigateTo({
          url: '../shareposter/shareposter'
        })
    },

    //交换名片
    exchangecard(){
        let that = this.data
        Dialog.confirm({
            title: '交换名片',
            message: '确定要与他交换名片吗?'
        })
        .then(async () => {
            api.sendCard(that.id).then(data=>{
                if(data.code == 200){
                    Toast.success('发送成功，等待对方验证')
                }else{
                    Toast(data.message)
                }
            }).catch(err => {
                if(err.code == 205){
                    Toast.success('交换成功')
                }
            })
        })
        .catch(() => {
          // on cancel
        });
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let cid = options.id
    
        console.log(options)
        api.getCircleCard(cid).then(res => {
           
            
            
            const {name,position,companyName,viewNum,companyDesc,imgUrl,id,uid,isAll} = res.data
            let imgs = imgUrl.split(',')
            let phonenum=res.data.phone
            let email=res.data.email
            let address=res.data.companyAddress
            this.data.phone=phonenum.substring(0,2)+"******"+phonenum.substring(phonenum.length-1)
            this.data.email=email.substring(0,2)+"******"+email.substring(email.length-1)
            this.data.companyAddress=address.substring(0,2)+"******"+address.substring(address.length-4)
            console.log(this.data.phone)
            this.setData({cid,name,position,companyName,viewNum,companyDesc,imgs,id,uid,isAll,phone:this.data.phone,email:this.data.email,companyAddress:this.data.companyAddress})
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
        return {
            title: this.data.companyName+'-'+this.data.name,
            path: sharePath+'?id='+this.data.id,
            success(res) {}
        }
    }
})
