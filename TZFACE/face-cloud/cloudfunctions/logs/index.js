const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection('logs')
      .add({
        data: {
          faceId: event.id,
          time: event.time,
          sn: event.sn
        },
        success: res => {
          console.log(res)
        },
        fail: err => {
          icon: 'none',
          console.error('[数据库] [获取日志] 失败：', err)
        }
      })
  } catch (e) {
    console.error(e)
  }
}