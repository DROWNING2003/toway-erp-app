import request from '@/utils/request'

/**
 * @description: 查询PCB列表(分页)
 */
export async function queryPurchasePCB(params?): Promise<any> {
    return request.post('/api/data/queryPurchasePCB', params)
}