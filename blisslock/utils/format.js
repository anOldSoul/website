const Encrypt = require("./getEncryptBytes.js")

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const getDeviceItem = (key) => {
  let currentDeviceIndex = wx.getStorageSync('currentDeviceIndex')
  let deviceList = wx.getStorageSync('deviceList')
  let currentItem = deviceList[currentDeviceIndex] || {}
  let returnValue = currentItem[key]
  return returnValue
}
const updateDeviceList = (key, value) => {
  let currentDeviceIndex = wx.getStorageSync('currentDeviceIndex')
  let deviceList = wx.getStorageSync('deviceList')
  let currentItem = deviceList[currentDeviceIndex]
  currentItem[key] = value
  wx.setStorageSync('deviceList', deviceList)
}

//regino 生成密码算法
const getTempPassword = () => {
  let bleTempBindCode = getDeviceItem('bindCode');
  console.log("生成临时密码算法  tempbindcode = " + bleTempBindCode);

  //根据绑定码生成加密密钥
  let r = "00000000" + (parseInt(bleTempBindCode)).toString(16);
  console.log("生成临时密码算法  r = " + r);
  let tempHexString = r.substring(r.length - 8);
  console.log("生成临时密码算法  tempHexString = " + tempHexString);
  let cryptKey = bleTempBindCode + tempHexString;
  console.log("生成临时密码算法  cryptKey = " + cryptKey);
  let tempSecDiff = generate3MinToSecond();
  console.log("生成临时密码算法  tempSecDiff 时间差 = " + tempSecDiff);
  //组合生成密码
  let tempBCD = FillZero(tempSecDiff);
  console.log("生成临时密码算法  时间差BCD码格式 = " + tempBCD);
  let s = "00000000" + parseInt(tempSecDiff).toString(16);  //4b62834  ->"4b62834"
  let tempHEX = s.substring(s.length - 8);;
  console.log("生成临时密码算法  时间差HEX格式 = " + tempHEX);
  let cryptData = tempBCD + tempHEX;
  console.log("生成临时密码算法  cryptData = " + cryptData);
  let tempPwd = "";
  let b = Encrypt.getEncryptBytes(cryptKey.trim().toUpperCase(), cryptData.trim().toUpperCase(), bleTempBindCode);
  tempPwd = b.join("")
  return tempPwd;
}
const FillZero = (p) => {
  return new Array(8 - (p + '').length + 1).join('0') + p;
}
function formatPw(pw) {
  let newPw = strToHexCharCode(pw)
  if (newPw.length < 24) {
    for (let i = newPw.length; i < 24; i++) {
      newPw = newPw + '0'
    }
  }
  return newPw
}
// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}
const getCheckSum = (data) => {
  let ret = 0;
  for (let i = 0; i < data.length; i++) {
    ret += data[i];
  }
  return ret;
}

const strToHexCharCode = (str) => { //ascii转16进制
  if (str === "") {
    return "";
  } else {
    var hexCharCode = [];
    for (var i = 0; i < str.length; i++) {
      hexCharCode.push((str.charCodeAt(i)).toString(16));
    }
    return hexCharCode.join("");
  }
}

//字节数组转十六进制字符串
const bytes2Str = (arr) => {
  var str = "";
  for (var i = 0; i < arr.length; i++) {
    var tmp = arr[i].toString(16);
    if (tmp.length == 1) {
      tmp = "0" + tmp;
    }
    str += tmp;
  }
  return str;
}
const shortToBytesLe = (shortValue) => {
  let arr = new Array();
  for (let i = 0; i < 2; ++i) {
    arr[i] = (shortValue >> i * 8 & 0xFF);
  }
  return arr;
}

const bytesToIntLe = (bytes) => {
  let ret = 0;
  for (let i = 0; i < bytes.length; ++i) {
    ret += ((bytes[i] & 0xFF) << i * 8);
  }

  return ret;
}

//十六进制转byte数组
const hexToBytes = (str) => {
  var pos = 0;
  var len = str.length;
  if (len % 2 != 0) {
    return null;
  }
  len /= 2;
  var hexA = new Array();
  for (var i = 0; i < len; i++) {
    var s = str.substr(pos, 2);
    var v = parseInt(s, 16);
    hexA.push(v);
    pos += 2;
  }
  return hexA;
}

//十六进制转ascii字符
const hexToFromBytes = (str) => {
  var pos = 0;
  var len = str.length;
  if (len % 2 != 0) {
    return null;
  }
  len /= 2;
  var hexA = new Array();
  for (var i = 0; i < len; i++) {
    var s = '0x' + str.substr(pos, 2);
    var v = String.fromCharCode(s)
    hexA.push(v);
    pos += 2;
  }
  let result = ''
  hexA.forEach((item, index) => {
    if (item !== '0') {
      result = hexA.join('')
      result = result.substring(index, result.length)
      return
    }
  })
  return result
}

const generate3MinToSecond = () => {
  let myDate = new Date();
  let now = myDate.getTime() / (1000);
  let begin = 0;
  let newDate = ('2000-01-01 00:00:00').replace(/-/g, '/');
  begin = (new Date(newDate).getTime()) / 1000;
  return parseInt((now - begin) / 180);
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const getQueryString = (url, name) => {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = url.match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

const getRandomStr = (total) => {
  let random = ''
  for (let i = 0; i < total; i++) {
    random = random + Math.floor(Math.random() * 10)
  }
  return random
}
module.exports = {
  formatTime: formatTime,
  getTempPassword: getTempPassword,
  getDeviceItem: getDeviceItem,
  updateDeviceList: updateDeviceList,
  formatPw: formatPw,
  ab2hex: ab2hex,
  getCheckSum: getCheckSum,
  strToHexCharCode: strToHexCharCode,
  bytes2Str: bytes2Str,
  shortToBytesLe: shortToBytesLe,
  hexToBytes: hexToBytes,
  getQueryString: getQueryString,
  getRandomStr: getRandomStr,
  bytesToIntLe: bytesToIntLe,
  hexToFromBytes: hexToFromBytes
}