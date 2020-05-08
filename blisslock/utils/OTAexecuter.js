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
  console.log(rest)
  //分包，余数单独成一包
  let chunks = Math.floor(arrayToSplit.length / chunkSize) + (rest > 0 ? 1 : 0);
  console.log(chunks)
  let arrays = [];
  for (let i = 0; i < (rest > 0 ? chunks - 1 : chunks); i++) {
    arrays.push(arrayToSplit.slice(i * chunkSize, i * chunkSize + chunkSize));
  }
  if (rest > 0) {
    arrays.push(arrayToSplit.slice((chunks - 1) * chunkSize, (chunks - 1) * chunkSize + rest));
  }
  return arrays;
}

const startOTAfwReset = () => {
  let writeData = [];

  writeData[0] = IPCConstant.CMD_FW_MCU_RESET;
  writeData[1] = 0x00;

  console.log("CMD FW MCU RESET");
  return Format.bytes2Str(writeData)

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
  let writeData = [];

  writeData[0] = IPCConstant.CMD_FW_ERASE;
  writeData[1] = 0x00;
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
  let writeData = [];
  writeData[0] = IPCConstant.CMD_FW_SET_ADDRESS;
  writeData[1] = 4;
  writeData[2] = Address & 0x000000FF;
  writeData[3] = (Address & 0x0000FF00) >> 8;
  writeData[4] = (Address & 0x00FF0000) >> 16;
  writeData[5] = (Address & 0xFF000000) >> 24;
  return Format.bytes2Str(writeData)
}

const startFastWriteFlash = (binArray, start_address, size) => {
  console.log('!!!!!!!!!!!!!!!!!!!')
  console.log(start_address)
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
  return startOTAFastWriteFlashSet(binArray.length - start_address);

  // chunckBinary = splitArray(binArray, size);
  // for (let i = 0; i < chunckBinary.length; i++) {
  //   // writeCharacteristic(chunckBinary[i]);
  //   currentWriteCount++;
  //   console.log("Update to ..." + currentWriteCount + "/" + chunckBinary.size());
  //   return chunckBinary[i]
  // }
}

const startOTAFastWriteFlashSet = (Size) => {
  let writeData = [];
  writeData[0] = IPCConstant.CMD_FW_FAST_WRITE_SET;
  writeData[1] = (Size & 0x000000FF);
  writeData[2] = ((Size & 0x0000FF00) >> 8);
  writeData[3] = ((Size & 0x00FF0000) >> 16);
  writeData[4] = ((Size & 0xFF000000) >> 24);
  return Format.bytes2Str(writeData)
}

const startOTAupgradeFlash = (Size, CRC) => {
  let writeData = [];
  writeData[0] = IPCConstant.CMD_FW_UPGRADE;
  writeData[1] = (Size & 0x000000FF);
  writeData[2] = ((Size & 0x0000FF00) >> 8);
  writeData[3] = ((Size & 0x00FF0000) >> 16);
  writeData[4] = ((Size & 0xFF000000) >> 24);
  writeData[5] = (CRC & 0x000000FF);
  writeData[6] = ((CRC & 0x0000FF00) >> 8);
  return Format.bytes2Str(writeData)
}

const startOTAsectorEraseFlash = (address_sector, nf_sector) => {
  let writeData = [];
  writeData[0] = IPCConstant.CMD_FW_SECTOR_ERASE;
  writeData[1] = (address_sector & 0x000000FF);
  writeData[2] = ((address_sector & 0x0000FF00) >> 8);
  writeData[3] = ((address_sector & 0x00FF0000) >> 16);
  writeData[4] = ((address_sector & 0xFF000000) >> 24);
  writeData[5] = (nf_sector & 0x000000FF);
  writeData[6] = ((nf_sector & 0x0000FF00) >> 8);
  console.log('Sector Erase');
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
  return startFastWriteFlash(PxiBleOTAhelper.getSourceFile(), break_address, PxiBleOTAhelper.getPayloadSize())
}

const task2 = () => {
  let CRC = 0;
  let FWLength = PxiBleOTAhelper.getSourceFileSize();
  writeData = [];

  writeData[0] = IPCConstant.CMD_FW_UPGRADE;
  writeData[1] = FWLength & 0x000000FF;
  writeData[2] = FWLength & 0x0000FF00 >> 8;
  writeData[3] = FWLength & 0x00FF0000 >> 16;
  writeData[4] = FWLength & 0xFF000000 >> 24;
  writeData[5] = CRC & 0x000000FF;
  writeData[6] = CRC & 0x0000FF00 >> 8;
}

module.exports = {
  task,
  splitArray,
  initOTAnew, 
  startOTAeraseFlash, 
  startOTAGetMtu, 
  startRemoteDeviceConnectionUpdate, 
  initOTA, 
  startOTAupgradeFlash, 
  startOTAFastWriteFlashSet, 
  startFastWriteFlash,
  startOTAfwReset,
  startOTASetFlashAddress
}