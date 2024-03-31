// pages/createcircle/createcircle.js
import api from "../../request/api.js"
import {
    create
} from '../../api/circle'
import {areaList} from '../../utils/areaData';
let moment = require('../../utils/moment.js');
import {
    zifulength
} from '../../utils/util'
import {
    mapKey,
    mapReferer,
} from "../../utils/config";
import {
    categoryList
} from '../../api/circle'
const chooseLocation = requirePlugin('chooseLocation');
const app = getApp();
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import {
    getDefaultCard,
} from '../../api/user'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: null, // 圈子ID
        name: '', // 圈子名称
        purpose: '', // 圈子用途
        address: '', // 圈子地址
        companyLatitude: '', // 圈子纬度
        companyLongitude: '', // 圈子经度
        cateShow: false, // 选择分类show
        cateListData: [], // 序列化后的分类信息
        columns: [], // 多级分类列项
        selectCate: [], // 分类选择数组
        selectCateStr: '', // 分类选择
        selectCateIndex: [0, 0, 0, 0], // 分类选择index
        avatar: 'https://hangbang.obs.cn-east-3.myhuaweicloud.com/businessCard/avatar2.png',
        isCreate: 1, // 是否创建者
        nowdate: '', // 创建时间
        active: '',
        activeItemIndexOne: '',
        nameOne: "", //选择一级的名字
        activeItemIndexTwo: '',
        nameTwo: "", //选二级的名字
        activeItemIndexThree: '',
        nameThree: "", //选三级级的名字
        activeItemIndexFour: '',
        nameFour: "", //选四级的名字
        cateOneId: '',
        cateTwoId: "",
        cateThreeId: "",
        cateFourId: "",
        dialogshow: false,
        labelname: '',
        labelarray: [],
        label: null,
        isAuditshow: false,
        isAudit: '否',
        eventIs: '0',
        isExamine: '0', //是否同意审核
        ids: [],
        mypulldata: [],
        cardavatar: '',
        cardname: '',
        timeflag: false,
        datetime: '',
        columns: [{
            text: '否'
        }, {
            text: '是',
        }, ],
        creatShow: true,
        defaultcard:'',
        files: [],
            fileList: [], // 已上传的图片
			fileIds: [], // 佐证材料文件id，上传成功之后返回的数据
			uploadfile: {
				type: '',
				name: ''
      }, // 上传单图的情况
      photoPopup:false,
			uploadfiles: [{
        url: 'https://img.yzcdn.cn/vant/leaf.jpg',
        name: '图片1',
      },], // 上传多图的情况
      maxTextLen: 100,
      textLen: 0,
      CreateAddress:"",// 创建地区
      CreateAddressCode:"",// 创建地区编码
      areaList: {
        province_list: areaList.province_list, //省
        city_list: areaList.city_list,  //市
        county_list: areaList.county_list //区
        },
        showAddress:false,
        phoneImg:'', // 相册拍照图片
    },

    checkImg(e){
        console.log(e.target.dataset.url);
        this.setData({
            phoneImg:e.target.dataset.url
        })
        this.onClose()
    },
    // 相机
    getPhotograph(){
        var that = this;
        wx.chooseImage({
          sizeType: ['original', 'compressed'],
          sourceType: ['camera'],
          success: function(res) {
            console.log(res);
            that.setData({
         // tempFilePath可以作为img标签的src属性显示图片
            phoneImg: res.tempFilePaths[0],
            })
            that.onClose()
          }
        })
    },
    // 相册
    getAlbum(){
        var that = this;
        wx.chooseImage({
          sizeType: ['original', 'compressed'],
          sourceType: ['album'],
          success: function(res) {
            console.log(res);
            that.setData({
         // tempFilePath可以作为img标签的src属性显示图片
            phoneImg: res.tempFilePaths[0],
            })
            that.onClose()
          }
        })
    },
    confirm1(val){
        // console.log(val);
        console.log(val.detail.values);
        let arr = val.detail.values.map(item=>{
            return item.name
        })
        let code = val.detail.values.map(item=>{
            return item.code
        })
        this.setData({
            CreateAddress:arr.join(','),
            CreateAddressCode:code.join(','),
            showAddress:false,
        })
        // console.log(arr);
    },
    showPhotoPopup() {
      this.setData({ photoPopup: true });
    },
    onClose2(){
        console.log('----');
        this.setData({
            showAddress:false
        })
    },
    showCreateAddress(){
        this.setData({
            showAddress:true
        })
    },
    // 分类相关
    selectCate() {
        // 判断是否有管理权限
        if (!this.data.isCreate) {
            Toast('您不是创建者')
            return
        }
        let {
            columns
        } = this.data
        console.log('分类', columns);
        // this.doChange(0, true)
        this.setData({
            cateShow: true,
            columns,
            active: 0
        });
        this.level1()

    },
    // 循环出一级类目
    level1() {
        let cateOne = []
        this.data.cateListData.forEach(el => {
            if (el.level == 1) {
                cateOne.push(el)
            }

        })
        this.setData({
            cateOne: cateOne
        })

    },
    timepicker() {
        this.setData({
            timeflag: true
        })
    },
    onChangeCate(e) {
        console.log('点击分类内容', e);
        let cateObj = {}
        cateObj = e.currentTarget.dataset
        let level = cateObj.level
        if (level == 1) {
            let cateTwo = []
            this.data.cateListData.forEach(el => {
                if (el.level == 2 && cateObj.id == el.pid) {
                    cateTwo.push(el)
                }
            })
            if (this.data.nameTwo) {
                this.setData({
                    cateThree: [],
                    cateFour: [],
                    activeItemIndexTwo: '',
                    nameTwo: "", //选二级的名字
                    activeItemIndexThree: '',
                    nameThree: "", //选三级级的名字
                    activeItemIndexFour: '',
                    nameFour: "", //选四级的名字
                })
            }
            this.setData({
                activeItemIndexOne: cateObj.index,
                nameOne: zifulength(cateObj.name),
                cateTwo: cateTwo,
                cateOneId: cateObj.id,
                active: 1
            })

        } else if (level == 2) {

            let cateThree = []
            this.data.cateListData.forEach(el => {
                if (el.level == 3 && cateObj.id == el.pid) {
                    cateThree.push(el)
                }
            })
            if (this.data.nameThree) {
                this.setData({
                    cateFour: [],
                    activeItemIndexThree: '',
                    nameThree: "", //选三级级的名字
                    activeItemIndexFour: '',
                    nameFour: "", //选四级的名字
                })
            }
            this.setData({
                activeItemIndexTwo: cateObj.index,
                nameTwo: zifulength(cateObj.name),
                cateThree: cateThree,
                cateTwoId: cateObj.id,
                active: 2
            })
        } else if (level == 3) {

            let cateFour = []
            this.data.cateListData.forEach(el => {
                if (el.level == 4 && cateObj.id == el.pid) {
                    cateFour.push(el)
                }
            })
            if (this.data.nameFour) {
                this.setData({
                    activeItemIndexFour: '',
                    nameFour: "",
                })
            }
            this.setData({
                activeItemIndexThree: cateObj.index,
                nameThree: zifulength(cateObj.name),
                cateFour: cateFour,
                cateThreeId: cateObj.id,
                active: 3
            })
        } else {
            this.setData({
                activeItemIndexFour: cateObj.index,
                nameFour: zifulength(cateObj.name),
                nameFourselectCateStr: cateObj.name,
                cateFourId: cateObj.id
            })
        }
    },
    affirmBtn() {
        this.setData({
            cateShow: false,
            selectCateStr: this.data.nameFourselectCateStr,
        })
    },

    onClose() {
        this.setData({
            cateShow: false,
            timeflag: false,
            photoPopup: false,
            activeItemIndexOne: '',
            nameOne: "", //选择一级的名字
            activeItemIndexTwo: '',
            nameTwo: "", //选二级的名字
            activeItemIndexThree: '',
            nameThree: "", //选三级级的名字
            activeItemIndexFour: '',
            nameFour: "", //选四级的名字
            cateOneId: '',
            cateTwoId: "",
            cateThreeId: "",
            cateFourId: "",

        });
    },
    isAuditShow() {
        this.setData({
            isAuditshow: true,
        })
    },
    onInput(e) {
        let time = new Date(parseInt(e.detail));
        console.log("asdad"+time)

        let mm = time.getMonth()
        mm = parseInt(mm) + 1
        // if (mm < 10) {
        //     mm = "0" + mm
        // }
        let dd = time.getDate()
        // if (dd < 10) {
        //     dd = "0" + dd
        // }
        let hh = time.getHours()
        if (hh < 10) {
            hh = "0" + hh
        }
        let MM = time.getMinutes()
        if (MM < 10) {
            MM = "0" + MM
        }
        let ss = time.getSeconds()
        if (ss < 10) {
            ss = "0" + ss
        }
        console.log(mm)
        this.setData({
            nowdate: time.getFullYear() + '年' + mm + '月' + dd + '日 ' + hh + ':' + MM,
            datetime: time.getFullYear() + '-' + mm + '-' + dd + ' ' + hh + ':' + MM + ':' + ss
        })
        this.onClose()
    },
    onConCircle(event) {
        // this.data.eventIs = event.detail
        // console.log(event);\
        this.data.isExamine = event.detail.index
        if (event.detail.index == 0) {
            this.setData({
                isAudit: '否'
            })
        } else {
            this.setData({
                isAudit: '是'
            })
        }
        this.setData({
            isAuditshow: false
        })
    },
    // 取消
    onCancel() {
        this.setData({
            isAuditshow: false
        })
    },
    // confirmIs() {
    //     // console.log(this.data.eventIs);
    //     this.data.isExamine = this.data.eventIs
    //     console.log(this.data.isExamine);
    //     if (this.data.isExamine == 0) {
    //         this.setData({
    //             isAudit: '否'
    //         })
    //     } else {
    //         this.setData({
    //             isAudit: '是'
    //         })
    //     }

    // },
    // onChangeActive(event) {
    //     console.log(event);
    // },
    // 删除标签
    deleteLabel(e){
        // console.log(e.target.dataset.index);
        this.data.labelarray.splice(e.target.dataset.index,1)
        this.setData({
            labelarray:this.data.labelarray
        })
    },
    // 新增标签
    createlabel() {
        if(this.data.labelarray.length>5){
            Toast('最多添加6个标签!')
        }else{
            this.setData({
                dialogshow: true
            })
        }
        
    },
    // 删除标签
    deletelabel(event) {
        this.setData({
            labelarray: this.data.labelarray,
        })
    },
    getlabelipt(event) {
        this.setData({
            labelname: event.detail.value
        })

    },
    confirmcreatelabel() {
        setTimeout(() => {
            this.setData({
                labelarray: this.data.labelarray.concat(this.data.labelname),
                labelname: ''
            })
        }, 200);
       
    },
    beforeClose(action){
        console.log(123)
        new Promise((resolve) => {
            setTimeout(() => {
              if (action === 'confirm') {
                resolve(true);
              } else {
                // 拦截取消操作
                resolve(false);
              }
            }, 1000);
          })
    },
    onCloseTag(event){
        // console.log(event.currentTarget.dataset.index)
        let { labelarray } = this.data
        labelarray.splice(event.currentTarget.dataset.index,1)
        this.setData({labelarray})
    },
    onConfirm(event) {
        let {
            selectCate,
            selectCateStr,
            selectCateIndex
        } = this.data
        selectCate = event.detail.value
        selectCateIndex = event.detail.index
        for (let i = selectCate.length - 1; i >= 0; i--) {
            if (selectCate[i]) {
                selectCateStr = selectCate[i]
                this.setData({
                    selectCate,
                    selectCateStr,
                    selectCateIndex,
                    cateShow: false
                })
                return
            }
        }

    },

    //点击定位事件
    getLocation() {
        // 判断是否有管理权限
        if (!this.data.isCreate) {
            Toast('您不是创建者')
            return
        }
        let latitude = 0 // 经度
        let longitude = 0 // 纬度

        let that = this
        // console.log(that.data.latitude)
        // console.log(that.data.longitude)
        wx.getLocation({
            type: 'gcj02',
            success(res) {
                latitude = that.data.latitude ? that.data.latitude : res.latitude
                longitude = that.data.longitude ? that.data.longitude : res.longitude
                location = JSON.stringify({
                    latitude: latitude,
                    longitude: longitude
                })
                console.log(location)

                wx.navigateTo({
                    url: `plugin://chooseLocation/index?key=${mapKey}&referer=${mapReferer}&location=${location}&category=`
                });
            }
        })
    },
    //退出圈子
    delCircle() {
        let that = this
        Dialog.confirm({
                message: '确认退出？',
            })
            .then(() => {
                // on confirm
                let data = {}
                data = that.data.id
                api.quitCircle(data).then(res => {
                    if (res.code == 200) {
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

    //立即创建
    async createcircle() {
        if (this.data.creatShow) {
            this.setData({
                creatShow: false
            })
            wx.showToast({
                title: '创建中...',
                mask: true,
                icon: 'loading'
            })
            if (!this.data.isCreate) {
                Toast('您不是创建者')
                this.setData({
                    creatShow: true
                })
                return
            }
            if (this.data.id) {
                let info = this.data
                let data = {}
                data.address = info.address
                data.companyLatitude = info.companyLatitude
                data.companyLongitude = info.companyLongitude
                data.name = info.name
                data.purpose = info.purpose
                data.avatar = info.avatar
                data.isExamine = info.isExamine
                data.ids = info.ids
                
                data.label = info.labelarray.toString()
                // 分类信息
                data.category = info.selectCateStr
                data.createTime = this.data.datetime
                // console.log(data.circlecover);
                this.data.cateListData.forEach(el => {
                    if (el.name == info.selectCateStr) {
                        data.categoryId = el.id
                        return
                    }
                })
                let id = this.data.id
                console.log('修改提交的数据', data);
                api.updateCircle(data, id).then(res => {
                    if (res.code == 200) {
                        wx.showToast({
                            title: '修改成功',
                            mask: true,
                            icon: 'success'
                        })
                        setTimeout(() => {
                            wx.navigateBack()
                            this.setData({
                                creatShow: true
                            })
                        }, 600)
                    }

                })
            } else {
                // 创建
                let {
                    name,
                    purpose,
                    address,
                    companyLatitude,
                    companyLongitude,
                    selectCateStr,
                    cateListData,
                    createTime,
                    avatar,
                    isExamine,
                    ids,
                    phoneImg,
                } = this.data
                let categoryId
                cateListData.forEach(el => {
                    if (el.name == selectCateStr) {
                        categoryId = el.id
                        return
                    }
                })
                let params = {
                    name,
                    purpose,
                    address,
                    companyLatitude,
                    companyLongitude,
                    categoryId,
                    avatar,
                    isExamine,
                    ids,
                    circlecover: phoneImg || 'https://img.yzcdn.cn/vant/cat.jpeg'
                }
                params.createTime = this.data.datetime
                params.label = this.data.labelarray.toString()
                params.category = selectCateStr
                if (!params.avatar) {Toast('头像不能为空')
               }
                else if (!params.name) {Toast('圈子名称不能为空')
                this.setData({
                    creatShow: true
                })}
                // else if(!params.purpose) Toast('圈子用途不能为空')
                // else if(!params.category) Toast('行业分类不能为空')
                // else if(!params.address) Toast('地址不能为空')
                else {

                    const data = await create(params)
                    if (data.code == 200) {
                        wx.showToast({
                            title: '创建成功',
                            mask: true,
                            icon: 'success'
                        })
                        setTimeout(() => {
                            wx.navigateBack()
                            this.setData({
                                creatShow: true
                            })
                        }, 600)
                    } else {
                        wx.hideToast({
                          success: (res) => {},
                        })
                        this.setData({
                            creatShow: true
                        })
                        Toast(data.message)
                    }
                }
            }
            
        }
        this.setData({creatShow:true})

    },
    // 拉人创圈
    Intocircle() {
        let that=this
        wx.navigateTo({
            url: '/pages/circlelinkman/circlelinkman',
            success: function(res){
                res.eventChannel.emit('valid', that.data.valid )
            }
        })
        this.data.mypulldata = []
        this.data.ids = []
    },
    //上传图片相关事件
    uploadimg() {
        let that = this
        app.upload((url) => {
            that.setData({
                avatar: url
            })
        })
    },
    async getCateList() {
        const data = await categoryList()
        console.log('分类列表', data)
        if (data.code == 200) {
            this.setData({
                cateListData: data.data
            })
        } else {
            Toast(data.message)
        }
    },
    async getView() {
        api.getCircle(this.data.id).then(res => {
            // console.log(res.data)
            wx.setNavigationBarTitle({
                title: '管理圈子'
            })

            this.setData({
                avatar: res.data.avatar,
                name: res.data.name,
                purpose: res.data.purpose,
                categoryId: res.data.category,
                createTime: res.data.createTime,
                companyLatitude: res.data.companyLatitude,
                companyLongitude: res.data.companyLongitude,
                address: res.data.address,
                selectCateStr: res.data.category,
                datetime: res.data.createTime,
                nowdate: res.data.createTime,
                isCreate: res.data.isAdmin,
                isExamine: res.data.isExamine + '',
                examineNum: res.data.examineNum,
                labelarray: res.data.label ? res.data.label.split(',') : []
            })
            if (this.data.isExamine == 0) {
                this.setData({
                    isAudit: '否'
                })
            } else {
                this.setData({
                    isAudit: '是'
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:async function (options) {


        this.getCateList()
        if (options.id) {
            this.setData({
                id: options.id,
            })
        } else {
            this.setData({
                nowdate:moment().format("YYYY-MM-DD HH:mm:ss"),
                time:moment(),
            })
        }
        const res = await getDefaultCard()
       
        if (res.code != 200) {
            Toast(res.message)
            wx.navigateTo({
                url: '/pages/choosemode/choosemode',
            })
        }else{
            this.setData({
                cardavatar: res.data.avatar,
                cardname: res.data.name
            })
            
        }

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: async function () {
        if (this.data.id) {
            this.getView()
        }
        
        
        // 从地图选点插件返回后，在页面的onShow生命周期函数中能够调用插件接口，取得选点结果对象
        const location = chooseLocation.getLocation();
        if (location)
            this.setData({
                companyLongitude: location.longitude,
                companyLatitude: location.latitude,
                address: location.address + location.name
            })
        // 选人建圈下个页面传来的数据
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];
        console.log('下个页面', currPage.data.valid);
        if (currPage.data.valid) {
            console.log('数据', currPage.data.valid);
            currPage.data.valid.forEach(el => {
                this.data.ids.push(el.cardId)
                this.data.mypulldata.push(el)
            })
            this.setData({
                mypulldata: this.data.mypulldata
            })
            console.log(this.data.ids, this.data.mypulldata);

        }
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
