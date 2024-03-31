import { get,post, } from '../utils/http'

export const view = (id) => {
  return get('/groupings/view/'+id)
}
/**
 * 获取分组二维码
 * @param id 名片ID
 * @param gid 分组ID
 * @param path 分享路径
 * @returns {Promise | Promise<unknown>}
 */
export const getGroupQrCode = (id,gid,path) => {
  return get(`/groupings/out/getQrCode/${id}/${gid}`,{
    path:path,
  })
}
