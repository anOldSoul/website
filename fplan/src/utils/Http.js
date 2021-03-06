import axios from 'axios'
import dotProp from 'dot-prop'
import { Loading, MessageBox } from 'element-ui'
import store from '../store'
import router from '../router'
import { removeToken } from '@/utils/auth'
let env
if (window.location.hostname === 'noah-tax.charmdeer.com') {
  env = 'prod'
} else if (window.location.hostname.indexOf('feat') > -1) {
  env = 'feat'
} else {
  env = 'dev'
}
// env = 'feat'
let baseURL
switch (env) {
  case 'prod':
    baseURL = 'https://noah-tax.charmdeer.com/services'
    break
  case 'feat':
    baseURL = 'http://139.196.174.134/services-ed0edaf138'
    break
  case 'dev':
    baseURL = 'https://admin.openn.cn:8780'
    break
}
axios.defaults.withCredentials = true

axios.interceptors.request.use(function(config) {
  config.headers.Authorization = `Bearer ${localStorage.getItem('name')}`
  return config
})
axios.interceptors.response.use(function(response) {
  return response
}, function(error) {
  // Do something with response error
  return Promise.reject(error)
})

const Http = {
  baseURL: baseURL,
  env: env,
  header: {
    'Content-Type': 'application/json; charset=utf-8'
  },
  upload(data, qiniuToken) {
    const url = 'https://up.qbox.me/?token=' + qiniuToken
    return axios({
      method: 'post',
      url: url,
      data: data
    })
  },
  /**
   * 程序中请求数据用此方法
   * @param  {array}   api  Apis中的数据
   * @param  {object}   data     传参
   * @param  {Function} callback 回调函数
   * @return {[type]}
   */
  request(api, data, callback, errCallback) {
    const loading = Loading.service({
      lock: true,
      text: '拼命加载中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    if (api instanceof Array) {
      var reqBody = {}

      var reqBodyKeys = Object.keys(data)
      reqBodyKeys.forEach(function(item) {
        if (data[item] !== '') {
          reqBody[item] = data[item]
        } else {
          reqBody[item] = null
        }
      })
      const method = api[0]
      const req = {
        method: method,
        url: api[1],
        baseURL: baseURL,
        headers: this.header,
        transformRequest: [function(data, headers) {
          // Do whatever you want to transform the data
          return JSON.stringify(data)
        }]
      }
      if (method === 'get') {
        req.params = reqBody
      } else {
        if (data.constructor === Array) {
          req.data = data
        } else {
          req.data = reqBody
        }
      }
      return axios(req).then(function(res) {
        loading.close()
        if (res.data && res.data.errno) {
          if (data.errCallBack) {
            callback(res.data)
          }
          if (res.data.errno === 506) {
            MessageBox.alert('登录超时，请重新登录', '错误', {
              confirmButtonText: '确定',
              type: 'error',
              callback: action => {
                store.commit('SET_TOKEN', '')
                store.commit('SET_ROLES', [])
                store.commit('SET_PERMS', [])
                removeToken()
                router.replace({
                  path: '/login'
                })
              }
            })
          }
        } else if (callback) {
          callback(res.data)
        }
      }).catch(function(err) {
        loading.close()
        const message = dotProp.get(err, 'errmsg')
        const status = dotProp.get(err, 'response.status')
        if (message) {
          Site.app.$notify.error(err.response.data.message)
        } else {
          Site.app.$notify.error('接口报错-' + status)
        }
        if (errCallback) {
          errCallback()
        }
      })
    }
  },
  asyncrequest(method, api, data) {
    var reqBody = {}

    var reqBodyKeys = Object.keys(data)
    reqBodyKeys.forEach(function(item) {
      if (data[item] !== '') {
        reqBody[item] = data[item]
      }
    })
    const req = {
      method: method,
      url: api,
      baseURL: baseURL,
      headers: this.header,
      transformRequest: [function(data, headers) {
        return JSON.stringify(data)
      }]
    }
    if (method === 'get') {
      req.params = reqBody
    } else {
      req.data = reqBody
    }
    return axios(req)
  },
  get(api, data, callback, errCallback) {
    this.request(['get', api], data, callback, errCallback)
  },
  post(api, data, callback, errCallback) {
    this.request(['post', api], data, callback, errCallback)
  },
  patch(api, data, callback, errCallback) {
    this.request(['patch', api], data, callback, errCallback)
  },
  put(api, data, callback, errCallback) {
    this.request(['put', api], data, callback, errCallback)
  },
  delete(api, data, callback, errCallback) {
    this.request(['delete', api], data, callback, errCallback)
  }
}
export default Http
