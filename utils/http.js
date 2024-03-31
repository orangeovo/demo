const { baseUrl } = require('./config')
import { tokenName } from '../utils/config'


function request(method,url,data){

  let header = {
    'content-type': 'application/json',
  }
  const token = wx.getStorageSync('tokenName')
  if(token){
    header.token = token
  }

  return new Promise(function(resolve,reject){
    wx.request({
      url: baseUrl + url,
      method: method,
      data: method === 'POST' ? JSON.stringify(data) : data,
      header:header,
      success(res){
        resolve(res.data);
      },
      fail(err){
        reject(err.data);
      }
    })
  })
}

function get(url,params = {}){
  let header = {
    'content-type': 'application/json',
  }
  const token = wx.getStorageSync(tokenName)
  if(token){
    header.token = token
  }
  url += '?'
  for(let key in params){
    url += key + '=' + params[key] + '&'
  }
  url = url.slice(0,url.length - 1)


  return new Promise(function(resolve,reject){
    wx.request({
      url: baseUrl + url,
      method: 'GET',
      header:header,
      success(res){
        if(res.data.code === 202){
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }else{
          resolve(res.data);
        }
      },
      fail(err){
        reject(err.data);
      }
    })
  })

}

function post(url,data = {},){
  let header = {
    'content-type': 'application/json',
  }
  const token = wx.getStorageSync(tokenName)
  if(token){
    header.token = token
  }


  return new Promise(function(resolve,reject){
    wx.request({
      url: baseUrl + url,
      method: 'POST',
      header:header,
      data: JSON.stringify(data),
      success(res){
        if(res.data.code === 202){
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }else if(res.data.code === 250){
          wx.showToast({
            title: res.data.message,
            icon:"none"
          })
          resolve(res.data);
        }else{
          resolve(res.data);
        }
      },
      fail(err){
        reject(err.data);
      }
    })
  })

}

function uploadFile(tempFilePaths){

  const token = wx.getStorageSync(tokenName)

  return new Promise(function(resolve,reject){
    wx.uploadFile({
      url: baseUrl + '/file/upload',
      filePath: tempFilePaths,
      name: 'file',
      formData: {
        'token': token
      },
      success (res){
        if (res.statusCode==413) {
          wx.showToast({
            title: '文件太大',
            icon:'error'
          })
        }else{resolve(JSON.parse(res.data));}

      },
      fail(res) {
        reject(JSON.parse(res.data));
      }
    })
  })


}


module.exports = {
  request,
  post,
  get,
  uploadFile
}

