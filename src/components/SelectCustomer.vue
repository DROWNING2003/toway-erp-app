<script setup>
import { queryCustomer } from '@/api/Base/business';

const show = defineModel("show", {
    default: true
})
const customer = defineModel("customer", {
    default: {}
})
const selectCustomer = reactive({
    name: "",
    list: [],
    reload: () => {
        queryCustomer({
            "page": 1,
            "pageSize": 999999999
        }).then(res => {
            if (res.code == 0) {
                selectCustomer.list = res.data.list
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
onMounted(()=>{
    selectCustomer.reload()
})
</script>

<template>
    <van-popup class="h-50vh flex flex-col gap-10" teleport="#app" v-model:show="show" round position="bottom">
        <!-- <van-picker :columns="columns" @cancel="inputData.showType = false" @confirm="onConfirm" /> -->
        <van-search @search="selectCustomer.reload" @cancel="selectCustomer.list = []" v-model="selectCustomer.name"
            placeholder="请输入客户姓名" />
        <div class="h-[100%] flex flex-col gap-10 overflow-y-scroll bg-[#f2f4f8] p-10 w-100% rounded-[10px]">

            <div class="border bg-white gap-10 rounded-[10px] p-10 flex" v-for="(item, index) in selectCustomer.list"
                :key="index">
              
                <van-checkbox @click="() => {
                    customer = item
                    show = false
                    
                }" v-model="item.check" class="rounded-full"></van-checkbox>
                <div>
                    <!-- {{ item }} -->
                    <h1 class="text-[14px] leading-[0px] mx-0 text">{{ item.companySName }}</h1>
                    <div class="flex items-center gap-10">
                        <div class="text-[12px]">{{ item.sNameCn ? item.sNameCn : item.sNameEn }}</div>
                        <h1 class="text-[12px] text-dark">{{ connect(item) }}</h1>
                    </div>
                    <div class="text-[14px]">{{ item.departmentName }}</div>
                </div>
            </div>

        </div>
    </van-popup>
</template>
<style lang="less"></style>