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
    .where({
      // time: 11,
      sn: event.sn
    })
      // .skip(event.pageNo)
      .limit(20)
      .get()
  } catch (e) {
    console.error(e)
  }
}