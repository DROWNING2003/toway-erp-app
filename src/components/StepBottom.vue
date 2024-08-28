<script setup lang="ts">
// interface Input{
//     total:number;
//     step:number;
// }
// const input = defineModel()



</script>

<template>
    <div class="step-bottom fixed bottom-0 flex flex-row justify-between p-[30px] items-center">
        <slot name="default">
        </slot>
        <!-- <div>
            <span class="step-bottom-h2">共{{input.total}}件</span>
        </div>
        <el-button class="step-bottom-button flex flex-col justify-center items-center text-white" @click="()=>{
            // input.value.step+=1
            console.log(input.value++);
            console.log(input.value);
            
        }">下一步</el-button> -->
    </div>
</template>
<style lang="less">
.step-bottom {
    left: 0px;
    right: 0px;
    // width: 375px;
    height: 72px;
    border-radius: 10px 10px 0px 0px;
    opacity: 1;

    /* 纯白 */
    background: #FFFFFF;
}

.step-bottom-h2 {

    font-family: 思源黑体;
    font-size: 12px;
    font-weight: normal;
    line-height: 12px;
    letter-spacing: 0em;

    /* 333 */
    color: #333333;
}
.step-bottom-button{
width: 130px;
height: 36px;
border-radius: 18px;
opacity: 1;
	
/* 主色 */
background: #235EFF;
	
}
</style>