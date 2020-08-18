const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection('users')
      .add({
        data: {
          openid: wxContext.OPENID,
          appid: wxContext.APPID,
          unionid: wxContext.UNIONID,
          env: wxContext.ENV,
          name: event.name,
          telephone: event.telephone
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
/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
// exports.main = async (event, context) => {
//   console.log(event)
//   console.log(context)

//   // 可执行其他自定义逻辑
//   // console.log 的内容可以在云开发云函数调用日志查看

//   // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
//   const wxContext = cloud.getWXContext()

//   return {
//     event,
//     openid: wxContext.OPENID,
//     appid: wxContext.APPID,
//     unionid: wxContext.UNIONID,
//     env: wxContext.ENV,
//   }
// }

