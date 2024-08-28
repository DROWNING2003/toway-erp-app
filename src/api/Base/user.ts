import request from '@/utils/request'

/**
 * @description: 用户登录
 */
export async function login(params?): Promise<any> {
    return request.post('/api/users/login',params)
}

/**
 * @description: 获取用户信息
 */
export function getUserInfo(): Promise<any> {
    return request.post('/api/users/getUserInfo');
}
  