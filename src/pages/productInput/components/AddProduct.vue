<script setup>
const show = defineModel('show')
const product = defineModel('Product')

const _upload = reactive({
  IDList: [],
  fileList: [],
  ProductNumber:1
})
</script>
<template>

  <van-popup v-model:show="show" round position="bottom" :style="{ height: '70%' }">
    <div class="flex flex-col w-[100%] h-[100%] justify-center items-center">
      <upload v-model="_upload"></upload>
      <van-stepper v-model="_upload.ProductNumber" step="1" />
    </div>
  </van-popup>
</template>