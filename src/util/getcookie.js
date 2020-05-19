//获取cookie
export const getCookie = name => {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  arr = document.cookie.match(reg)

  if (arr) {
    return (arr[2]);
  } else {
    return null;
  }
}

export const formatDate = (date1,date2) => {
  var date3=date1.getTime()-date2.getTime(); 
  var days=Math.floor(date3/(24*3600*1000));
  //计算出小时数
  var leave1=date3%(24*3600*1000) ; //计算天数后剩余的毫秒数
  var hours=Math.floor(leave1/(3600*1000));
  //计算相差分钟数
  var leave2=leave1%(3600*1000); //计算小时数后剩余的毫秒数
  var minutes=Math.floor(leave2/(60*1000));
  //计算相差秒数
  var leave3=leave2%(60*1000) ; //计算分钟数后剩余的毫秒数
  var seconds=Math.round(leave3/1000);
  if(days>0){
    return days+"天"
  }else if(hours>0){
    return hours+"小时"
  }else if(minutes>0){
    return minutes+"分钟"
  }else{
    return seconds+1+"秒"
  }
}
export const add0 = (m)=>{return m<10?'0'+m:m }
export const isMobile= ()=> {
    let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
    return flag;
}
  