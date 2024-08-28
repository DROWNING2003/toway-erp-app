<script setup>
import { showImagePreview } from 'vant';


const props = defineProps({
  photoUrl: {
    type: String,
    required: true,
  },
  height: {
    type: String,
    default:"70%"
  },
  width: {
    type: String,
    default:"100%"
  },
  waterMark: {
    type: String,
  },
});
const parsedPhotoUrl = computed(() => JSON.parse(props.photoUrl));

const imageProps = computed(() => ({
  previewSrcList: parsedPhotoUrl.value.map(
    (item) => `${import.meta.env.VITE_APP_API_BASE_URL}/api/files/getFile?fileID=${item}`
  ),
}));
</script>
<template>
  <div class="relative">
    <h1 class="text-[#f84444] absolute top-0 right-0 p-6 text-center z-999">{{ props.waterMark!=""?props.waterMark:""}}</h1>
    <van-image @click="()=>{
        showImagePreview(imageProps.previewSrcList)
    }" :width="props.width"  fit="cover" :height="props.height" :src="imageProps.previewSrcList[0]" />
  </div>
</template>