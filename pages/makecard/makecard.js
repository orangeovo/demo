// pages/makecard/makecard.js
import api from "../../request/api.js"
import util from "../../utils/util.js"
const app = getApp();
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const chooseLocation = requirePlugin('chooseLocation');
import { cardOcr } from '../../api/card'
import { mapKey, mapReferer, BeiJingLatitude, BeiJingLongitude } from "../../utils/config";
import {
  getGeocoder
} from "../../utils/qqmapUtil";
import {
  entering,
  positionList
} from '../../api/card'
let QQMapWX = require('../../utils/qqmap-wx-jssdk.min')
let qqmapsdk;

//裁剪图片所需参数
import {
  baseUrl
} from "../../utils/config"
import WeCropper from '../we-cropper/we-cropper.js'

const device = wx.getSystemInfoSync() // 获取设备信息
const width = device.screenWidth // 示例为一个与屏幕等宽的正方形裁剪框
const height = device.screenHeight -40

Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    ifscan:false,
    positionshow: false,
    positionArray: ['请选择'],
    videoUrl: '', //视频url
    imgs: [], //图片url
    name: "",
    phone: "",
    email: "",
    position: "",
    company: "",
    address: "", // 地图定位地址
    addressDetail: "", // 详细地址，例如702
    introduction: "",
    longitude: 0,
    latitude: 0,
    show: false, // 选择上传内容show
    type: 1, //名片类型
    id: null, // 当前名片ID，如果有，则是修改
    gid: null, // 分组ID，如果有，新增的时候调用分组接口，修改不影响
    isEntering: 0, // 是否录入名片
    dialogShow: false, //弹框
    userInfo: {},
    code: "",
    //裁剪蒙版参数
    iscropper: false,
    imgSrc: '', //确定裁剪后的图片
    ifDo:false,
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
         height: width * 0.75 // 裁剪框高度
       }
     },
  },
