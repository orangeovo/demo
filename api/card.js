import { get,post, } from '../utils/http'

export const outView = (id,gid=null) => {
  if(gid){
    return get(`/card/out/view/${id}/${gid}`)
  }else{
    return get('/card/out/view/'+id)
  }

}

export const getCircleCard = (id) => {
  return get('/circle/circleCardDetails/'+id)
}

// 删除我的名片
export const delMyCard = (id) => {
  return get('/card/my/delete/'+id)
}
// 职位列表
export const positionList = () => {
  return get('/post/list')
}
// 修改我的名片头像
export const updavatar = (data) => {
  return post('/card/upd/avatar/'+data.id,data)
}

// 删除名片夹下的名片
export const delCard = (id) => {
  return post('/userCard/del/'+id)
}

// 获取名片完整信息（是否关注，分组信息,备注等）
export const viewAll = (id) => {
  return get('/card/view/all/'+id)
}


// 录入名片
export const entering = (data) => {
  return post('/card/entering',data)
}

// 扫描名片
export const cardOcr = (url) => {
  return post('/card/ocr',{url})
}
// 扫描名片
export const cardOcrg = (url) => {
  return post('/cardGrouping/ocr',{url})
}

// 获取名片二维码
export const getQrCode = (id,path) => {
  return get('/card/out/getQrCode/'+id,{
    path:path,
  })
}


