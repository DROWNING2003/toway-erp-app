<script setup>
import { queryCustomer } from '@/api/Base/business';
import { queryRepairTaskByApp } from '@/api/Base/fix';
import { format } from 'date-fns';

const show = defineModel("show", {
    default: true
})
const fix = defineModel("fix", {
    default: {}
})
const selectFix = reactive({
    name: "",
    list: [],
    reload: () => {
        queryRepairTaskByApp({
            "page": 1,
            "pageSize": 9999999,
            "searchKeyword": selectFix.name,
            "status": 0,
            "startTime": "1975-06-11",
            "endTime": "9999-01-11"
        }).then(res => {
            if (res.code == 0) {
                selectFix.list = res.data.list
            }
        })
    }
})

function connect(item) {
    if (item.sMobilePhone1) {//电话
        return item.sMobilePhone1
    }
    if (item.sMobilePhone2) {//电话
        return item.sMobilePhone2
    }
    if (item.sLinePhone) {//座机
        return item.sLinePhone
    }
    if (item.sWorkMail) {//工作邮箱
        return item.sWorkMail
    }
    if (item.sPersonalMail) {//个人邮箱
        return item.sPersonalMail
    }
}
onMounted(() => {
    selectFix.reload()
})
</script>

<template>
    <van-popup class="h-50vh flex flex-col gap-10" teleport="#app" v-model:show="show" round position="bottom">
        <!-- <van-picker :columns="columns" @cancel="inputData.showType = false" @confirm="onConfirm" /> -->
        <van-search @search="selectFix.reload" @cancel="selectFix.list = []" v-model="selectFix.name"
            placeholder="搜索登记号/公司/设备名称/sn" />
        <div class="h-[100%] flex flex-col gap-10 overflow-y-scroll bg-[#f2f4f8] p-10 w-100% rounded-[10px]">

            <div class="border bg-white gap-10 rounded-[10px] p-10 flex" v-for="(item, index) in selectFix.list"
                :key="index">

                <van-checkbox @click="() => {
                    fix = item
                    show = false

                }" v-model="item.check" class="rounded-full"></van-checkbox>
                <div>
                    <div class="text-[14px]">{{ item.preregisterNumber  }}</div>
                    <div class="text-[14px]">{{ item.status  }}</div>
                    <div class="text-[14px]">{{ format(new Date(item.creationDatetime),"yyyy-MM-dd") }}</div>
                    <h1 class="text-[14px] leading-[0px] mx-0 text">{{ item.deviceName }}-{{ item.brand }}</h1>
                    <div class="flex items-center gap-10">
                        <div class="text-[12px]">{{ item.customer.sNameCn ? item.customer.sNameCn : item.customer.sNameEn }}</div>
                        <h1 class="text-[12px] text-dark">{{ connect(item.customer) }}</h1>
                    </div>
                    
                    <div class="text-[14px]">{{ item.departmentName }}</div>
                </div>
            </div>

        </div>
    </van-popup>
</template>
<style lang="less"></style>