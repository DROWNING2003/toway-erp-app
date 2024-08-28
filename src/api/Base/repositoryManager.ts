import request from '@/utils/request'

/**
 * @description: 查询物料(分页)
 */
export async function queryMateriel(params?): Promise<any> {
    return request.post('/api/repositoryManager/queryMateriel',params)
}

/**
 * @description: 查询物料信息根据物料号
 */
export async function queryProductMessage(params?): Promise<any> {
    return request.post('/api/repositoryManager/queryProductMessage',params)
}