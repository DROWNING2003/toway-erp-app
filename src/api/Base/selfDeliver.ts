import request from '@/utils/request'

/**
 * @description: 创建自主发货(分页)
 */
export async function createSelfDeliver(params?): Promise<any> {
    return request.post('/api/selfDeliver/createSelfDeliver',params)
}

/**
 * @description: 查询自主发货列表(分页)
 */
export async function querySelfDeliver(params?): Promise<any> {
    return request.post('/api/selfDeliver/querySelfDeliver',params)
}

/**
 * @description: 创建自主备货工单
 */
export async function createSelfStocking(params?): Promise<any> {
    return request.post('/api/workOrder/createSelfStocking',params)
}