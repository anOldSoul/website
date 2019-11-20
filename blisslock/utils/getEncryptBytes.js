const Encrypt = require("./encrypt.js");
let DES_key = [];
let DES_data = [];
let out_buf = [];
let pwd = [];
let code_buf = [0x00, 0x00, 0x00, 0x00];
const getEncryptBytes = (key, data, code) => {
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
//加密
const crypt = (key, data) => {
  let charArray = [
    0x9C, 0x90, 0x4E, 0xF2, 0x29, 0xD4, 0xE6, 0xD4, 0xF9, 0xBD, 0xA4, 0x33,
    0xE5, 0x85, 0xBC, 0xA9, 0x77, 0x38, 0x93, 0x0A, 0x2B, 0xCE, 0xB0, 0x67,
    0x53, 0x7D, 0x5D, 0x6C, 0x8A, 0x46, 0x48, 0x42, 0xB1, 0x0E, 0x99, 0x47,
    0x45, 0x34, 0xCB, 0xCA, 0x8C, 0x37, 0x6D, 0xDC, 0xB4, 0x9D, 0x05, 0xE2,
    0xC3, 0xAB, 0x81, 0xCB, 0xB4, 0xB4, 0x0F, 0xAF, 0xDE, 0xE8, 0xA2, 0xC2,
    0x4F, 0x5F, 0x11, 0x50, 0x3B, 0x34, 0x2B, 0xCE, 0xB0, 0xCF, 0x16, 0x19,
    0xE8, 0x52, 0x43, 0x03, 0x3C, 0xC2, 0xBD, 0xE2, 0x4C, 0x43, 0x55, 0x5D,
    0x0B, 0xEF, 0x27, 0x03, 0x4B, 0x1E, 0xE0, 0x31, 0xCC, 0x54, 0x2D, 0xFB,
    0xBC, 0x90, 0xFE, 0x2C, 0xCA, 0x9A, 0xF8, 0xC2, 0xD3, 0x36, 0x3A, 0xE3,
    0x65, 0x8B, 0x9E, 0xB1, 0x51, 0x8F, 0xCB, 0x94, 0xE5, 0x95, 0x49, 0xBA,
    0x36, 0xCD, 0xDC, 0xB5, 0xCD, 0xC2, 0xB3, 0x17, 0x1C, 0x31, 0xD4, 0x3D,
    0xFB, 0x3F, 0x1D, 0xA0, 0x68, 0xF6, 0xD2, 0x84, 0x57, 0xD7, 0x54, 0xDD,
    0xF2, 0x72, 0xE5, 0x0F, 0x56, 0x5C, 0x6A, 0xD7, 0xA6, 0x5C, 0xFB, 0xE2,
    0x25, 0x74, 0xED, 0xA3, 0x1D, 0x31, 0x87, 0xF2, 0x37, 0x4E, 0xF3, 0xFC,
    0x2C, 0xA2, 0x91, 0xE2, 0x7D, 0xFE, 0xB9, 0xA5, 0x77, 0x55, 0x08, 0x17,
    0x48, 0x29, 0x2C, 0xF6, 0xD1, 0xFC, 0xC7, 0x51, 0x59, 0x27, 0x1B, 0xA4,
    0x04, 0x95, 0xDD, 0x1B, 0xD1, 0x44, 0x28, 0xA1, 0xA6, 0xF2, 0xF5, 0xBB,
    0x3F, 0xE4, 0xBB, 0xFA, 0xE7, 0xB8, 0x96, 0x69, 0xBA, 0x27, 0x15, 0xFF,
    0x7C, 0xD7, 0x62, 0x54, 0xBE, 0x7E, 0x57, 0x09, 0xBF, 0x36, 0x01, 0x96,
    0x69, 0x05, 0xF0, 0x6A, 0x2A, 0xDB, 0xDB, 0x12, 0xA2, 0x63, 0x30, 0x01,
    0xBB, 0xF9, 0x99, 0xD2, 0xDC, 0x50, 0x96, 0xBE, 0xDA, 0x7A, 0x0A, 0x01,
    0xCD, 0x9E, 0x03, 0xF1]
  if (key.length != data.length) {
    return data;
  }
  for (let i = 0; i < data.length; i++) {
    data[i] = (data[i] ^ charArray[key[i] & 0xFF]);
  }
  return data;
}
module.exports = {
  getEncryptBytes: getEncryptBytes,
  crypt: crypt
}