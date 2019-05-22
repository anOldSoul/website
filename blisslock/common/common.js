import Api from '../config'
import http from '../utils/http.js'
// 收集formId
const getFormId = formId => {
  if (formId) {
    let data = {
      wechatId: 'carelinker_xcx_taomama',
      openId: wx.getStorageSync('TMM_OPENID'),
      formId: formId,
      count: 1
    }
    http.post(Api.POST_USER_FORMID, data, result => {
      if (result.success) {
      }
    })
  } else {
  }
}
// 获取商品在购物车里的数量
const getGoodsCartById = goodsId => {
  return new Promise((resolve, reject) => {
    if (goodsId) {
      let data = {
        storeId: wx.getStorageSync('YJF_STORE_ID'),
        userId: wx.getStorageSync('YJF_UERID')
      }
      http.post(Api.GET_CART, data, result => {
        if (result.success) {
          let currentNum = 0
          let goods = result.dataList.find(item => item.goodsId == goodsId)
          currentNum = goods ? goods.goodsNumber : 0
          resolve(currentNum)
        }
      })
    } else {
      reject()
    }
  })
}
// 加入购物车
const goodsJoinInCart = (goodsId, eventType = '', goodsNumber) => {
  wx.showLoading({
    title: '加载中',
  })
  return new Promise((resolve, reject) => {
    if (goodsId) {
      let data = {
        storeId: wx.getStorageSync('YJF_STORE_ID'),
        userId: wx.getStorageSync('YJF_UERID'),
        goodsId,
        goodsNumber
      }
      if (eventType) {
        data.eventType = eventType
      }
      if (goodsNumber) {
        _postCart(data, resolve, reject)
      } else {
        getGoodsCartById(goodsId).then(num => {
          data.goodsNumber = num + 1
          _postCart(data, resolve, reject)
        })
      }
    } else {
      reject()
    }
  })
}
const _postCart = (data, resolve, reject) => {
  http.post(Api.POST_CART, data, result => {
    if (result.success) {
      wx.hideLoading()
      if (result.data.addSuccess) {
        let newNumber = data.goodsNumber + 1
        wx.showToast({
          title: '加入购物车成功',
          icon: 'success',
          duration: 2000
        })
        resolve(newNumber)
      } else {
        wx.showModal({
          title: '提示',
          content: result.data.addFailureReason,
          showCancel: false,
          confirmText: '知道了'
        })
        reject(result.data.addFailureReason)
      }
    }
  })
}
export default {
  getGoodsCartById,
  goodsJoinInCart,
  getFormId
}