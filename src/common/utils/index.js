/**
 * 获取地址栏参数值
 * @param name
 * @returns {null}
 * @constructor
 */
export function GetQueryString (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  var s = window.location.search
  var href = window.location.href
  var index = href.indexOf('?')
  if (s === '') {
    r = href.substr(index + 1).match(reg)
  }
  if (r != null) return unescape(r[2])
  return null
}




export default {
  getCookie(cname) {
    var arr, reg = new RegExp("(^| )" + cname + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
      return (arr[2]);
    else
      return null;

  },
  delCookie(name) {
  var exp = new Date()
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
},
  setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    console.info(cname + "=" + '111' + "; " + expires);
    document.cookie = cname + "=" + cvalue + "; " + expires;
  }

}
