const requestFn = require('./request.js');



const api = {
  // 录入分组名片
  enteringgroup(gid,data) {
    return requestFn.Request({
      url: "/cardGrouping/entering/" + gid,
      data
    })
  },


  // 管理分组
  managegroup(data) {
    return requestFn.Request({
      url: "/groupings/updGroupings/" + data.id,
      data
    })
  },
  // 扫描名片
  scanCard(data) {
    return requestFn.Request({
      url: "/cardGrouping/ocr",
      data
    })
  },
  // 删除分组
  deletegroup(data) {
    return requestFn.Request({
      url: "/groupings/delGroupings/" + data,
      method: 'GET',
      data
    })
  },
  // 移出分组
  removegroup(data) {
    return requestFn.Request({
      url: "/groupings/removeGroupings/" + data,
      method: 'GET',
      data
    })
  },
  // 切换分组
  switchgroup(data) {
    return requestFn.Request({
      url: "/cardGrouping/save/" + data.gid + "/" + data.cardId,
      method: "GET",
      data
    })
  },
  // 交换名片加入分组
  changeandjoingroup(gid) {
    return requestFn.Request({
      url: `/cardGrouping/exchangeCard/${gid}`,
      method: "POST",

    })
  },

  // 登录
  login(data) {
    return requestFn.Request({
      url: "/user/login/wx",
      data
    })
  },
  // 获取默认名片
  getDefaultCard(data) {
    return requestFn.Request({
      url: "/card/my/Default",
      data
    })
  },

  // 设置默认名片
  setDefaultCard(data) {
    return requestFn.Request({
      url: "/card/my/setDefaultCard/" + data,
      method: "GET",
      data
    })
  },
  // 移出圈子
  deleteCardFormCircle(data) {
    return requestFn.Request({
      url: "/circle/remove/" + data.circleid + "/" + data.cid,
      method: "GET",
      data
    })
  },

  // 删除名片
  deleteMyCard(data) {
    return requestFn.Request({
      url: "/card/my/delete/" + data,
      method: "DELETE",

    })
  },
  // 创建圈子
  createCircle(data) {
    return requestFn.Request({
      url: "/circle/add",
      data
    })
  },
  // 谁在看他
  whohim(id, uid) {
    return requestFn.Request({
      url: "/card/my/whoLooksHim/" + uid + '/' + id,
      method: "GET",
    })
  },

  // 获取圈子详情
  getCircleDetail(data) {
    return requestFn.Request({
      url: "/circle/cardList/" + data,
      method: "GET",
      data: data
    })
  },
  // 二维码获取圈子详情
  getCircleDetailQR(data) {
    return requestFn.Request({
      url: "/circle/getQrCodeCircle/" + data,
      method: "GET",
    })
  },
  // 管理圈子
  getCircle(id) {
    return requestFn.Request({
      url: "/circle/getCircle/" + id,
      method: "GET",
    })
  },
  // 新增供需墙
  addsad(data) {
    return requestFn.Request({
      url: "/circleArticle/add",
      data
    })
  },
  // 修改供需墙
  editsad(data) {
    return requestFn.Request({
      url: "/circleArticle/upd",
      data
    })
  },

  //随便写点
  // 设置默认名片
  setDefaultCard(data) {
    return requestFn.Request({
      url: "/card/my/setDefaultCard/" + data,
      method: "GET",
      data
    })
  },
  // 移出圈子
  deleteCardFormCircle(data) {
    return requestFn.Request({
      url: "/circle/remove/" + data.circleid + "/" + data.cid,
      method: "GET",
      data
    })
  },
  // 退出圈子
  quitCircle(data) {
    return requestFn.Request({
      url: "/circle/delCircle/" + data,
      method: "GET",

    })
  },

  // 删除名片
  deleteMyCard(data) {
    return requestFn.Request({
      url: "/card/my/delete/" + data,
      method: "DELETE",

    })
  },
  // 创建圈子
  createCircle(data) {
    return requestFn.Request({
      url: "/circle/add",
      data
    })
  },
  // 谁在看他
  whohim(id, uid) {
    return requestFn.Request({
      url: "/card/my/whoLooksHim/" + uid + '/' + id,
      method: "GET",
    })
  },

  // 获取圈子详情
  getCircleDetail(data) {
    return requestFn.Request({
      url: "/circle/cardList/" + data,
      method: "GET",
      data: data
    })
  },



  // 登录
  login(data) {
    return requestFn.Request({
      url: "/user/login/wx",
      data
    })
  },
  // 获取默认名片
  getDefaultCard(data) {
    return requestFn.Request({
      url: "/card/my/Default",
      data
    })
  },

  // 设置默认名片
  setDefaultCard(data) {
    return requestFn.Request({
      url: "/card/my/setDefaultCard/" + data,
      method: "GET",
      data
    })
  },
  // 移出圈子
  deleteCardFormCircle(data) {
    return requestFn.Request({
      url: "/circle/remove/" + data.circleid + "/" + data.cid,
      method: "GET",
      data
    })
  },

  // 删除名片
  deleteMyCard(data) {
    return requestFn.Request({
      url: "/card/my/delete/" + data,
      method: "DELETE",

    })
  },
  // 创建圈子
  createCircle(data) {
    return requestFn.Request({
      url: "/circle/add",
      data
    })
  },
  // 谁在看他
  whohim(id, uid) {
    return requestFn.Request({
      url: "/card/my/whoLooksHim/" + uid + '/' + id,
      method: "GET",
    })
  },

  // 获取圈子详情
  getCircleDetail(data) {
    return requestFn.Request({
      url: "/circle/cardList/" + data,
      method: "GET",
      data: data
    })
  },
  // 修改圈子
  updateCircle(data, id) {
    return requestFn.Request({
      url: "/circle/updCircle/" + id,
      data
    })
  },

  // 获取圈子列表
  getCicleList(data) {
    return requestFn.Request({
      url: "/circle/circleList",
      method: "GET",
    })
  },
  // 获取我的所有名片
  getMyCards(data) {
    return requestFn.Request({
      url: "/card/my/showCards",
      data
    })
  },
  // 新增与编辑名片
  addAndUpdateCard(data) {
    return requestFn.Request({
      url: "/card/saveOrUpd",
      data
    })
  },
  // 收藏名片
  collectCard(data) {
    return requestFn.Request({
      url: "/card/cardCollect/"+data.cardid+'/'+data.flag,
      data
    })
  },


  // 获取验证码
  getCode(data) {
    return requestFn.Request({
      url: "/sms/send",
      method: "GET",
      data
    })
  },

  // 提交认证信息
  submitCertification(data) {
    return requestFn.Request({
      url: "/user/auth",
      data
    })
  },

  // 新增名片
  addCard(data) {
    return requestFn.Request({
      url: "/card/add",
      data
    })
  },

  // 名片夹名片列表
  getCardHolderList(data) {
    return requestFn.Request({
      url: "/userCard/list",
      method: 'GET',
      data
    })
  },

  // 供需墙列表
  sadwallList(data) {
    return requestFn.Request({
      url: "/circleArticle/articleList",
      method: "GET",
      data
    })
  },

  // 获取用户信息
  getUserInfo() {
    return requestFn.Request({
      url: "/user/info",
      method: "GET"
    })
  },

  // 根据id显示名片夹下名片详细信息
  getCardDetail(cardId,gid=null) {
    let url;
    if(gid){
      url = `/card/view/${cardId}/${gid}`
    }else{
      url = `/card/view/${cardId}`
    }
    return requestFn.Request({
      url: url,
      method: "GET"
    })
  },
  // 获取分类列表
  categoryList() {
    return requestFn.Request({
      url: "/circle/categoryList/",
      method: "GET"
    })
  },
  // 获取分组列表
  getGroupList() {
    return requestFn.Request({
      url: "/groupings/groupingsList",
      method: "GET"
    })
  },
  // 获取分组详情
  getGroupDetail(data) {
    return requestFn.Request({
      url: "/groupings/groupingsCardsList",
      method: "GET",
      data
    })
  },
  // 新建分组列表
  addGroup(data) {
    return requestFn.Request({
      url: "/groupings/add",
      data
    })
  },


  // 设置特别关注
  setAttention(id, flag) {
    return requestFn.Request({
      url: "/card/cardManage/isAttention/" + id + "/" + flag
    })
  },

  // 删除名片
  deleteCard(id) {
    return requestFn.Request({
      url: "/userCard/del/" + id,
      method: "POST",
    })
  },
  // 上传文件
  uploadtoserver(data) {
    return requestFn.Request({
      url: "/file/upload",
      data
    })
  },
  // 获取圈子名片详情
  getCircleCard(data) {
    return requestFn.Request({
      url: "/circle/circleCardDetails/"+data,
      method: "GET"
    })
  },

  // 设置备注和标签
  setNotes(data) {
    return requestFn.Request({
      url: "/card/cardManage/setRemarkAndTags",
      data
    })
  },

  // 谁在看他
  whoLooksHim(cid, uid) {
    return requestFn.Request({
      url: "/card/my/whoLooksHims/" + cid + "/" + uid,
      method: "GET"
    })
  },
  // 递交名片
  sendCard(data) {
    return requestFn.Request({
      url: "/cardApply/add/"+data.id+'?linkInfo='+data.linkinfo,
      method: "GET",
    })
  },
  // 递交名片供需墙
  sendCardsad(data) {
    return requestFn.Request({
      url: "/cardApply/add",
      data
    })
  },
  // 递交名片圈子
  sendCardandcircle(data) {
    return requestFn.Request({
      url: "/cardApply/add/"+data.circleid+'/'+data.cardid+'?linkInfo='+data.linkinfo,
      method: "GET",
    })
  },

  // 谁看他交换名片
  whoLooksHimExchange(receiveUid, receiveCardId) {
    return requestFn.Request({
      url: `/cardApply/addToSeeHim/${receiveUid}/${receiveCardId}`,
      method: "GET"
    })
  },

  // 谁在看我
  whoLooksMe(data) {
    return requestFn.Request({
      url: "/card/my/whoLooksMe",
      method: "GET",
      data
    })
  },
  // 确认加入圈子
  confirmJoin(data) {
    return requestFn.Request({
      url: "/circle/CircleJoin/" + data.circleid + '/' + data.cardid ,
      method: "GET",
    })
  },

  // 供需墙详情
  sadwalldetail(data) {
    return requestFn.Request({
      url: "/circleArticle/articleDetails/" + data.id,
      method: "GET",
    })
  },


  // 递出接收名片列表（type：0递出1接收）
  cardDeliverAndApply(type) {
    return requestFn.Request({
      url: "/cardApply/cardApplyList/" + type,
      method: "GET"
    })
  },

  // 谁看我交换名片
  whoLooksMeExchange(cardViewId, receiveUid, receiveCardId) {
    return requestFn.Request({
      url: `/cardApply/addLookAtMe/${cardViewId}/${receiveUid}/${receiveCardId}`,
      method: "GET"
    })
  },

  // 交换/驳回名片（type：5交换10驳回）
  cardExchangeOrReject(id, status) {
    return requestFn.Request({
      url: "/cardApply/updStatus/" + id + "/" + status,
      method: "GET"
    })
  },

  // 我的关注
  myConcern(data) {
    return requestFn.Request({
      url: "/card/my/concern",
      method: "POST",
      data
    })
  },
  // 获取当前用户设置
  settings() {
    return requestFn.Request({
      url: "/user/settings",
      method: "GET",
    })
  },
  // 勿扰
  isDND(data) {
    return requestFn.Request({
      url: "/user/isDND",
      method: "POST",
      data
    })
  },
  //是否自动交换
  isAutomaticExchange(data) {
    return requestFn.Request({
      url: "/user/isAutomaticExchange",
      method: "POST",
      data
    })
  },
  //收藏名片
  collectingCard(data) {
    return requestFn.Request({
      url: "/card/cardHolder/scanCard",
      method: "POST",
      data
    })
  },
  //查看名片所在分组
  cardInGroup(cardId) {
    return requestFn.Request({
      url: "/cardGrouping/getGroupings/" + cardId,
      method: "GET"
    })
  },
  //分组名片详情
  Groupcarddetail(data) {
    return requestFn.Request({
      url: "/cardGrouping/groupingCard/" + data.cardid+'/'+data.gid,
      method: "GET"
    })
  },
  //获取会员套餐列表
  getVipConfig() {
    return requestFn.Request({
      url: "/vip/get/vipConfig",
      method: "GET"
    })
  },
  //充值会员
  openVip(price,vipTimeId) {
    return requestFn.Request({
      url: "/vip/top/up/" + price + "/" + vipTimeId,
      method:"GET"
    })
  },
   //充值会员
   toPayVip(orderId) {
    return requestFn.Request({
      url: "/vip/topay/up/"+ orderId,
      method:"GET"
    })
  },
  //我的订单列表
  getOrderList() {
    return requestFn.Request({
      url: "/vip/get/vipOrders/",
      method:"GET",
    })
  },
  //获取会员介绍
  getVipDesc(data) {
    return requestFn.Request({
      url: "/vip/get/desc/",
      data
    })
  },
  //修改头像
  upAvatar(data) {
    return requestFn.Request({
      url: "/card/my/updateAvatar",
      data
    })
  },
  //获取手机号
  getPhoneNum(code) {
    return requestFn.Request({
      url: "/user/getPhone/" + code,
      method: "GET"
    })
  },
  //获取未制作名片页面默认封面
  getCardCover() {
    return requestFn.Request({
      url: "/user/card/cover",
      method: "GET"
    })
  },

    // 圈子置顶
    stick(data) {
      return requestFn.Request({
        url: '/circle/stick/' + data.circleId +'/' + data.type,
        method: "GET",
      })
    },

}

// 勿扰模式


module.exports = api;
