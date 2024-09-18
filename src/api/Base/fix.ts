import request from '@/utils/request'

/**
 * @description: 查询维修任务(APP端)(分页)
 */
export async function queryRepairTaskByApp(params?): Promise<any> {
    return request.post('/api/queryRepairTaskByApp', params)
}