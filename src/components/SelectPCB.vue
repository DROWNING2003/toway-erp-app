<script setup>
import { queryCustomer } from '@/api/Base/business';
import { queryPurchase } from '@/api/Base/purchase';
import EImage from './EImage.vue';
import { format } from 'date-fns';
import { queryPurchasePCB } from '@/api/Base/PCB';

const show = defineModel("show", {
    default: true
})
const PCB = defineModel("PCB", {
    default: {}
})
const selectPCB = reactive({
    name: "",
    list: [],
    reload: () => {
        //TODO:无限屏
        queryPurchasePCB({
            "page": 1,
            "pageSize": 99999,
            "searchNameOrSpec": "",
            "searchProductNo": "",
            "searchOriginType": "",
            "startTime": "2018-12-01 06:58:37",
            "endTime": "1982-12-11 02:42:13",
            "status": null,
            "type": null
        }).then(res => {
            if (res.code == 0) {
                selectPurchase.list = res.data.list
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

</script>

<template>
    <van-popup teleport="#app" v-model:show="show" round position="bottom">
        <!-- <van-picker :columns="columns" @cancel="inputData.showType = false" @confirm="onConfirm" /> -->
        <van-search @search="selectPurchase.reload" @cancel="selectPurchase.list = []" v-model="selectPurchase.name"
            placeholder="请输入采购单关键字" />
        <div class="h-[60%] gap-10 flex flex-col overflow-y-scroll bg-[#f2f4f8] p-10 w-100% rounded-[10px]">

            <div class="border bg-white gap-10 rounded-[10px] p-10 flex" v-for="(item, index) in selectPurchase.list"
                :key="index">

                <van-checkbox @click="() => {
                    procurement = item
                    show = false
                }" class="rounded-full"></van-checkbox>
                <EImage :width="'100px'" :photo-url="item.sPhotoUrl" />
                <div>
                    <!-- {{ item }} -->
                    <h1 class="text-[14px] leading-[0px] mx-0 text">{{ item.sPurchaseName }}</h1>
                    <div class="flex items-center gap-10">
                        <div class="text-[12px]">{{ item.sPurchaseNumber }}</div>
                        <div class="text-[12px]">{{ item.sProductNo }}</div>

                    </div>
                    <div class="text-[14px]">{{ item.submit_employee.sName }} <VanTag type="primary"> {{
                        item.nOriginType == 1
                            ? '订单'
                            : item.nOriginType == 2
                                ? '维修'
                                : item.nOriginType == 3
                                    ? '开发'
                                    : item.nOriginType == 4
                                        ? '常规备货'
                                        : '未知来源' }}</VanTag>
                    </div>
                    <div class="text-[14px]">采购数量:{{ item.nPurchaseQuantity }}</div>
                    <div class="text-[14px]">到达数量:{{ item.nArrivalQuantity }}</div>

                    <h1 class="text-[12px]">{{ format(new Date(item.dCreateDatetime), "yyyy-MM-dd") }}</h1>
                </div>
            </div>

        </div>
    </van-popup>
</template>
<style lang="less"></style>