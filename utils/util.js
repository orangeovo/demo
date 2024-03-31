const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

// 将联系人整合成固定格式的json数据
const formatInitialsData = data => {
 
  const cardlist = []
  const inis = []
  data.map(item => {
    if (inis.indexOf(item.firstCode) < 0) {
      inis.push(item.firstCode)
    }
  })

  inis.sort()
  inis.map(item => {
    const cardlistitem = {}
    cardlistitem.initials = item
    cardlistitem.data = []
    cardlist.push(cardlistitem)
  })
  data.map(item => {
    item.firstName = item.name.substr(0, 1)
    cardlist[inis.indexOf(item.firstCode)].data.push(item)
  })
  let arr=[]  //临时存放#以免#进入循环
  let ifhas=false
  let numarr=[]  //记录要删除的下标
  cardlist.map((item,i)=>{
    var p = /[^a-z]/i; 
    console.log(item.initials)
    if(p.test(item.initials)){
      numarr.push(i)
      // cardlist.splice(i,1)
      if(!ifhas){
        arr.push(
          {initials:'#',data:item.data}
        )
        ifhas=true
      }else{
        arr[0].data=[...arr[0].data,...item.data]
      }
    }
})
let i= numarr.length
while(i--){
  cardlist.splice(numarr[i],1)
}
if(arr[0]){
  cardlist.push(arr[0])
}
console.log(cardlist)
  return cardlist
}

/**
 * 日期格式转变为 yyyy年MM月dd日
 * @param date 日期字符串 需要被new Date()识别
 */
const dateToDateFormat = (date) => {
  let temp = new Date(date)
  let Y = temp.getFullYear() + '年';
  let M = (temp.getMonth() + 1 < 10 ? '0' + (temp.getMonth() + 1) : temp.getMonth() + 1) + '月';
  let D = temp.getDate() + '日';
  return Y + M + D;
}
const diaplayTime = (dateTimeStamp) => {
  let newT = dateTimeStamp.replace(/-/g, '/'); //ios时间格式转换时，要求2019/07/04
  var result;
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime();
  var curTime = new Date(newT); //后端返回的是秒数
  var diffValue = now - curTime;
  //console.log('dateTimeStamp',dateTimeStamp);
  //console.log('diffValue',diffValue);
  if (diffValue < 0) {
    return;
  }
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  if (monthC >= 1) {
    if (monthC <= 12)
      result = "" + parseInt(monthC) + "月前";
    else {
      result = "" + parseInt(monthC / 12) + "年前";
    }
  } else if (weekC >= 1) {
    result = "" + parseInt(weekC) + "周前";
  } else if (dayC >= 1) {
    result = "" + parseInt(dayC) + "天前";
  } else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时前";
  } else if (minC >= 1) {
    result = "" + parseInt(minC) + "分钟前";
  } else {
    result = "刚刚";
  }
  return result;
}
const zifulength = (value) => {
  if (!value) return '';
  if (value.length > 4) {
    return value.slice(0, 4) + '...'
  }
  return value
}
function debounce(fn, interval) {

    var timer;
  
    var gapTime = interval || 1000;//间隔时间，如果interval不传，则默认1000ms
  
    return function () {
  
      clearTimeout(timer);
  
      var context = this;
  
      var args = arguments;//保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
  
      timer = setTimeout(function () {
  
        fn.call(context, args);
  
      }, gapTime);
  
    };
  
  }
  
  function throttle(fn, interval) {

      var enterTime = 0;//触发的时间
    
      var gapTime = interval || 300;//间隔时间，如果interval不传，则默认300ms
    
      return function () {
    
        var context = this;
    
        var backTime = new Date();//第一次函数return即触发的时间
    
        if (backTime - enterTime > gapTime) {
    
          fn.call(context, arguments);
    
          enterTime = backTime;//赋值给第一次触发的时间，这样就保存了第二次触发的时间
    
        }
    
      };
    
    }

module.exports = {
  formatTime,
  formatInitialsData,
  dateToDateFormat,
  diaplayTime,
  zifulength,
  throttle,
  debounce
}