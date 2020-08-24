const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection('address')
      .add({
        data: {
          userid: event.userid,
          province: event.province,
          city: event.city,
          area: event.area,
          phone: event.phone,
          owner: event.owner,
          installationAddress: event.installationAddress,
          satisfaction: event.satisfaction,
          latitude: event.latitude,
          longitude: event.longitude,
          productType: event.productType,
          sn: event.sn
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