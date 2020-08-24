// 云函数入口文件

const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  var docid = event.docid
  var imgUrl = event.imgUrl
  var fileID = event.fileID
  var imgId = event.imgId
  var sn = event.sn
  try {
    return await db.collection('waitFace').doc(docid)
      .update({
        data: {
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