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
        circleid:'', //名片所在圈子id
        videoUrl:'',
        cid:null,// 名片ID
        flag:false, //是否收藏判断
        collectclass:0, //css样式判断条件
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
    doCollect(){
        let data={}
        data.cardid=this.data.id
        data.flag=!this.data.flag
        api.collectCard(data).then(res=>{
          if(res.code==200){
            if(this.data.flag){
              this.setData({
                collectclass:2
              })
              setTimeout(()=>{
                this.setData({
                  flag:data.flag
                })
              },300)
            }else{
              this.setData({
                collectclass:1
              })
              setTimeout(()=>{
                this.setData({
                  flag:data.flag
                })
              },300)
            }
            
          }
        })
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
          url: '../shareposter/shareposter?cardid='+this.data.id
        })
    },

    //交换名片
    exchangecard(){
        let data={}
        data.cardid = this.data.id
        data.circleid = this.data.circleid
        let that = this
        if(data.cardid){
            Dialog.confirm({
                title: '交换名片',
                message: '确定要与他交换名片吗?'
            })
            .then(async () => {
                api.sendCardandcircle(data).then(data=>{
                    if(data.code == 200){
                        Toast.success('发送成功，等待对方验证')
                    }else{
                        Toast(data.message)
                    }
                }).catch(err => {
                    if(err.code == 205){
                        that.getView(that.data.cid)
                        Toast.success('交换成功')
                    }
                })
            })
            .catch(() => {
              // on cancel
            });
        }else{
            wx.showToast({
              title: '尚未拥有名片',
              icon:'none'
            })
            setTimeout(() => {
                wx.navigateTo({
                  url: '/pages/choosemode/choosemode',
                })
              },600)
        }
    },
    getView(cid){
        api.getCircleCard(cid).then(res => {
            const {name,position,viewNum,companyDesc,imgUrl,id,uid,isAll,videoUrl,isCollect} = res.data
            let imgs = imgUrl.split(',')
            let phonenum=res.data.phone
            let email=res.data.email
            let address=res.data.companyAddress
            let {companyName} = res.data
            if(res.data.isAll==0){
                if(companyName.length <= 4){
                    companyName = companyName.replace(companyName.substr(2),'**')
                }else{
                    companyName = companyName.replace(companyName.substr(2,companyName.length - 4),'****')
                }
                this.data.phone=phonenum.substring(0,2)+"******"+phonenum.substring(phonenum.length-2)
                this.data.email=email.substring(0,2)+"******"+email.substring(email.length-2)
                this.data.companyAddress=address.substring(0,2)+"***************"+address.substring(address.length-2)
            }else{
                this.data.phone=res.data.phone
                this.data.email=res.data.email
                this.data.companyAddress=res.data.companyAddress
            }
            wx.setNavigationBarTitle({
              title: res.data.name+"的名片",
            })
            this.setData({videoUrl,isCollect,cid,name,position,companyName,viewNum,companyDesc,imgs,id,uid,isAll,phone:this.data.phone,email:this.data.email,companyAddress:this.data.companyAddress})
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.circleid = options.circleid
        console.log(options)
        this.getView(options.cid)
        
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
