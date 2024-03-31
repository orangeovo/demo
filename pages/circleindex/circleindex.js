// pages/circleindex/circleindex.js
const App=getApp();
import api from "../../request/api.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        login: false,
        indexBar:[], // 索引数组
        listData:[], // 圈子数字，
        newListData:[],
        init:false,
    },
    toLogin(){
        wx.navigateTo({
            url:'/pages/login/login'
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {},
    //点击某圈子取到它所在的首字母
    getfirstcd(event){
        let bindex=event.currentTarget.dataset.bigindex
        this.data.currentFirstcd=bindex

    },
    //新建圈子
    jumptocreate(){
        App.auth(()=>{
            wx.navigateTo({
                url: '/pages/createcircle/createcircle',
            })
        })
    },
    //获取列表
    getList:async function(){
        this.setData({
            init:false
        })
        if (App.getTokenAuth()) {
            let data = await api.getCicleList()
            let { indexBar,listData } = this.data
            listData = data.data.circleVos ? data.data.circleVos.records  : []
            console.log(listData)
let newListData = listData.filter(el => el.isTop==0)
console.log(newListData)

           
            indexBar = newListData.map(el=>{  
          
                    return el.firstCode 

                })
                console.log(indexBar)
            
            indexBar = Array.from(new Set(indexBar)).sort()
            console.log(indexBar)
            this.setData({
                indexBar,listData,newListData,
                login:true,
                init:true,
            })
        }else{
            this.setData({
                login: false,
                init:true,
            })
        }
    },
      // 关闭事件
	onOpen:async function (event) { 
console.log(event)
        let str = event.target.id.split('_')
        let parmse = {
            circleId:str[0],
            type:str[1]
        }
        let data = await api.stick(parmse)
        this.getList()
        // const { position, name } = event.detail;
        // switch (position) {
        //   case 'left':
        //     break;
        //   case 'right':
        //     console.log(`111`)
        //     break;
        // }
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
        
        this.getList()
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
