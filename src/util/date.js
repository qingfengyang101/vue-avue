// date.js
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}

export function str2Date(dateStr, separator) {
  if (!separator) {
    separator = "-";
  }
  let dateArr = dateStr.split(separator);
  let year = parseInt(dateArr[0]);
  let month;
  //处理月份为04这样的情况
  if (dateArr[1].indexOf("0") == 0) {
    month = parseInt(dateArr[1].substring(1));
  } else {
    month = parseInt(dateArr[1]);
  }
  let day = parseInt(dateArr[2]);
  let date = new Date(year, month - 1, day);
  return date;
}


export function getDay(day){
  var today = new Date();                  
  var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;                   
  today.setTime(targetday_milliseconds); //注意，这行是关键代码
  var tYear = today.getFullYear();         
  var tMonth = today.getMonth();         
  var tDate = today.getDate();         
  tMonth = doHandleMonth(tMonth + 1);         
  tDate = doHandleMonth(tDate);  
  return tYear + '-' +tMonth+"-"+tDate;  
}
function doHandleMonth(month){
  var m = month;        
  if(month.toString().length == 1){            
      m = "0" + month;         
  } 
  return m;  
}

/**
 *  最近一周前 零点
 *  author:xyh
 *  date: 2020/10/6/ 14:29
 */

 export function getBeforeWeekTime () {
  let end = new Date();
  let start = new Date(new Date().toLocaleDateString());
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
  let timeBeforeWeek = start.getTime();
  return timeBeforeWeek;
 }

/**
 *  最近一个月前 零点
 *  author:xyh
 *  date: 2020/10/6/ 14:31
 */

export function getBeforeMonthTime () {
  let end = new Date();
  let start = new Date(new Date().toLocaleDateString());
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
  let timeBeforeMonth = start.getTime();
  return timeBeforeMonth;
 }

/**
 *  最近三个月前 零点
 *  author:xyh
 *  date: 2020/10/6/ 14:32
 */

export function getBeforeThhreeMonthTime () {
  let end = new Date();
  let start = new Date(new Date().toLocaleDateString());
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
  let timeBeforeThreeMonth = start.getTime();
  return timeBeforeThreeMonth;
 }
