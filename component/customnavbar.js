// component/customnavbar.js
Component({
    /**
     * 组件的属性列表
     */
    options:{
        addGlobalClass:true
      },
    properties: {
        title:{type:String,value:""},
        statusheit:{type:Number,value:""},
        lefticon:{type:String,value:""},
        clickmethod:{type:String,value:''}
    },
    
    /**
     * 组件的初始数据
     */
    

    /**
     * 组件的方法列表
     */
    methods: {
        back(){
        wx.navigateBack({
          delta: 0,
        })
       },
        backtocreate(){
           wx.navigateTo({
            url: '/pages/createcircle/createcircle',
           })
       },
       backtomyCard(){
       wx.switchTab({
         url: '/pages/mycard/mycard',
       })
        
    },
       
    }
})
