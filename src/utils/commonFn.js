
Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt
};


export function currentTime() {
  let date = new Date();
  return date.Format('yyyy.MM.dd hh:mm:ss')
}


export const getQueryString = () => {
  let href = window.location.href;
  console.log('href------', href)
  let params = {};
  if (href.indexOf("?") > -1) {
    let tempArr = href.split("?")[1].split("&");
    for (let i = 0; i < tempArr.length; i++) {
      let arr = tempArr[i].split("=");
      params[arr[0]] = arr[1];
    }
  }
  console.log(params)
  return params;
};


// 是否已答题
export const isAnswered = (item) => {
  let value = item.propValues[4].value
  if (Array.isArray(value)) { // 多选
    if (value.length) {
      return true
    }

  } else if (value.trim() && (value != '请选择')) { // 单选
    return true
  }
  return false
}

