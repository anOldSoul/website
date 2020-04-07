const IPCConstant = require("./IPCConstant.js").default
const PxiBleOTAhelper = require("./OTAhelper.js")
const Format = require("./format.js")
const att_mtu_size = 23;
let break_address = 0;

const splitArray = (arrayToSplit, chunkSize) => {
  if (chunkSize <= 0) {
    return null;  // just in case :)
  }
  let rest = arrayToSplit.length % chunkSize;
  //分包，余数单独成一包
  let chunks = Math.floor(arrayToSplit.length / chunkSize) + (rest > 0 ? 1 : 0);
  console.log(chunks)
  let arrays = [];
  for (let i = 0; i < (rest > 0 ? chunks - 1 : chunks); i++) {
    arrays.push(arrayToSplit.slice(i * chunkSize, i * chunkSize + chunkSize));
  }
  if (rest > 0) {
    arrays.push(arrayToSplit.slice(arrayToSplit, (chunks - 1) * chunkSize, (chunks - 1) * chunkSize + rest));
  }
  console.log(arrays)
  return arrays;
}

const ota_version_check = () => {
  console.log("OTA Version Check");

  if (initOTAnew() == false) {
    console.log("initOTAnew fail: ");
    return;
  }
  return;
}

const initOTAnew = () => {
  let writeData = [];
  let FWLength = PxiBleOTAhelper.getSourceFileSize();
  console.log("FWLength", "" + FWLength);
  writeData[0] = IPCConstant.CMD_FW_INIT_NEW;
  writeData[1] = FWLength & 0xFF;
  writeData[2] = FWLength >> 8 & 0xFF;
  writeData[3] = FWLength >> 16 & 0xFF;
  writeData[4] = FWLength >> 24 & 0xFF;
  return Format.bytes2Str(writeData)
}

const initOTA = () => {
  let writeData = [];

  writeData[0] = IPCConstant.CMD_FW_INIT;
  writeData[1] = 0x00;

  return Format.bytes2Str(writeData)
}

const startOTAGetMtu = () => {
  let writeData = [];
  writeData[0] = IPCConstant.CMD_FW_GET_MTU_SIZE;
  writeData[1] = 0x00;
  return Format.bytes2Str(writeData)
}

const startOTAeraseFlash = () => {
  let WriteData = [];

  WriteData[0] = IPCConstant.CMD_FW_ERASE;
  WriteData[1] = 0x00;
  return Format.bytes2Str(writeData)
}

const startRemoteDeviceConnectionUpdate = (maxInterval, minInterval, slaveLanteny, supervisionTimeOut) => {
  let writeData = [];
  writeData[0] = IPCConstant.CMD_FW_CONN_PARAM_SET;
  writeData[1] = minInterval & 0xff;
  writeData[2] = (minInterval >> 8) & 0xff;
  writeData[3] = maxInterval & 0xff;
  writeData[4] = (maxInterval >> 8) & 0xff;
  writeData[5] = slaveLanteny & 0xff;
  writeData[6] = (slaveLanteny >> 8) & 0xff;
  writeData[7] = supervisionTimeOut & 0xff;
  writeData[8] = (supervisionTimeOut >> 8) & 0xff;
  return Format.bytes2Str(writeData)
}

const startOTASetFlashAddress = (Address) => {
  let WriteData = [];
  WriteData[0] = IPCConstant.CMD_FW_SET_ADDRESS;
  WriteData[1] = 4;
  WriteData[2] = Address & 0x000000FF;
  WriteData[3] = (Address & 0x0000FF00) >> 8;
  WriteData[4] = (Address & 0x00FF0000) >> 16;
  WriteData[5] = (Address & 0xFF000000) >> 24;

  return Format.bytes2Str(writeData)
}

const startFastWriteFlash = (binArray, start_address, size) => {
  let count = 0;
  let DataArray = [];
  let WriteCount;
  let currentWriteCount;
  let idx;
  let CurrentAddress = start_address;
  let sector_check = 0;
  let sector_address = start_address;
  let length = 0;
  let chunckBinary = [];


  length = ((att_mtu_size - 3) / 4 * 4);
  if (length >= 508) {
    length = 504;
  }  // workaround with 2802: due to the receive buffer size is smaller than l2cap pdu length(aleast bigger than 518)

  size = length;
  currentWriteCount = start_address / size;
  startOTAFastWriteFlashSet(binArray.length - start_address);

  chunckBinary = splitArray(binArray, size);
  for (let i = 0; i < chunckBinary,length; i++) {
    // writeCharacteristic(chunckBinary[i]);
    currentWriteCount++;
    console.log("Update to ..." + currentWriteCount + "/" + chunckBinary.size());
    return chunckBinary[i]
  }
}

const startOTAFastWriteFlashSet = (Size) => {
  let WriteData = [];
  WriteData[0] = IPCConstant.CMD_FW_FAST_WRITE_SET;
  WriteData[1] = (byte)(Size & 0x000000FF);
  WriteData[2] = (byte)((Size & 0x0000FF00) >> 8);
  WriteData[3] = (byte)((Size & 0x00FF0000) >> 16);
  WriteData[4] = (byte)((Size & 0xFF000000) >> 24);
  return Format.bytes2Str(writeData)
}

const startOTAupgradeFlash = (Size, CRC) => {
  let WriteData = [];
  WriteData[0] = IPCConstant.CMD_FW_UPGRADE;
  WriteData[1] = (byte)(Size & 0x000000FF);
  WriteData[2] = (byte)((Size & 0x0000FF00) >> 8);
  WriteData[3] = (byte)((Size & 0x00FF0000) >> 16);
  WriteData[4] = (byte)((Size & 0xFF000000) >> 24);
  WriteData[5] = (byte)(CRC & 0x000000FF);
  WriteData[6] = (byte)((CRC & 0x0000FF00) >> 8);
  return Format.bytes2Str(writeData)
}

const task = () => {
  let sec_no;
  let eraseFlashResult;
  if (break_address != 0) {
    break_address &= 0xFFFFF000;
    sec_no = PxiBleOTAhelper.getSourceFile().length >> 12;
    sec_no = ((PxiBleOTAhelper.getSourceFile().length & 0x00000FFF) != 0) ? (sec_no + 1) : sec_no;
    sec_no = sec_no - (break_address >> 12);
    // eraseFlashResult = startOTAsectorEraseFlash(break_address, sec_no);
    // Log.i(TAG, "startOTAsectorEraseFlash");
  } else {
    // eraseFlashResult = startOTAeraseFlash();
    // Log.i(TAG, "startOTAeraseFlash");
  }
  startFastWriteFlash(PxiBleOTAhelper.getSourceFile(), break_address, PxiBleOTAhelper.getPayloadSize())
}

const task2 = () => {
  let CRC = 0;
  let FWLength = PxiBleOTAhelper.getSourceFileSize();
  WriteData = [];

  WriteData[0] = IPCConstant.CMD_FW_UPGRADE;
  WriteData[1] = FWLength & 0x000000FF;
  WriteData[2] = FWLength & 0x0000FF00 >> 8;
  WriteData[3] = FWLength & 0x00FF0000 >> 16;
  WriteData[4] = FWLength & 0xFF000000 >> 24;
  WriteData[5] = CRC & 0x000000FF;
  WriteData[6] = CRC & 0x0000FF00 >> 8;
}

module.exports = {
  splitArray, initOTAnew, startOTAeraseFlash, startOTAGetMtu, initOTA, startOTAupgradeFlash, startOTAFastWriteFlashSet, startFastWriteFlash
}