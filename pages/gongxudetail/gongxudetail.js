// pages/gongxudetail/gongxudetail.js
const App = getApp();
import api from "../../request/api.js"
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import {
    sharePath,
} from '../../utils/config'
import {
    diaplayTime
  } from '../../utils/util';
import {
    exchangeCard
} from '../../api/circle'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: null, // 文章id
        circleId: null, // 圈子id
        detail: '',
        exchangedshow: false,
        cardid: '', //文章发布者id
        status: "", //对接状态
        isShow: false,
        linkInfo: "", //对接原因
        cardIdisShow: true, //是否是自己的文章控制对接的显示
        applyNum: "", //对接人数
        type: '', //供需
        showPainter: false,
        show: false,
        shareimg: '',
        obj: null, //整个对象，用于传参
        gongxuObj: {},
        contentImgs: [],
        gxTxt:"", // 详情类型文字
        tags:[],
        viewNum:'', // 阅读人数
        timeTip:'',
        OffShelfFlag:false,
    },
    preview(e){
        let currentUrl = e.currentTarget.dataset.clickimg
        wx.previewImage({
            current:currentUrl,
            urls: this.data.contentImgs,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        if(options.id){
            // 正常进入
            this.setData({
                type: options.type,
                id: options.id,
                gxTxt:options.text
            })
            this.data.circleId = options.cid
        }else{
            // 扫码进入
            const scene = decodeURIComponent(options.scene)
            let id = scene.split('&')[0].split('=')[1]
            this.setData({
                id: id
            })
        }
    },
    getcarid() {

    },
    //获取供需详情
    async getsadwalldetail() {
        let data = {}
        data.id = this.data.id
        api.sadwalldetail(data).then(res => {
            if (res.data.isAll == 0) {
                res.data.companyName = res.data.companyName
            }
            console.log(res.data);
            let obj = res.data
            // this.data.tags = res.data.tags.split(',')
            this.setData({
                detail: res.data,
                cardid: res.data.cardId,
                status: res.data.status,
                applyNum: res.data.applyNum,
                isMyself: res.data.isMyself,
                circleId:res.data.circleId,
                obj,
                tags:res.data.tags.split(','),
                gongxuObj: obj,
                viewNum:res.data.viewNum,
                timeTip:diaplayTime(res.data.createTime),
                contentImgs: res.data.contentImgs ? res.data.contentImgs.split(',') : []
            })
            // console.log(this.data.tags);
            this.drawShareImage()

        })
    },
    // 加密字段
    encrypt(str, type = 1) {
        if (type == 1) {
            //首尾两个字段,如果小于等于四个字段，则显示首两个字段
            if (str.length > 4) {
                let start = str.slice(0, 2)
                let end = str.slice(-2)
                return start + '***' + end
            } else {
                return str.slice(0, 2) + '***'
            }
        } else {
            // 首四个字段
            return str.slice(0, 4) + '*************'
        }
    },
    //交换名片
    exchangecard() {
        this.setData({
            isShow: true,
            linkInfo:""
        })

    },
    submit() {
        // let that = this

        let params = {}
        params.circleId = this.data.circleId
        params.circleArticleId = this.data.id
        if(!this.data.linkInfo){
            params.linkInfo ="供需对接"
        }else{
            params.linkInfo = this.data.linkInfo
        }
        console.log(params);
        let that = this
        wx.requestSubscribeMessage({
            tmplIds: ['h8qmDxqKP23fHzXENat9WFyjguya6tqJdKJg6znFfIg'],
            complete() {
                api.sendCardsad(params).then(data => {
                    console.log('data', data)
                    that.setData({
                        linkInfo:''
                    })
                    if (data.code == 200) {
                        Toast('发送成功，等待对方验证')
                        that.getsadwalldetail()
                    } else if (data.code == 205) {
                        Toast('交换成功')
                    }
                })

            }
        })


    },
    onClose() {
        this.setData({
            isShow: false,
            linkInfo:''
        });
    },
    onCloseShare() {
        this.setData({
            show: false,
        });
    },
    // 跳转名片详情
    todetail(e) {
        console.log(e);
        let cid = this.data.cardid
        wx.navigateTo({
            url: '/pages/exchanged/exchanged?cid=' + cid
        })
    },
    toNavigation(event) {
        App.auth(() => {
            wx.navigateTo({
                url: event.currentTarget.dataset.url
            })
        })
    },
    // 朋友圈分享
    pyqfx(){
        // console.log(wx.onShareTimeline());
//       wx.onShareTimeline(() => {
//     return {
//       title: '转发标题',
//       imageUrl: '', // 图片 URL
//       query: 'a=1&b=2'
//     }
//   })

    },
    // 分享供需
    doShareCard() {
        this.setData({
            show: true
        })
    },
    //绘制分享缩略图
    drawShareImage() {
        let type = (this.data.type == 1 ? '供方' : '需方')
        let that = this
        this.setData({
            showPainter: true,
            template: {
                width: "400rpx",
                height: "300rpx",
                background: '#f03b17',
                views: [{
                        type: "image",
                        url: '/images/gongxucard.png',
                        css: {
                            left: '0rpx',
                            top: '0rpx',
                            width: '400rpx',
                            zidnex: '1'
                        }
                    },

                    //标题
                    {
                        type: "text",
                        text: "供需墙分享",
                        css: {
                            left: "130rpx",
                            top: '33rpx',
                            fontSize: "14rpx",
                            fontWeight: 'bold',
                            color: '#E6E4E4',

                        },
                    },
                    //标题
                    {
                        type: "text",
                        text: '【' + type + '】',
                        css: {
                            left: "215rpx",
                            top: '33rpx',
                            fontSize: "14rpx",
                            fontWeight: 'bold',
                            color: '#36F3FD',

                        },
                    },


                    // 用途
                    {
                        type: "text",
                        text: that.data.obj.content,
                        css: {
                            left: '65rpx',
                            top: '155rpx',
                            fontSize: "22rpx",
                            color: '#fff',
                            maxLines: '3',
                        }
                    },
                    {
                        type: 'image',
                        url: '/images/rect.png',
                        css: {
                            left: '65rpx',
                            top: '255rpx',
                            width: '270rpx',
                            height: '35rpx',
                            zidnex: '10'
                        }
                    },
                    {
                        type: "text",
                        text: '立即查看详情',
                        css: {
                            left: '55rpx',
                            top: '260rpx',
                            width: '288rpx',
                            height: '45rpx',
                            color: '#ffffff',
                            textAlign: 'center',
                            fontSize: '20rpx'
                        }
                    },

                ]
            }
        })
    },
    // 分享海报页
    toPoster() {
        wx.navigateTo({
            url: '/pages/sharesgongxu/sharesgongxu?type=' + this.data.type + '&id=' + this.data.id,
        })
        this.setData({
            show: false
        })
    },
    onImgOK(e) {
        this.setData({
            shareimg: e.detail.path
        })
        console.log(e.detail.path)
    },
    onImgErr(e) {
        console.log(e)
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
        this.getsadwalldetail()

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
        // id=184&cid=209&type=1
        return {
            title: this.data.gongxuObj.name + "邀请你查看",
            path: `/pages/gongxudetail/gongxudetail?id=${this.data.id}&share=1&cid=${this.data.circleId}&type=${this.data.type}`,
            imageUrl: this.data.shareimg,
            success(res) {}
        }
    },

    onShareTimeline: function () {
        return {
            title: this.data.gongxuObj.name + "邀请你查看",
            path: `/pages/gongxudetail/gongxudetail?id=${this.data.id}&share=1&cid=${this.data.circleId}&type=${this.data.type}`,
            imageUrl: this.data.shareimg,
            success(res) {}
        }
      },

})
