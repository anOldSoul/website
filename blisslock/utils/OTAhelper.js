const Format = require("./format.js")
let sourceFile = ''

function init(data) {
  let BinaryData = Format.hexToBytes(data)
  let patched_length = (BinaryData.length % 128) != 0 ? BinaryData.length + (128 - BinaryData.length % 128) : BinaryData.length;
  let tempBin = BinaryData;

  for (let idx = tempBin.length; idx < patched_length; idx++) {
    BinaryData[idx] = 0;
  }
  sourceFile = BinaryData
}

function getSourceFile() {
  return sourceFile;
}

function getPayloadSize() {
  return 20;
}

function getSourceFileCRC() {
  let CRC = 0;
  console.log(sourceFile.length)
  for (let i = 0; i < sourceFile.length; i++) {
    let CC = sourceFile[i];
    CC &= 0x000000FF;
    CRC += CC;
    CRC = CRC & 0x0000FFFF;
  }
  console.log("CRC ==>" + CRC);
  return CRC;
}


function getSourceFileSize() {
  return sourceFile.length
}

module.exports = {
  init: init,
  getSourceFile: getSourceFile,
  getPayloadSize: getPayloadSize,
  getSourceFileCRC: getSourceFileCRC,
  getSourceFileSize: getSourceFileSize
}