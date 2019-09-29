const Encrypt = require("./encrypt.js");
let DES_key = [];
let DES_data = [];
let out_buf = [];
let pwd = [];
let code_buf = [0x00, 0x00, 0x00, 0x00];
const getEncryptBytes = (key, data, code) => {
  console.log('hhaaahhhhhaa')
  let temp;
  DES_key = keystr2num(key);
  DES_data = datastr2num(data);
  code_buf = codestr2num(code);
  out_buf = Encrypt.DES_Encrypt(DES_key, DES_data);
  out_buf[4] = out_buf[4] ^ code_buf[0];
  out_buf[5] = out_buf[5] ^ code_buf[1];
  out_buf[6] = out_buf[6] ^ code_buf[2];
  out_buf[7] = out_buf[7] ^ code_buf[3];
  temp = (out_buf[4] << 24) | (out_buf[5] << 16) | (out_buf[6] << 8) | (out_buf[7]);
  temp = temp & 0x03FFFFFF;
  temp = temp % 100000000;
  pwd[0] = parseInt(temp / 10000000);
  temp = temp % 10000000;
  pwd[1] = parseInt(temp / 1000000);
  temp = temp % 1000000;
  pwd[2] = parseInt(temp / 100000);
  temp = temp % 100000;
  pwd[3] = parseInt(temp / 10000);
  temp = temp % 10000;
  pwd[4] = parseInt(temp / 1000);
  temp = temp % 1000;
  pwd[5] = parseInt(temp / 100);
  temp = temp % 100;
  pwd[6] = parseInt(temp / 10);
  pwd[7] = parseInt(temp % 10);
  console.log(pwd)
  return pwd;
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
const keystr2num = (strkey) => {
  console.log(strkey)
  let i, t = 0, n = 0;
  strkey = strkey.split('').map((item, index) => {
    return (`0x${strToHexCharCode(item)}`)
  })
  for (i = 0; i < 16;) {
    if ((strkey[i] >= 0x30) && (strkey[i] <= 0x39)) {
      t = (strkey[i] - 0x30);
    } else {
      t = (strkey[i] - 0x41 + 0x0A);
    }
    t = t << 4; //左移四位，用于存下个数字
    i++;
    if ((strkey[i] >= 0x30) && (strkey[i] <= 0x39)) {
      t |= (strkey[i] - 0x30);
    } else {
      t |= (strkey[i] - 0x41 + 0x0A);
    }
    i++;
    DES_key[n++] = t;
  }
  return DES_key
}

const datastr2num = (strdata) => {
  let i, t = 0, n = 0;
  strdata = strdata.split('').map((item, index) => {
    return (`0x${strToHexCharCode(item)}`)
  })
  for (i = 0; i < 16;) {
    if ((strdata[i] >= 0x30) && (strdata[i] <= 0x39)) {
      t = (strdata[i] - 0x30);
    }
    else {
      t = (strdata[i] - 0x41 + 0x0A);
    }
    t = t << 4; //左移四位，用于存下个数字
    i++;
    if ((strdata[i] >= 0x30) && (strdata[i] <= 0x39)) {
      t |= (strdata[i] - 0x30);
    }
    else {
      t |= (strdata[i] - 0x41 + 0x0A);
    }
    i++;
    DES_data[n++] = t;
  }
  return DES_data
}

const codestr2num = (strcode) => {
  let i, t = 0, n = 0;
  strcode = strcode.split('').map((item, index) => {
    return (`0x${strToHexCharCode(item)}`)
  })
  for (i = 0; i < 8;) {
    if ((strcode[i] >= 0x30) && (strcode[i] <= 0x39)) {
      t = (strcode[i] - 0x30);
    }
    else {
      t = (strcode[i] - 0x41 + 0x0A);
    }
    t = t << 4; //左移四位，用于存下个数字
    i++;
    if ((strcode[i] >= 0x30) && (strcode[i] <= 0x39)) {
      t |= (strcode[i] - 0x30);
    }
    else {
      t |= (strcode[i] - 0x41 + 0x0A);
    }
    i++;
    code_buf[n++] = t;
  }
  return code_buf
}
module.exports = {
  getEncryptBytes: getEncryptBytes
}