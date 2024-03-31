// pages/shareposter/shareposter.js
import {
    outView,
    getQrCode
} from '../../api/card'
import {
    getGroupQrCode
} from '../../api/group'
import {
    getsharebg
} from '../../api/user'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import {
    sharePath
} from '../../utils/config'
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        backgroundimg:'',
        id: null, // 名片id
        view: null,
        userInfo: null,
        loading: true,
        qrCode: '',
        showPainter: false,
        template: {},
        tempPath: '',
        url: sharePath,
        gid: null, // 组ID，分享组的时候使用
    },
    onSave() {
        Toast.loading({
            message: '海报生成中...',
            forbidClick: true,
        });
        let that = this
        this.setData({
            showPainter: true,
            template: {
                width: "750rpx",
                height: "1300rpx",
                background: '#fff',
                views: [
                    // 背景框
                    {
                        type: 'rect',
                        css: {
                            width: "690rpx",
                            height: "1240rpx",
                            left: '30rpx',
                            top: '30rpx',
                            color: "#f7fbfe",
                            borderWidth: '1rpx',
                            borderColor: '#eeeeee',
                            borderRadius: '10rpx',
                        }
                    },
                    // 背景图
                    // {
                    //     type: "image",
                    //     url: that.data.backgroundimg,
                    //     css: {
                    //         left: '30rpx',
                    //         width: '690rpx',
                    //         height: '1240rpx',
                    //     }
                    // },
                    // 头像
                    {
                        type: "image",
                        url: that.data.view.avatar || that.data.view.imgs[0],
                        css: {
                            // width: '140rpx',
                            // height: '140rpx',
                            // top: '420rpx',
                            // left: '530rpx',
                            // borderRadius: '70rpx',
                            width: '650rpx',
                            height: '605rpx',
                            position: 'absolute',
                            left: '50rpx',
                            top:'270rpx',
                            borderRadius: '65rpx',
                            zIndex: '-1',
                        }
                    },
                    // 名字
                    {
                        type: "text",
                        text: that.data.view.name,
                        css: {
                            left: "80rpx",
                            top: '750rpx',
                            fontSize: "36rpx",
                            fontWeight: 'bold',
                            color: 'white',
                        },
                    },
                    // 职位
                    {
                        type: "text",
                        text: that.data.view.position || '暂未填写',
                        css: {

                            left: "210rpx",
                            top: '760rpx',
                            fontSize: "25rpx",
                            color: 'white',
                            paddingTop:'15rpx',
                        },
                    },
                    // 公司名称
                    {
                        type: "text",
                        text: that.data.view.companyName || '暂未填写',
                        css: {
                            left: "80rpx",
                            top: '800rpx',
                            fontSize: "32rpx",
                            color: 'white',
                        },
                    },
                    // 公司介绍
                    // {
                    //     type: "text",
                    //     text: that.data.view.companyDesc || '暂未填写',
                    //     css: {
                    //         maxLines: 3,
                    //         width: '630rpx',
                    //         left: "70rpx",
                    //         top: '700rpx',
                    //         fontSize: "24rpx",
                    //         color: '#333333',
                    //         lineHeight: '48rpx',
                    //         maxLines:'7',

                    //     },
                    // },
                    // 电话
                    {
                        type:'text',
                        text:that.data.view.phone || '暂未填写',
                        css: {
                            
                            left: '115rpx',
                            top:'905rpx',
                            width: '690rpx',
                            height: '1240rpx',
                        }
                    },
                    // 二维码背景块
                    {
                        type:'text',
                        text:'长按扫码查看更多名片',
                        css:{
                            width: '650rpx',
                            height: '144rpx',
                            background:'white',
                            padding:'53rpx 40rpx',
                            // margin:'0 auto',
                            fontSize:'22rpx',
                            color:'#686868',
                            left: '90rpx',
                            top:'1010rpx',
                        }
                    },
                    {
                        type:'image',
                        url:'../../images/phoneicon.png',
                        css:{
                            left: '75rpx',
                            top:'900rpx',
                            width: '30rpx',
                            height: '30rpx',
                        }
                    },
                    // 二维码
                    {
                        type: "image",
                        url: that.data.qrCode,
                        css: {
                            left: '561rpx',
                            top: '975rpx',
                            width: '94rpx',
                            height: '94rpx',
                        }
                    },

                ]
            }
        })
    },
    async getView(id) {
        let res=await getsharebg(0)
        console.log(res.data)
        this.setData({
            backgroundimg:res.data
        })
        const data = await outView(id)
        console.log('data', data)
        if (data.code == 200) {
            this.data.view = data.data
            this.data.view.imgs = this.data.view.imgUrl.split(',')
        } else {
            Toast(data.message);
        }
    },
    onImgOK(e) {
        Toast.clear()
        console.log(e.detail.path)
        wx.saveImageToPhotosAlbum({
            filePath: e.detail.path,
            success: (res) => {
                Toast("保存成功")
            },
            fail: (err) => {
               
            }
        })
    },
    async getQrCode() {
        if (this.data.gid) {
            // 获取分享组二维码
            const data = await getGroupQrCode(this.data.id, this.data.gid, this.data.url)
            if (data.code == 200) {
                this.data.qrCode = data.data
            } else {
                Toast(data.message);
            }
        } else {
            // 获取普通名片二维码
            const data = await getQrCode(this.data.id, this.data.url)
            if (data.code == 200) {
                this.data.qrCode = data.data
            } else {
                Toast(data.message);
            }
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        console.log(options)
        await this.getView(options.cid)
        this.data.id = options.cid
        // 判断是否有组ID
        if (options.groupid) {
            this.data.gid = options.groupid
        }

        await this.getQrCode()
        this.setData({
            loading: false,
            view: this.data.view,
            qrCode: this.data.qrCode,
            userInfo: app.globalData.userInfo
        })



    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},

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
