
var api = {
  POST_WECHAT_INFO: ['post', '/wx/authsend/save'],
  POST_TEL: ['post', '/wx/authsend/getTelno'],
  GET_UNLOCK_RECORD: ['get', '/data/queryDate'],
  GET_FILEDATA: ['get', '/admin/client/getFileData'],
  POST_ADDRESS: ['post', '/wx/user/installation'],
  POST_REPAIRE: ['post', '/wx/user/warranty']
};

module.exports = api
