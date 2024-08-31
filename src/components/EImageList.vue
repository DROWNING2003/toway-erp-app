<script setup>
import { uploadFile } from '@/api/Base/file';
import { showImagePreview } from 'vant';
async function photo() {
    const base64 = await pro.openCamera();
    //TODO:图片处理
    const data = window.atob(base64);
    const ia = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
        ia[i] = data.charCodeAt(i);
    }
    const file = new File([ia], "打标.png", { type: "image/png" });
    uploadFile(file).then(res => {
        if (res.code == 0) {
            photoList.value.push(res.data.fileid)
        }
    })
}
const photoList = defineModel("photoList", {
    default: []
})
const props = defineProps({
    height: {
        type: String,
        default: "100px"
    },
    width: {
        type: String,
        default: "100px"
    },
});

const imageProps = computed(() => ({
    previewSrcList: photoList.value.map(
        (item) => `${import.meta.env.VITE_APP_API_BASE_URL}/api/files/getFile?fileID=${item}`
    ),
}));
</script>
<template>
    <div class="flex flex-row gap-10 relative flex-wrap">
        <div class="relative" v-for="(item, index) in photoList" :key="index">
            <van-icon @click="() => {
                photoList.splice(index, 1)
            }" class="absolute right-0 top-0 z-9999" color="#ee0a24" name="clear" />
            <van-image :icon-size="props.width" @click="() => {
                showImagePreview(imageProps.previewSrcList, index)
            }" :width="props.width" fit="cover" :height="props.height" :src="imageProps.previewSrcList[index]" />
        </div>
        <div class="flex justify-center items-center w-[100px] h-[100px] bg-coolgray-100">
            <img @click="photo()" block width="80" height="60" src="/input/拍照.png" />
        </div>
    </div>
</template>