// 扫描名片
doScanCard(){
  let that=this
  wx.chooseImage({
    count: 1, // 默认9
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success(res) {
      that.setData({
        show: false,
        iscropper: true,
        ifscan:true,
        videoUrl: ''
      })
      const src = res.tempFilePaths[0];
      that.wecropper.pushOrign(src);
    }
  })

},
  showDialog() {
    this.setData({
      dialogShow: true
    })
  },
  
  async showposition() {
    let res=await positionList()
    res.data.map(item=>{
      this.data.positionArray.push(item.name)
    })
    this.setData({
      positionArray:this.data.positionArray
    })
    this.setData({
      positionshow: true
    })
  },

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
    let that = this;
    wx.showToast({
      title: '上传中',
      icon: 'loading',
      duration: 20000
    })
    // 如果有需要两层画布处理模糊，实际画的是放大的那个画布
    this.wecropper.getCropperImage((src) => {
      console.log(src)
      if (src) {
        that.setData({
          imgSrc: src,
          iscropper: false
        })
        wx.uploadFile({
          filePath: src,
          name: 'file',
          url: baseUrl + '/file/upload',
          async success(res) {
            wx.hideToast()
            if (res.statusCode==413) {
              wx.showToast({
                title: '文件太大',
                icon: 'error'
              })
            }else{
              let data1 = JSON.parse(res.data);
              let imgs = that.data.imgs 
              imgs.push(data1.data)
              that.setData({
                imgs
              })
              if(that.data.ifscan){

                wx.showLoading({
                  title:'扫描中...'
                })
                const data =await cardOcr(data1.data)
                console.log('data',data)
                if(data.code == 200){
                  wx.hideLoading()
                  Toast('扫描成功')
                  that.setData({
                    videoUrl:"",
                    show:false,
                    name:data.data.name,
                    email:data.data.email.length == 0 ? '' :data.data.email.reduce((total,el) => {return total+el}),
                    position:data.data.title.length == 0 ? '' : data.data.title.reduce((total,el) => {return total+el}),
                    address:data.data.addr.length == 0 ? '' : data.data.addr.reduce((total,el) => {return total+el}),
                    phone:data.data.tel_cell.length == 0 ? '' : data.data.tel_cell.reduce((total,el) => {return total+el}),
                    company:data.data.company.length == 0 ? '' : data.data.company.reduce((total,el) => {return total+el})
                  })
                }else{
                  Toast(data.message)
                }
                wx.hideLoading()
                that.data.ifscan=false
              }
            }
          },
          fail(res) {
            wx.hideToast()
            Toast(`文件上传错误`)
          }
        })
      } else {
        console.log('获取图片地址失败，请稍后重试')
      }
    })
  },

  // 删除视频
  delVideo() {
    let that = this
    Dialog.confirm({
        message: '是否删除',
      })
      .then(() => {
        that.setData({
          videoUrl: ''
        })
      })

      .catch(() => {

      });

  },

  onChange(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    this.setData({
      position: index == 0 ? '' : value
    })

  },

  // 放大预览图片
  preImg(e) {
    let index = e.currentTarget.dataset.index
    wx.previewImage({
      urls: this.data.imgs,
      current: this.data.imgs[index]
    })
  },
  // 删除图片
  delImg(event) {
    let index = event.currentTarget.dataset.index
    let {
      imgs
    } = this.data
    let that = this
    Dialog.confirm({
        message: '是否删除',
      })
      .then(() => {
        imgs.splice(index, 1)
        that.setData({
          imgs
        })
      })
      .catch(() => {});
  },
  //上传视频
  uploadVideo() {
    this.setData({
      show: false
    })
    // 判断会员
    if (app.globalData.userInfo.vipId != 0) {
      let that = this
      wx.chooseVideo({
        maxDuration: 60,
        success(res) {
          console.log('res', res)
          if (res.size < 20971520 && res.duration < 60) {
            wx.showLoading({
              title: '视频上传中',
            })
            app.onlyUpload(res.tempFilePath, (url) => {
              wx.hideLoading({
                success: (res) => {},
              })
              that.setData({
                videoUrl: url,
                imgs: [],
                show: false
              })
            })
          } else if (res.duration < 60) {
            wx.showToast({
              title: '大小超过20MB',
              icon: 'error'
            })
          } else {
            wx.showToast({
              title: '时长超过1分钟',
              icon: 'error'
            })
          }
        }
      })
    } else {
      Dialog.confirm({
          message: '上传视频为会员专享，请先开通会员\n' +
            '再制作视频名片',
          confirmButtonText: '去开通'
        })
        .then(() => {
          wx.navigateTo({
            url: '/pages/vipcenter/vipcenter'
          })
        })
        .catch(() => {});
    }
  },
  //上传图片
  uploadImg() {
    let that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        that.setData({
          show: false,
          iscropper: true,
          videoUrl: ''
        })
        const src = res.tempFilePaths[0];
        that.wecropper.pushOrign(src);
      }
    })
  },
  //关闭选择图片弹窗
  onClose() {
    this.setData({
      show: false,
      positionshow: false
    });
  },
  //提交
  async savebtn(e){
    // clearTimeout(timer);
    // timer = setTimeout(() => {
    //   this.makeCard()
    // }, 1000);

     await this.makeCard()

  },
  async makeCard() {
    // 图片/视频验证，其余字段在后端验证
    // if (this.data.imgs == '' && this.data.videoUrl == '') {
    //   Toast('请上传图片或视频')
    //   return
    // }
    console.log(this.data);
    if (!this.data.name) {
      return Toast('请填写姓名')
    }
    if (!this.data.phone) {
      return Toast('请填写手机号')
    }
    if(!this.data.email){
      return Toast('请填写邮箱')
    }else{
     var reEml =  /^[\w\-\.]+@[a-z0-9]+(\-[a-z0-9]+)?(\.[a-z0-9]+(\-[a-z0-9]+)?)*\.[a-z]{2,4}$/i;
     if(!reEml.test(this.data.email)){
      return Toast('邮箱规范不正确，请重新填写！')
     }
    }

    let data = {}
    data.name = this.data.name
    data.phone = this.data.phone
    data.position = this.data.position
    data.email = this.data.email
    data.companyName = this.data.company
    data.companyDesc = this.data.introduction
    data.companyAddress = this.data.address
    data.companyAddressDetail = this.data.addressDetail
    data.companyLatitude = this.data.latitude
    data.companyLongitude = this.data.longitude
    data.videoUrl = this.data.videoUrl
    data.type = this.data.type

    if (this.data.imgs) {
      this.data.imgs.splice(0, 1)
      data.imgUrl = this.data.imgs.join(',')
    }

    let that = this

    let result;
    if (this.data.id) {

      if(this.data.isEntering == 0){
        // 修改名片
        data.id = this.data.id
        result = await api.addAndUpdateCard(data)
        if (result.code == 200) {
          Toast('修改成功')
          setTimeout(() => {
            wx.navigateBack({
              delta: 2
            })
          }, 1000)
        }
      }else{
        // 修改录入名片
        data.id = this.data.id
        result = await entering(data)
        if (result.code == 200) {
          Toast('修改成功')
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      }


    } else {

      if(!this.data.ifDo){
       this.data.ifDo=true
      if (this.data.gid) {
        // 录入分组名片
        data.id = this.data.id
        result = await api.enteringgroup(this.data.gid, data)
        if (result.code == 200) {
          Toast('录入成功')
          setTimeout(() => {
            wx.navigateBack()
          }, 1000)
        }else{
          this.setData({
            ifDo:false
          })
        }
      } else {

        if (this.data.isEntering == 1) {
          // 录入普通名片
          if (this.data.name && this.data.phone) {
            result = await entering(data)
            if (result.code == 200) {
              Toast('录入成功')
              setTimeout(() => {
                wx.navigateBack({
                  delta: 2
                })
              }, 1000)
            }else{
              this.setData({
                ifDo:false
              })
            }
          }
        } else {

          // 创建我的名片
          result = await api.addAndUpdateCard(data)
          if (result.code == 200) {
            Toast('创建成功')
            setTimeout(() => {
              wx.navigateBack({
                delta: 2
              })
            }, 1000)
          }else{
            this.setData({
              ifDo:false
            })
          }
        }
      }
    }
    }
  },

  //获取微信手机号
  getPhoneNumber(e) {
    console.log(e)
    const {
      code
    } = e.detail
    if (!code) {
      Toast('由于版本问题获取手机号失败，请手动输入')
      return
    }
    api.getPhoneNum(code).then(res => {
      console.log(res)
      if (res.data.errcode == 0) {
        this.setData({
          phone: res.data.phone_info.phoneNumber
        })
      } else {
        Toast(res.data.errmsg)
      }
    })
  },
  //点击定位事件
  getLocation() {
    let that = this
    // 获取当前位置成功，则显示当前位置的定位
    // 获取当前位置失败，则显示北京的定位
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        let latitude = that.data.latitude ? that.data.latitude : res.latitude
        let longitude = that.data.longitude ? that.data.longitude : res.longitude
        location = JSON.stringify({
          latitude: latitude,
          longitude: longitude
        })
        wx.navigateTo({
          url: `plugin://chooseLocation/index?key=${mapKey}&referer=${mapReferer}&location=${location}&category=`
        });
      },
      fail(e){
        let latitude = that.data.latitude ? that.data.latitude : BeiJingLatitude
        let longitude = that.data.longitude ? that.data.longitude : BeiJingLongitude
        location = JSON.stringify({
          latitude: latitude,
          longitude: longitude
        })
        wx.navigateTo({
          url: `plugin://chooseLocation/index?key=${mapKey}&referer=${mapReferer}&location=${location}&category=`
        });
      }
    })
  },
  //上传图片相关事件
  chooseFile: function () {
    this.setData({
      show: true
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: async function (options) {
    
    if (options.type) {
      this.data.type = options.type
    }
    if (options.gid) {
      this.data.gid = options.gid
    }
    if (options.isEntering) {
      this.setData({
        isEntering: options.isEntering
      })
      wx.setNavigationBarTitle({
        title: '录入名片',
      })
    }
   
    // 修改名片
    if (options.dataObj) {
      wx.setNavigationBarTitle({
        title: '修改名片'
      })
      let data = JSON.parse(options.dataObj);
      this.setData({
        id: data.id,
        videoUrl: data.videoUrl,
        imgs: data.imgs,
        name: data.name,
        phone: data.phone,
        email: data.email,
        position: data.position,
        company: data.companyName,
        address: data.companyAddress,
        addressDetail: data.companyAddressDetail,
        introduction: data.companyDesc,
        longitude: data.companyLongitude,
        latitude: data.companyLatitude,
        type: data.type,
      })
    }



    let that = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('data', function (data) {
      console.log('data', data)
      wx.setNavigationBarTitle({
        title: '修改名片'
      })
      that.setData({
        id: data.id,
        videoUrl: data.videoUrl,
        imgs: data.imgs,
        name: data.name,
        phone: data.phone,
        email: data.email,
        position: data.position,
        company: data.companyName,
        address: data.companyAddress,
        addressDetail: data.companyAddressDetail,
        introduction: data.companyDesc,
        longitude: data.companyLongitude,
        latitude: data.companyLatitude,
        type: data.type,
      })
    })

    // 扫描名片参数
    eventChannel.on('scan', function (params) {
      console.log('scan', params)
      const {
        data
      } = params
      qqmapsdk = new QQMapWX({
        key: mapKey
      });
      let addr = ''
      if (data.addr.length > 0) {
        data.addr.forEach(el => {
          addr += el
        })
        getGeocoder(addr, qqmapsdk, (res) => {
          console.log('res', res)
          let temp = res.result;
          that.data.latitude = temp.location.lat;
          that.data.longitude = temp.location.lng;
        })
      }
      that.data.imgs.push(data.imgs)
      that.setData({
        name: data.name,
        phone: data.tel_cell.length > 0 ? data.tel_cell[0] : '',
        email: data.email.length > 0 ? data.email[0] : '',
        position: data.title.length > 0 ? data.title[0] : '',
        company: data.company.length > 0 ? data.company[0] : '',
        imgs:that.data.imgs,
        address: addr,
      })
    })

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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    console.log(height)
    // 从地图选点插件返回后，在页面的onShow生命周期函数中能够调用插件接口，取得选点结果对象
    const location = chooseLocation.getLocation();
    if (location) {
      this.setData({
        longitude: location.longitude,
        latitude: location.latitude,
        address: location.address + location.name
      })
    }
    // 会跳转到开通会员页面，每次回到也要，都要重新获取下用户信息
    await app.getUserInfo()
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
    chooseLocation.setLocation(null);
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
