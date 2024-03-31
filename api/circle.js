import {
	get,
	post,
} from '../utils/http'

export const categoryTree = () => {
	return get('/circle/category/tree')
}

export const categoryList = () => {
	return get('/circle/category/list')
}

export const create = (data) => {
	return post('/circle/add', data)
}

export const view = (id) => {
	return get('/circle/cardList/' + id)
}

// 供需墙
export const articleList = (params = {}) => {
	return get('/circleArticle/articleList', params)
}
export const delcircleA= (params = {}) => {
	return post('/circleArticle/del/'+ params.id,params)
}

// 交换名片申请
export const exchangeCard = () => {
	return get('/cardApply/add/' + data)
}

// 圈子详情，不用登录
export const outView = (id) => {
	return get('/circle/out/view/' + id)
}
export const getCircle = (id) => {
	return get('/circle/getCircle/' + id)
}

// 拉人入圈
export const pullIn = (data) => {
	return post('/circle/pull/in', data)
}
// 入圈审核列表
export const circleExamineList = (circleId) => {
	return get('/circle/circleExamineList/' + circleId)
} // 入圈审核
export const examine = (eid, status) => {
	return get('/circle/examine/' + eid + '/' + status)
}
// 拉人入圈的列表
export const usercircleList = (id, data) => {
	return get('/circle/examine/userList/' + id, data)
}
export const circleQrCode = (id, path) => {
	return get('/circle/out/getQrCode/' + id,{
		path:path
	})

}

export const stick = (data) => {
	return post('/circle/stick/' + data.circleId +'/' + data.type,data)
}
