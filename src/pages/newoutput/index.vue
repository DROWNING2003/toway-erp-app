<script setup>

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
    issueMethod:"",
    waybillNo: "",
    remark: "",
    other:"",
    model: {
        issue: {
            show: false
        },
        selectFix:{
            show:false,
            item:{}
        },
        selectWork:{
            show:false,
            item:{}
        },
        selectPurchase:{
            show:false,
            item:{}
        }
    }
})
</script>

<template>
    <div class="py-70 px-20 flex flex-col gap-10">
        <van-field required class="rounded-[10px] h-[60px] flex items-center" v-model="newoutputObj.issueMethod" is-link readonly
            label="发货类型 " placeholder="选择发货类型 " @click="newoutputObj.model.issue = true" />
        <van-popup teleport="#app" v-model:show="newoutputObj.model.issue" round position="bottom">
            <van-picker :columns="columns" @cancel="newoutputObj.model.issue = false" @confirm="({ selectedOptions }) => {
                newoutputObj.model.issue = false;
                newoutputObj.issueMethod = selectedOptions[0].text;
            }" />
        </van-popup>
        <van-field v-model="newoutputObj.receiptInfo" class="rounded-[10px]" rows="2" autosize label="收件信息"
            type="textarea" maxlength="50" placeholder="请输入收件信息" show-word-limit />
        <van-field class="rounded-[10px] h-[60px] flex items-center"
          v-model="newoutputObj.model.selectFix.item" is-link readonly label="绑定维修"
          placeholder="维修" @click="newoutputObj.model.selectFix.show = true" />
        <!-- <SelectCustomer v-model:customer="ProductInputObj.model.SelectCustomer.customer"
          v-model:show="ProductInputObj.model.SelectCustomer.show" /> -->
            <StepBottom>
            <template #default>
                <VanButton round color="#235EFF" class="p-10 w-[100%]"> 确定新建</VanButton>
            </template>
        </StepBottom>
    </div>
</template>

<style lang="less" scoped></style>
