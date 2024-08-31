import request from '@/utils/request'

/**
 * @description: 查询预登记信息根据预登记号
 */
export async function queryPreregisterMessage(params?): Promise<any> {
    return request.post('/api/preregister/queryPreregisterMessage', params)
}

/**
 * @description: 登记维修类型入库
 */
export async function putRepairPreregister(params?): Promise<any> {
    return request.post('/api/preregister/putRepairPreregister', params)
}

/**
 * @description: 登记新到货物
 */
export async function preregisterRegister(params?): Promise<any> {
    return request.post('/api/preregister/preregisterRegister', params)
}

/**
 * @description: 查询登记(分页)
 */
export async function queryPreregister(params?): Promise<any> {
    return request.post('/api/preregister/queryPreregister', params)
}