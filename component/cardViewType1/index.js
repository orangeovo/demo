// component/cardViewType1/index.js
var cardbehavior=require('../cardviewBehavior')
Component({
  behaviors:[cardbehavior],
  /**
   * 组件的属性列表
   */
  properties: {
    view:{
      type:Object,
    },
    gid:Number,
    showShare:{
      type:Boolean,
      value:false
    },
    mask:{
      type:Boolean,
    }
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

  }
})
