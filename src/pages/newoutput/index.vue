<script setup>
import { createSelfDeliver } from '@/api/Base/selfDeliver';


definePage({
    name: 'newoutput',
    meta: {
        level: 2,
        title: '新建发货',
    },
})

const columns = [
    { text: '外修', value: 0 },
    { text: '代工发料', value: 1 },
    { text: '退货', value: 2 },
    { text: '未修归还', value: 3 },
    { text: '其他', value: 4 },
];

const newoutputObj = reactive({
    receiptInfo: "",
    Product: {
        photoList: [],
        quantity: 0,
    },
    issueMethod: "",
    waybillNo: "",
    remark: "",
    other: "",
    model: {
        issue: {
            show: false
        },
        selectFix: {
            show: false,
            item: {}
        },
        selectWork: {
            show: false,
            item: {}
        },
        selectPurchase: {
            show: false,
            item: {}
        }
    }
})
function create() {
    createSelfDeliver({
        photoList: newoutputObj.Product.photoList,
        quantity: newoutputObj.Product.quantity,
        type: getType(newoutputObj.issueMethod), //类型:1外修2:代工发料3:退货4:未修归还5:其他
        productNo: getNO(newoutputObj.issueMethod),//对应单号,跟随类型变化
        receiveMessage: newoutputObj.other
    })
}

function getType(type) {
    switch (type) {
        case '外修':
            return 1
        case '代工发料':
            return 2
        case '退货':
            return 3
        case '未修归还':
            return 4
        case '其他':
            return 5
        default:
            break;
    }
}

function getNO(type) {
    switch (type) {
        case '外修':
            return newoutputObj.model.selectFix.item.repairId
        case '代工发料':
            return 2
        case '退货':
            return 3
        case '未修归还':
            return newoutputObj.model.selectFix.item.repairId
        case '其他':
            return 5
        default:
            break;
    }
}
</script>

<template>
    <div class="py-70 px-20 flex flex-col gap-10">
        <div name="图片" class="flex flex-col w-[100%] h-[100%] bg-white relative p-10">
            <a class="text-12">登记图片</a>
            <EImageList v-model:photoList="newoutputObj.Product.photoList" />
            <van-stepper class="absolute bottom-0 right-10px" v-model="newoutputObj.Product.quantity" />
        </div>
        <van-field required class="rounded-[10px] h-[60px] flex items-center" v-model="newoutputObj.issueMethod" is-link
            readonly label="发货类型 " placeholder="选择发货类型 " @click="newoutputObj.model.issue = true" />
        <van-popup teleport="#app" v-model:show="newoutputObj.model.issue" round position="bottom">
            <van-picker :columns="columns" @cancel="newoutputObj.model.issue = false" @confirm="({ selectedOptions }) => {
                newoutputObj.model.issue = false;
                newoutputObj.issueMethod = selectedOptions[0].text;
            }" />

        </van-popup>
        <van-field v-model="newoutputObj.receiptInfo" class="rounded-[10px]" rows="2" autosize label="收件信息"
            type="textarea" maxlength="50" placeholder="请输入收件信息" show-word-limit />
        <van-field v-if="['外修', '未修归还'].includes(newoutputObj.issueMethod)"
            class="rounded-[10px] h-[60px] flex items-center"
            v-model="newoutputObj.model.selectFix.item.repairId" is-link readonly label="绑定维修" placeholder="维修"
            @click="newoutputObj.model.selectFix.show = true" />
        <SelectFix v-model:fix="newoutputObj.model.selectFix.item" v-model:show="newoutputObj.model.selectFix.show" />

        <van-field v-if="['代工发料'].includes(newoutputObj.issueMethod)" class="rounded-[10px] h-[60px] flex items-center"
            v-model="newoutputObj.model.selectWork.item" is-link readonly label="绑定工单" placeholder="工单"
            @click="newoutputObj.model.selectWork.show = true" />

        <van-field v-if="['退货'].includes(newoutputObj.issueMethod)" class="rounded-[10px] h-[60px] flex items-center"
            v-model="newoutputObj.model.selectPurchase.item.sPurchaseNumber" is-link readonly label="对应采购" placeholder="采购"
            @click="newoutputObj.model.selectPurchase.show = true" />
        <SelectProcurement v-model:procurement="newoutputObj.model.selectPurchase.item"
            v-model:show="newoutputObj.model.selectPurchase.show" />

        <van-field v-if="['其他'].includes(newoutputObj.issueMethod)" v-model="newoutputObj.other" class="rounded-[10px]"
            rows="2" autosize label="其它" type="textarea" maxlength="50" placeholder="其他" show-word-limit />
        <StepBottom>
            <template #default>
                <VanButton round color="#235EFF" class="p-10 w-[100%]" @click="create"> 确定新建</VanButton>
            </template>
        </StepBottom>
    </div>
</template>

<style lang="less" scoped></style>
    