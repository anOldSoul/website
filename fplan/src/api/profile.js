import request from '@/utils/request'

export function changePassword(data) {
  return request({
    url: '/admin/profile/password',
    method: 'post',
    data
  })
}
