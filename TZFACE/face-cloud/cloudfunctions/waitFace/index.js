const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection('waitFace')
      .add({
        data: {
          fileID: event.fileID,
          name: event.name,
          telephone: event.telephone,
          openid: wxContext.OPENID,
          appid: wxContext.APPID,
          unionid: wxContext.UNIONID,
          status: event.status,
          sn: event.sn
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