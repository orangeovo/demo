// component/adminCardPopup/index.js
import {
  delCard
} from '../../api/card'
import api from "../../request/api.js";
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    obj: {
      type: Object
    },
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
    onClose() {
      this.triggerEvent('onClose', {})
    },
    // 保存到通讯录
    save() {
      wx.addPhoneContact({
        firstName: this.properties.obj.name,
        mobilePhoneNumber: this.properties.obj.phone,
        email: this.properties.obj.email,
        organization: this.properties.obj.companyName,
        fail() {}
      })
    },
    //编辑名片
    edit() {
      this.triggerEvent('onEdit')
    },
    // 删除名片
    async del() {
      const data = await delCard(this.properties.obj.id)
      if (data.code == 200) {
        Toast('删除成功')
        this.triggerEvent('delSuccess', {})
      } else {
        Toast(data.message)
      }
    },
    // 收藏
    doCollect() {
      let data = {}
      data.cardid = this.properties.obj.id
      data.flag = this.properties.obj.isCollect == 1 ? false : true
      api.collectCard(data).then(res => {
        if (res.code == 200) {
          Toast(data.flag ? '已收藏' : '已取消')
          this.triggerEvent('delSuccess', {})
        } else {
          Toast(res.message)
        }
      })
    },
    doExchanged() {
      this.triggerEvent('doExchanged', {})
    },
  }
})
