import request from '@/utils/request'

/**
 * @description: 查询预登记信息根据预登记号
 */
export async function queryPreregisterMessage(params?): Promise<any> {
    return request.post('/api/preregister/queryPreregisterMessage', params)
}
