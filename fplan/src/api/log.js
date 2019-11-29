import request from '@/utils/request'

export function listLog(query) {
  return request({
    url: '/admin/log/queryByPage',
    method: 'get',
    params: query
  })
}
