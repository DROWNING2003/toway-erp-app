<script setup>
import { format, subMonths } from 'date-fns';
import { MdPreview } from 'md-editor-v3';


definePage({
    name: 'fixhistory',
    meta: {
        // level: 2,
        // title: '维修记录',
    },
})

function onBack() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}
const fixhistory = reactive({
    search: {
        searchText: "",
        startTime: format(subMonths(new Date(), 3), "yyyy-MM-dd"),
        endTime: format(new Date(), "yyyy-MM-dd"),
        sortBy:0,
    },
    list:[
        {time:"2024-08-31 11:50",name:"zkp",product:"Y240831001 鼠标 321354656864868",content:"啊伟大伟大伟大"},
        {time:"2024-08-31 11:50",name:"zkp",product:"Y240831001 鼠标 321354656864868",content:"啊伟大伟大伟大"},
        {time:"2024-08-31 11:50",name:"zkp",product:"Y240831001 鼠标 321354656864868",content:"啊伟大伟大伟大"},
        {time:"2024-08-31 11:50",name:"zkp",product:"Y240831001 鼠标 321354656864868",content:"啊伟大伟大伟大"},
        {time:"2024-08-31 11:50",name:"zkp",product:"Y240831001 鼠标 321354656864868",content:"啊伟大伟大伟大"},
    ],
    model: {
        startTime: {
            show: false,
        },
        endTime: {
            show: false,
        }
    },
})
const preview =  computed(()=>{
    var v = ""
    fixhistory.list.forEach(item=>{
        v = v+ `${item.time} \n ${item.product} ${item.name} \n ${item.content}\n___________________________________\n`;
})
    return v
})
</script>

<template>

    <VanNavBar :fixed="true" clickable left-arrow @click-left="onBack">
        <template #title>
            <div class="flex flex-row gap-8">
                <van-search class="search" shape="round" v-model="fixhistory.search.searchText" placeholder="关键字" />
            </div>
        </template>
        <template #right>
            <div class="flex gap-[20px] justify-center items-center">
                <van-image @click="scan" width="16" height="16" src="/productManager/扫码.png" />
                <van-image @click="scan" width="16" height="16" src="/productManager/添加.png" />
            </div>
        </template>
    </VanNavBar>
    <div class="bg-#f2f4f8 flex flex-col gap-10 mx-10 my-[50px]">
        <div class="p-10px flex flex-row gap-20 bg-white rounded-[10px]">
            <a @click="fixhistory.model.startTime.show = true" class="text-15px">开始时间:{{ fixhistory.search.startTime }}
            </a>
            <a @click="fixhistory.model.endTime.show = true" class="text-15px">结束时间:{{ fixhistory.search.endTime }}
            </a>
        </div>
        <van-popup v-model:show="fixhistory.model.startTime.show" position="bottom">
            <van-date-picker :model-value="fixhistory.search.startTime.split('-')" @confirm="({ selectedValues }) => {
                fixhistory.search.startTime = selectedValues.join('-');
                fixhistory.model.startTime.show = false
            }" @cancel="fixhistory.model.startTime.show = false" />
        </van-popup>
        <van-popup v-model:show="fixhistory.model.endTime.show" position="bottom">
            <van-date-picker :model-value="fixhistory.search.endTime.split('-')" @confirm="({ selectedValues }) => {
                fixhistory.search.endTime = selectedValues.join('-');
                fixhistory.model.endTime.show = false
            }" @cancel="fixhistory.model.endTime.show = false" />
        </van-popup>

        <div class="bg-white rounded-[10px] p-10">
            <div class="w-100% flex justify-between">
                维修记录
                <VanRadioGroup direction="horizontal" v-model="fixhistory.search.sortBy">
                    <VanRadio :name="0">只看这台</VanRadio>
                    <VanRadio :name="1">按序列号</VanRadio>
                </VanRadioGroup>
            </div>
            <MdPreview :modelValue="preview" />
        </div>
    </div>

</template>

<style lang="less" scoped>
.search {
    // width: 110px;
    height: 2rem;
    border-radius: 5px;
    opacity: 1;

    /* 纯白 */
    background: #FFFFFF;

}
</style>
