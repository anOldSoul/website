
var api = {
  POST_WECHAT_USER_LOGIN: ['post', '/clSystem/api/loginInfo/wechat/member'], // 用户通过手机号和验证码登录微信页面
  POST_WECHAT_USER_ACCOUNT: ['post', '/clWechat/api/xcx/openId/unionId/xcx/online/mall/login'], // 用户通过手机号
  POST_WECHAT_OPENID: ['post', '/clWechat/api/xcx/openId/unionId'],
  SEND_MESSAGE: ['get', '/clSystem/api/captcha/sms'],
  // POST_WECHAT_INFO: ['post', '/clWechat/api/xcx/mobileInfo'], // 小程序解密手机号
  GET_VERIFYIMG: ['get', '/clSystem/api/images/image/verify'], // 获取验证图片
  CAPTCHA_CHECK: ['get', '/clSystem/api/captcha/check'], // 验证验证码是否正确
  POST_AUDITINFO: ['post', '/clEnterprise/api/account/employees/employee/auditInfo'],
  GET_CARD: ['get', '/clPoint/api/tp/member/point/mall/store/user/card'], //获取会员卡列表
  // GET_RULE: ['get', '/clPoint/api/tp/member/point/mall/store/setup/point/rule'],
  GET_SERVICE: ['get', '/clPoint/api/tp/member/point/mall/store/setup/custom/service/info'],
  GET_LATEST_ORDERS: ['get', '/clPoint/api/tp/member/point/mall/store/user/latest/orders'],
  POST_APPLY: ['post', '/clPoint/api/tp/member/point/mall/store/user/apply'],
  GET_AUDITING: ['get', '/clPoint/api/tp/member/point/mall/store/user/card/status'],
  GET_STORES: ['get', '/clEnterprise/api/store/branchStoreInfos/detail'],
  GET_BANNER: ['get', '/clPoint/api/tp/member/online/mall/store/setup/banner'],  //获取横幅链接
  GET_DELIVERY: ['get', '/clPoint/api/tp/member/online/mall/store/setup/delivery/mode'],  //获取连锁配送方式
  GET_CONFIGS: ['get', '/clSystem/api/configuration/center/belongings/belonging/keys/configurations'],  //连锁配置
  GET_AGREEMENT: ['get', '/clPoint/api/tp/member/point/mall/agreement'],

  //淘妈妈
  GET_EVENT_GOODS: ['get', '/clPoint/api/tp/member/online/mall/store/goods/event'],
  GET_CATEGORY: ['get', '/clPoint/api/tp/member/online/mall/store/category/v2'],
  GET_CATEGORY_GOODS: ['get', '/clPoint/api/tp/member/online/mall/store/goods/event/v2'],
  GET_CART: ['get', '/clPoint/api/tp/member/online/mall/store/user/cart/items'],
  GET_LIKE: ['get', '/clPoint/api/tp/member/online/mall/store/goods/infer/like'],
  GET_ADDRESS: ['get', '/clPoint/api/tp/member/point/mall/store/user/addresses'],
  GET_USER_ORDERS: ['get', '/clPoint/api/tp/member/online/mall/store/user/orders'],
  POST_CART: ['post', '/clPoint/api/tp/member/online/mall/store/user/cart/items/item'],
  DELETE_ITEM: ['delete', '/clPoint/api/tp/member/online/mall/store/user/cart/items/item'],
  GET_DEFAULT: ['get', '/clPoint/api/tp/member/point/mall/store/user/default/address/v2'],
  GET_DEFAULT3: ['get', '/clPoint/api/tp/member/point/mall/store/user/default/address/v3'],
  GET_NEAR_BRANCH: ['get', '/clPoint/api/tp/member/online/mall/store/delivery/address/branch/store'],
  POST_ADDRESS: ['post', '/clPoint/api/tp/member/point/mall/store/user/address'],
  DELETE_ADDRESS: ['delete', '/clPoint/api/tp/member/point/mall/store/user/address'],
  GET_ORDER_DETAIL: ['get', '/clPoint/api/tp/member/online/mall/store/user/orders/order/detail'],
  GET_ORDER_STATUS: ['get', '/clPoint/api/tp/member/online/mall/store/user/orders/order/status'],
  PUT_ORDER_STATUS: ['put', '/clPoint/api/tp/member/online/mall/store/user/orders/order/status'],
  POST_ORDER: ['post', '/clPoint/api/tp/member/online/mall/store/user/order'],
  POST_PREPAYID: ['post', '/clWechat/api/wechat/pay/preparePayInfo'],
  GET_COUPONS_WAIT: ['get', '/clPoint/api/tp/member/online/mall/user/coupons/wait'],
  GET_COUPONS_RECEIVED: ['post', '/clPoint/api/tp/member/online/mall/user/coupons/received'],
  GET_COUPONS: ['get', '/clPoint/api/tp/member/online/mall/coupons/classes'],
  POST_COUPON: ['post', '/clPoint/api/tp/member/online/mall/user/coupons/coupon'],
  POST_WECHAT_INFO: ['post', '/clWechat/api/xcx/mobileInfo/xcx/online/mall/login'],
  POST_WECHAT_RUN: ['post', '/clWechat/api/wechat/run/step/today'],
  GET_CODE_SHARE: ['get', '/clWechat/api/wechat/qr/xcx/online/mall/user'],
  POST_RECEIVE: ['post', '/clPoint/api/tp/member/online/mall/user/health/currency/receive'],
  GET_INVITER: ['get', '/clPoint/api/tp/member/online/mall/inviter/popularity/stat'],
  POST_CASH: ['post', '/clPoint/api/tp/member/online/mall/inviter/withdraw/cash'],
  GET_WITHDRAW_DETAIL: ['get', '/clPoint/api/tp/member/online/mall/inviter/withdraw/detail'],   //提现明细
  GET_REWARD_DETAIL: ['get', '/clPoint/api/tp/member/online/mall/inviter/popularity/detail'],   //奖励明细
  // GET_EXCHANGE_GOOD: ['get', '/clPoint/api/tp/member/online/mall/store/goods/event/single/commodity'],
  POST_HEALTH_ORDER: ['post', '/clPoint/api/tp/member/online/mall/store/user/health/currency/order'],
  GET_RULE: ['get', '/clPoint/api/tp/member/online/mall/store/setup/popularity/award/rule'],
  GET_BUBU_RULE: ['get', '/clPoint/api/tp/member/online/mall/store/setup/health/currency/rule'],
  GET_QR_SCENE: ['get', '/clWechat/api/wechat/qr/scene'],
  POST_INVITEE_REL: ['post', '/clPoint/api/tp/member/online/mall/invitee/scan/login'],
  GET_BACKGROUND_URL: ['get', '/clPoint/api/tp/member/online/mall/random/background/url'],
  GET_MY_INFO: ['get', '/clPoint/api/tp/member/online/mall/store/user/info'],
  GET_INVITEE_DETAIL: ['get', '/clPoint/api/tp/member/online/mall/inviter/invitee/detail'],
  POST_ORDER_PRIVILEDGES: ['post', '/clPoint/api/tp/member/online/mall/store/user/order/priviledges'],
  GET_USER_INFO: ['get', '/clPoint/api/tp/member/online/mall/store/user/info'],
  GET_CURRENCY_INFO: ['get', '/clPoint/api/tp/member/online/mall/user/health/currency/info/v2'],
  POST_INVITE_STEP: ['post', '/clPoint/api/tp/member/online/mall/invite/award/step/v2'],
  GET_SHOPPING_NOTES: ['get', '/clPoint/api/tp/member/online/mall/store/setup/shopping/notes'],
  GET_GROUP_DETAIL: ['get', '/clPoint/api/tp/member/online/mall/store/group/purchase/detail'],
  GET_PAY_IMMEDIATE_CONDITION: ['get', '/clPoint/api/tp/member/online/mall/store/group/purchase/immediate/condition'],
  GET_PAY_CONDITION: ['get', '/clPoint/api/tp/member/online/mall/store/group/purchase/pay/condition'],
  GET_GOODS_HINT: ['get', '/clPoint/api/tp/member/online/mall/user/health/currency/goods/hint'],
  POST_PURCHASE_CONDITION: ['post', '/clPoint/api/tp/member/online/mall/store/user/immediate/purchase/condition'],
  GET_IMMEDIATE_CONDITION: ['get', '/clPoint/api/tp/member/online/mall/store/group/purchase/immediate/condition'],
  PUT_ORDER_FAIL: ['put', '/clPoint/api/tp/member/online/mall/store/user/order/fail'],
  POST_USER_FORMID: ['post', '/clWechat/api/wechat/ma/template/messages/user/formId'],
  POST_AFTER_SALE: ['post', '/clPoint/api/tp/member/online/mall/store/user/orders/order/after/sale/apply'],   //申请售后
  GET_AFTER_SALE_STATUS: ['get', '/clPoint/api/tp/member/online/mall/store/user/orders/order/after/sale/status'], //查看售后状态
  PUT_RETURN_GOODS: ['put', '/clPoint/api/tp/member/online/mall/store/user/orders/order/after/sale/return/goods'],  //售后申请退货
  GET_ORDER_JUMP: ['get', '/clPoint/api/tp/member/online/mall/store/order/jump/judge'],  //判断跳转大树宝
  GET_SEARCH: ['get', '/clPoint/api/tp/member/online/mall/store/goods/search/v2'],
  PUT_USER_OPENNOTIFY: ['put', '/clPoint/api/tp/member/online/mall/user/openNotify'],  
  PUT_BOOKING_SUCCESS: ['put', '/clPoint/api/tp/member/online/mall/step/booking/success'],
  POST_GIFT_CART: ['post', '/clPoint/api/tp/member/online/mall/store/gift/cart/items/item'],  //加入送礼购物车
  DELETE_CART_GIFT: ['delete', '/clPoint/api/tp/member/online/mall/store/gift/cart/items/item'],  //移除购物车商品
  GET_GIFT_CART: ['get', '/clPoint/api/tp/member/online/mall/store/gift/cart/items'], //获取送礼购物车
  POST_GIFT_ORDER: ['post', '/clPoint/api/tp/member/online/mall/store/gift/user/order'], //生成礼物红包
  GET_GIFT_DETAIL: ['get', '/clPoint/api/tp/member/online/mall/store/gift/detail'], //获取礼品详情
  GET_GIFT_BLESSINGS: ['get', '/clPoint/api/tp/member/online/mall/store/gift/blessings'], //获取祝福语
  PUT_GIFT_ORDER: ['put', '/clPoint/api/tp/member/online/mall/store/gift/user/order'], //收礼
  GET_SINGLE_COMMODITY: ['get', '/clPoint/api/tp/member/online/mall/store/goods/event/single/commodity'],
  POST_ISSUE_FEEDBACK: ['post','/clPoint/api/tp/member/online/mall/store/user/feedback'], // 问题反馈
};

module.exports = api
