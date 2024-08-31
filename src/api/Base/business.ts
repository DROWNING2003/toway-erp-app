import request from '@/utils/request'

/**
 * @description: 查询客户(分页)
 */
export async function queryCustomer(params?): Promise<any> {
    return request.post('/api//business/queryTempCustomer',params)
}
