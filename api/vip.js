import { get,post, } from '../utils/http'

// 购买VIP套餐列表
export const vipTimes = () => {
    return get('/vip/get/vip/time')
}

/**
 * 获取订单列表
 * @param params  分页参数
 * @returns {Promise | Promise<unknown>}
 */
export const getOrders = (params) => {
    return get('/vip/get/vipOrders',params)
}


