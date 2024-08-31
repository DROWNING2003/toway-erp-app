import request from '@/utils/request'

/**
 * @description: 查询采购列表(分页)
 */
export async function queryPurchase(params?): Promise<any> {
    return request.post('/api/purchase/queryPurchase', params)
}