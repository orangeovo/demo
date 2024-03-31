module.exports = Behavior({
  Behaviors: [],
  methods: {
    // 谁在看他
    toWhoLookHim() {
      wx.navigateTo({
        url: `/pages/wholooksme/wholooksme?cid=${this.properties.view.id}&isMy=${this.properties.view.isMy}`
      })
    },
    //修改名片点击事件
    toUpdCard() {
      let that = this
      if(that.properties.view.type == 0){
        wx.navigateTo({
          url: '/pages/makecard/makecard?isEntering=1',
          success: function (res) {
            // 通过eventChannel向被打开页面传送数据
            res.eventChannel.emit('data', that.properties.view)
          }
        })
      }else{
        wx.navigateTo({
          url: '/pages/choosemode/choosemode',
          success: function (res) {
            // 通过eventChannel向被打开页面传送数据
            res.eventChannel.emit('data', that.properties.view)
          }
        })
      }

    },
    // 调用父级分享事件
    doShareCard() {
      this.triggerEvent('shareCard', {})
    },
    toback() {
      wx.navigateBack({
        delta: 1,
        fail(e){
          console.log(e)
          wx.switchTab({
            url: '/pages/cardholder/cardholder',
          })
        }
      })
    },
    // 打电话
    makePhone() {
      wx.makePhoneCall({
        phoneNumber: this.properties.view.phone
      })
    }
  }
})
