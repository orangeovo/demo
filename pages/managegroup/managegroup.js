// pages/creategroup/creategroup.js
import api from "../../request/api.js"
import {
    mapKey,
    mapReferer,
} from "../../utils/config";
import {
    view
} from '../../api/group'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        groupname: '',
        grouppurpose: '',
        groupid: '',
        avatar: 'https://hangbang.obs.cn-east-3.myhuaweicloud.com/businessCard/groupDefault.png',
    },
    //上传图片相关事件
    upload() {
        let that = this
        app.upload((url) => {
            that.setData({
                avatar: url
            })
        })
    },
    //保存分组
    save() {
        let data = {}
        data.avatar = this.data.avatar
        data.name = this.data.groupname
        data.useText = this.data.grouppurpose
        if (this.data.groupid) {
            // 修改
            data.id = this.data.groupid
            api.managegroup(data).then(res => {
                if (res.code == 200) {
                    Toast('修改成功')
                    setTimeout(() => {
                        wx.navigateBack({
                            delta: 1
                        })
                    }, 600);
                }
            })
        } else {
            // 新增
            api.addGroup(data).then(res => {
                if (res.code == 200) {
                    Toast('创建成功')
                    setTimeout(() => {
                        wx.navigateBack({
                            delta: 1
                        })
                    }, 600)
                }
            })
        }


    },
    //删除分组
    async deletegroup() {
        let that = this
        Dialog.confirm({
                message: '确认删除？',
            })
            .then(async () => {
                // on confirm
                await api.deletegroup(that.data.groupid)
                setTimeout(() => {
                    wx.navigateBack({
                        delta: 2
                    })
                }, 600);
            })
            .catch(() => {
                // on cancel
            });
    },
    async getView(id) {
        const data = await view(id)
        console.log('data', data)
        if (data.code == 200) {
            this.setData({
                groupname: data.data.name,
                grouppurpose: data.data.useText,
                avatar: data.data.avatar
            })
        } else {
            Toast(data.message)
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.id) {
            // 编辑
            let id = options.id
            this.setData({
                groupid: id
            })
            this.getView(id)
        } else {
            wx.setNavigationBarTitle({
                title: '新建分组'
            })
        }
        console.log(this.data.groupid)
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    nothing() {},

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