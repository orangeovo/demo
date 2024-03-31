// pages/circleindex/circleindex.js
const App=getApp();
import api from "../../request/api.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        circleArray:[],
        firstCodeList:[],
        currentFirstcd:'',

    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

     },

    //点击某圈子取到它所在的首字母
    getfirstcd(event){
        let bindex=event.currentTarget.dataset.bigindex
        this.data.currentFirstcd=bindex

    },
     //点击某列圈子事件
    jumptodetail(event){
        let son=event.currentTarget.dataset.smallindex
        wx.navigateTo({
            url: `/pages/groupdetail/groupdetail?id=${son.id}`,
        })
    },
    //新建圈子
    jumptocreate(){
        wx.navigateTo({
        url: '/pages/managegroup/managegroup',
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

        //获取分组列表
        api.getGroupList().then(res=>{
            console.log(res)
        let temp =res.data.records.map(res=>{return res.firstCode})
        let temp2= new Set(temp)
        let temp3=Array.from(temp2).sort()
        this.data.circleArray = temp3.map(el =>{
            let data = {}
            data.firstcd=el
            data.son=[]
            res.data.records.map(res=>{
                if(el == res.firstCode){
                    data.son.push(res)
                }
            })
            return data
        })
        this.setData({
            firstCodeList:temp3,
            circleArray:this.data.circleArray
        })
        console.log(this.data.circleArray)

    })
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
