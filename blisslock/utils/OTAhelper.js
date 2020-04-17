const OTAbin = require("./otabin.js")
const Format = require("./format.js")
let BinaryData = Format.hexToBytes(OTAbin.OTABIN)
let patched_length = (BinaryData.length % 128) != 0 ? BinaryData.length + (128 - BinaryData.length % 128) : BinaryData.length;
let tempBin = BinaryData;

for (let idx = tempBin.length; idx < patched_length; idx++) {
  BinaryData[idx] = 0;
}
const sourceFile = BinaryData

function getSourceFile() {
  return sourceFile;
}

function getPayloadSize() {
  return 20;
}

function getSourceFileCRC() {
  let CRC = 0;
  let i = 0;
  for (i = 0; i < sourceFile.length; i++) {
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
  getSourceFile: getSourceFile,
  getPayloadSize: getPayloadSize,
  getSourceFileCRC: getSourceFileCRC,
  getSourceFileSize: getSourceFileSize
}