const utils = {
  // 日期格式
  timeFormat (time, fmt) {
    var dateObj = new Date(time)
    if (fmt === undefined) { fmt = 'yyyy-MM-dd hh:mm:ss' }
    var o = {
      'M+': dateObj.getMonth() + 1,
      'd+': dateObj.getDate(),
      'h+': dateObj.getHours(),
      'm+': dateObj.getMinutes(),
      's+': dateObj.getSeconds(),
      'q+': Math.floor((dateObj.getMonth() + 3) / 3),
      'S': dateObj.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
    return fmt
  },
  copyObj (obj) {
    return JSON.parse(JSON.stringify(obj))
  },
  // 获取cookie、
  getCookie (name) {
    var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    var arr = document.cookie.match(reg)
    if (arr) {
      return (arr[2])
    } else {
      return null
    }
  },

  // 设置cookie,增加到vue实例方便全局调用
  setCookie (cName, value, expiredays) {
    var exdate = new Date()
    console.log(expiredays)
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = cName + '=' + escape(value) + ((expiredays === null) ? '' : ';expires=' + exdate.toGMTString())
    console.log(exdate.toGMTString())
  },
  // 删除cookie
  delCookie (name) {
    var exp = new Date()
    exp.setTime(exp.getTime() - 1)
    var cval = this.getCookie(name)
    if (cval != null) {
      document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
    }
  }
}

export default utils
