import request from '@/utils/request'

/**
 * @description: 上传文件
 */
export async function uploadFile(params?): Promise<any> {
    return request.request({
        headers: {
            'Content-Type': 'multipart/form-data'
          },
          url: `/files/uploadFile`,
          method: 'POST',
          data: {
            "file": params
          }
    })
    // return request.post('/files/uploadFile', {"file": params }, {
    //     headers: {
    //         'Content-Type': 'multipart/form-data'
    //     },
    // })
}
