import request from '@/utils/request'

/**
 * @description: 上传文件
 */
export async function uploadFile(params?): Promise<any> {
    return request.post('/api/files/uploadFile', {
        "file": params
    },
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    )
}
