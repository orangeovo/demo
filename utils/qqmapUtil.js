
// 地址转经纬度
export const getGeocoder = (address,qqmapsdk,successFun) => {
  qqmapsdk.geocoder({
    address:address,
    success(res){
      successFun(res)
    }
  })
}
