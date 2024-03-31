import {
    get,
    post,
} from '../utils/http'

export const info = () => {
    return get('/user/info')
}
export const getsandr = () => {
    // return get('/user/SRNum')
    return get('/user/unread/sum')
}
export const upduseravatar = (data) => {
    return post('/user/upd/avatar',data)
}

export const auth = data => {
    return post('/user/auth', data)
}

// 获取默认名片
export const getDefaultCard = () => {
    return post('/card/my/Default')
}

// 谁在看他
export const whohim = (id, uid) => {
    return get("/card/my/whoLooksHim", {
        id,
        uid
    })
}

// 谁在看我
export const whoLooksMe = (params) => {
    return get("/user/visitor/list", params)
}

// 递交名片
export const cardApply = (cardId, params) => {
    return get("/cardApply/add/" + cardId, params)
}

// 名片夹列表
export const userCard = (searchText = '') => {
    return get("/userCard/list", {
        conditions: searchText
    })
}

// 名片夹列表
export const getVipDesc = () => {
    return get("/vip/desc")
}

// 递出名片列表
export const cardApplyListSend = (params) => {
    return get("/cardApply/list/send", params)
}
// 递出名片总数
export const getCardApplyTotalNum = (params) => {
  return get("/system/applyNumLimit", params)
}

// 收到名片列表
export const cardApplyListReceive = (params) => {
    return get("/cardApply/list/receive", params)
}
// 收到名片总数
export const getCardVisitTotalNum = (params) => {
  return get("/system/visitNumLimit", params)
}

// 统计数据
export const countInfo = () => {
    return get("/user/count/info")
}
export const getsharebg = (id) => {
    return get("/user/poster/cover/" + id)
}

//获取未制作名片页面默认封面
export const getUserCover = () => {
    return get("/user/front/cover")
}