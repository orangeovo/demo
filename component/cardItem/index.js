// component/cardItem/index.js
Component({
  /**
   * 组件的属性列表
   */
  options:{
    multipleSlots:true
  },
  properties: {
    item:{
      type:Object
    },
    height:{
      type:Number,
    },
    gid:Number,
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    toDetail(e){
      let id = e.currentTarget.dataset.id || e.currentTarget.dataset.item.cid
      wx.navigateTo({
        url: '/pages/exchanged/exchanged?cid=' + id+'&gid='+this.properties.gid
      })
    },
  }
})
