// pages/gongxuissue/gongxuissue.js
const App = getApp();
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import api from "../../request/api.js"
import {delcircleA} from "../../api/circle.js"
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
//裁剪图片所需参数
import {
    baseUrl
} from "../../utils/config"
import WeCropper from '../we-cropper/we-cropper.js'
const device = wx.getSystemInfoSync() // 获取设备信息
const width = device.screenWidth // 示例为一个与屏幕等宽的正方形裁剪框
const devicePixelRatio = device.pixelRatio
const height = device.screenHeight - 40
const fs = width / 750 * 2

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: null, //供需墙id
        type: null, // 供需类型
        src: '',
        show: false,
        dialogshow: false,
        labelname: '',
        labelarray: [],
        temporary: [],
        cover: "", //封面图
        themeImg: "", //题图
        content1: '',
        content2: '',
        content3: '',
        wordnum: 0,
        content: '',
        circleId: "", // 圈子id
        title: '',
        tags: "",

        //裁剪蒙版参数
        iscropper: false,
        imgSrc: '', //确定裁剪后的图片
        cropperOpt: {
            id: 'cropper',
            width: width, // 画布宽度
            height: height, // 画布高度
            scale: 2.5, // 最大缩放倍数
            zoom: 8, // 缩放系数
            cut: {
                x: 0, // 裁剪框x轴起点
                y: (height * 0.5 - 370 * 0.5), // 裁剪框y轴期起点
                width, // 裁剪框宽度
                height: width // 裁剪框高度
            }
        },
        setShow: true
    },
    delarticle(){
        Dialog.confirm({
            message: '确认删除该文章？',
          })
          .then(() => {
            delcircleA({id:this.data.id}).then(res=>{
                if(res.code==200){
                    wx.navigateBack({
                      delta: 2,
                    })
                }
            })
          
          })
          .catch(() => {
            // on cancel
          });
    },
    //裁剪相关事件
    touchStart(e) {
        this.cropper.touchStart(e)
    },
    touchMove(e) {
        this.cropper.touchMove(e)
    },
    touchEnd(e) {
        this.cropper.touchEnd(e)
    },
    uploadTap() {
        const self = this
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success(res) {
                const src = res.tempFilePaths[0];
                self.wecropper.pushOrign(src);
            }
        })
    },
    closeTap() {
        this.setData({
            iscropper: false
        })
    },
    getCropperImage() {
        this.getCropperImageAAA(res => {
            console.log(res);
            if (this.data.num == 1) {
                this.setData({
                    cover: res,

                })
                console.log(this.data.cover);
            } else if (this.data.num == 2) {
                this.setData({
                    themeImg: res,
                })
            } else if (this.data.num == 3) {
                this.setData({
                    content1: res,
                })
            } else if (this.data.num == 4) {
                this.setData({
                    content2: res,
                })
            } else {
                this.setData({
                    content3: res,
                })
            }
        })
    },
    getCropperImageAAA(succ = () => {}) {
        let that = this;
        wx.showToast({
            title: '上传中',
            icon: 'loading',
            duration: 20000
        })
        // 如果有需要两层画布处理模糊，实际画的是放大的那个画布
        this.wecropper.getCropperImage((src) => {
            if (src) {
                wx.hideToast()
                // wx.previewImage({
                //   current: '', // 当前显示图片的http链接
                //   urls: [src] // 需要预览的图片http链接列表
                // })
                that.setData({
                    imgSrc: src,
                    iscropper: false
                })
                wx.uploadFile({
                    filePath: src,
                    name: 'file',
                    url: baseUrl + '/file/upload',
                    success(res) {
                        var data = JSON.parse(res.data);

                        let cover = data.data
                        succ(cover)
                        // that.setData({
                        //     cover,
                        //     show: true
                        // })
                    },
                    fail(res) {
                        console.log(res)
                    }
                })
            } else {
                console.log('获取图片地址失败，请稍后重试')
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.id = options.id
        this.setData({
            type: options.type
        })
        console.log(this.data.type);
        this.getsadwalldetail()
        //裁剪图片的准备
        const {
            cropperOpt
        } = this.data

        this.cropper = new WeCropper(cropperOpt)
            .on('ready', (ctx) => {
                console.log(`wecropper is ready for work!`)
            })
            .on('beforeImageLoad', (ctx) => {
                wx.showToast({
                    title: '上传中',
                    icon: 'loading',
                    duration: 20000
                })
            })
            .on('imageLoad', (ctx) => {
                wx.hideToast()
            })
        //刷新画面
        this.wecropper.updateCanvas()
    },
    //获取供需详情
    getsadwalldetail() {
        let data = {}
        data.id = this.data.id
        console.log(data);
        api.sadwalldetail(data).then(res => {
            if (res.data.isAll == 0) {
                res.data.companyName = this.encrypt(res.data.companyName)
            }
            console.log('供需详情', res);
            if (res.data.contentImgs) {
                let arr = res.data.contentImgs.split(',')
                this.setData({
                    content1: arr[0],
                    content2: arr[1],
                    content3: arr[2]
                })
            }
            this.setData({
                title: res.data.title,
                circleId: res.data.circleId,
                content: res.data.content,
                cover: res.data.cover,
                labelarray: res.data.tags ? res.data.tags.split(',') : [],
                themeImg: res.data.themeImg,
                id: res.data.id
            })


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
    getlabelipt(event) {
        this.setData({
            labelname: event.detail.value
        })

    },
    confirmcreatelabel(event) {
        this.setData({
            labelarray: this.data.labelarray.concat(this.data.labelname),
            labelname: ''
        })

    },
    cleanup() {
        this.setData({
            labelname: ''
        })
    },
    deletelabel(event) {
        this.setData({
            temporary: this.data.labelarray.splice(event.currentTarget.dataset.index, 1),
            labelarray: this.data.labelarray
        })
    },
    createlabel() {
        this.setData({
            dialogshow: true
        })

    },

    //计算文字数
    countnum() {
        this.setData({
            wordnum: this.data.content.length
        })
    },


    //上传图片相关事件
    uploadcover(e) {
        console.log(e);
        const num = e.currentTarget.dataset.num
        this.setData({
            num
        })
        var that = this
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success(res) {
                that.setData({
                    iscropper: true
                })
                const src = res.tempFilePaths[0];
                console.log(src);
                that.wecropper.pushOrign(src);
            }
        })
    },
    // 删除图片
    detecover(e) {
        console.log(e.currentTarget.dataset.num);
        let num = e.currentTarget.dataset.num
        if (num == 3) {
            this.setData({
                content1: ''
            })
        } else if (num == 4) {
            this.setData({
                content2: ''
            })
        } else {
            this.setData({
                content3: ''
            })
        }
    },
    //立即发布供需
    addsad() {
        if (this.data.setShow) {
            this.setData({
                setShow: false
            })
            wx.showToast({
                title: '发布中...',
                mask: true,
                icon: 'loading'
            })
            let data = {}
            data.circleId = this.data.circleId
            data.id = this.data.id
            data.content = this.data.content
            data.cover = this.data.cover
            data.themeImg = this.data.themeImg

            data.title = this.data.title
            data.type = parseInt(this.data.type)
            data.tags = this.data.labelarray.join(',')
            let arr = []
            if (this.data.content1) {
                arr.push(this.data.content1)
            }
            if (this.data.content2) {
                arr.push(this.data.content2)
            }
            if (this.data.content3) {
                arr.push(this.data.content3)
            }
            data.contentImgs = arr.toString()
            console.log('提交的', data);
            if (!data.content) {
                Toast('内容不能为空')
            } else if (!data.title) {
                Toast('标题不能为空')
            } else {
                api.editsad(data).then(res => {
                    const eventChannel = this.getOpenerEventChannel();
                    if (res.code == 200) {
                        wx.showToast({
                            title: '修改成功',
                            mask: true,
                            icon: 'success'
                        })
                        wx.navigateBack({
                            complete: () => {
                                eventChannel.emit('f5', true)
                            }
                        })
                    } else {
                        Toast(res.message)
                    }

                })
            }
            setTimeout(() => {
                this.setData({
                    setShow: true
                })
            }, 1500)
        };
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