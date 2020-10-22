// 云函数入口文件

const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  var docid = event.docid
  try {
    return await db.collection('faces').doc(docid)
      .update({
        data: {
          faceid: event.faceid,
          fileID: event.fileID,
          status: event.status
        },
        success: res => {
          console.log(res)
        },
        fail: err => {
          icon: 'none',
            console.error('[数据库] [更新记录] 失败：', err)
        }
      })
  } catch (e) {
    console.error(e)
  }
}