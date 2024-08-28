<script setup lang="ts">
const prop = defineProps({
    stepList: {
        type: Array as () => string[],
        default: () => []
    },
    value: {
        type: Number,
        default: 0
    }
})
</script>

<template>
    <van-steps :active="prop.value" active-icon="success" active-color="#38f">
        
        <van-step v-for="(item,index) in prop.stepList">
            <template #active-icon>
            <div class="w-24 h-24 z-a bg-[#1ECD84] rounded-[999px] flex flex-col items-center justify-center ">
               <h1 class="text-[15px] c-[#FFFFFF]"> {{ index+1 }}</h1>
            </div>
            </template>
            <template #inactive-icon>
            <div class="w-24 h-24 bg-[#e0e0e0] rounded-[999px] flex flex-col items-center justify-center ">
               <h1 class="text-[15px] z-1 c-[#666666]"> {{ index+1 }}</h1>
            </div>
            </template>
            {{ item }}
        </van-step>
    </van-steps>
</template>
<style lang="less">
.icon-text{
width: 7px;
height: 12px;
opacity: 1;
	
font-family: 思源黑体;
font-size: 12px;
font-weight: 500;
line-height: 12px;
letter-spacing: 0em;	
}
</style>