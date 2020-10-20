const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection('visitors')
      .add({
        data: {
          name: event.name,
          sn: event.sn,
          fileID: event.fileID,
          type: event.type, //0表示单次，1表示不限
          beginTime: event.beginTime,
          endTime: event.endTime,
          frequency: 0,
          status: event.status  //0表示正常，1表示已失效，2表示异常状况
        },
        success: res => {
          console.log(res)
        },
        fail: err => {
          icon: 'none',
            console.error('[数据库] [添加安装地址] 失败：', err)
        }
      })
  } catch (e) {
    console.error(e)
  }
}