<script setup>
import { uploadFile } from '@/api/file/file';

const upload = defineModel()
function UploadFile(file) {
    return new Promise((rev, rej) => {
        uploadFile(file.file)
            .then((res) => {
                upload.value.IDList.push(res.data.fileid);
                rev(res)
            })
            .catch((error) => rej(error));
    })
}
</script>
<template>
    <van-uploader capture="camera" preview-size="10rem" v-model="upload.fileList" multiple :after-read="UploadFile" />
</template>