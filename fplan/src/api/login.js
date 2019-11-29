import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/admin-rest/auth/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/admin-rest/auth/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/admin-rest/auth/info',
    method: 'get',
    params: { token }
  })
}

