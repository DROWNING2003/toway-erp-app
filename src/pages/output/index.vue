<script setup>

definePage({
    name: 'output',
    meta: {
        level: 2,
        title: '发出',
    },
})

const columns = [
    { text: '快递', value: 0 },
    { text: '自主配送', value: 1 },
    { text: '收方自取', value: 2 },
];

const outputObj = reactive({
    issueMethod: "快递",
    waybillNo:"",
    remark:"",
    model: {
        issue: {
            show: false
        }
    }
})

async function scan() {
  const res = await pro.scannerCode()
  outputObj.waybillNo = res
}
</script>

<template>
    <div class="py-70 px-20 flex flex-col gap-10">
        <div class="bg-white relative gap-10 rounded-[10px] w-[100%] min-h-100 flex flex-col items-center p-10">
            <div name="顶栏" class="w-[100%] flex justify-between">
                <div class="flex flex-row justify-center items-center" name="客户">
                    <!-- <h1 class="text-12px leading-none m-0">{{ (item.sProductName == '' ? '待补充' : item.sProductName) + "-" +
              (item.sProductNo == '' ? '待补充' : item.sProductNo) }}</h1> -->
                    <h1 class="text-12px leading-none m-0">待补充-待补充</h1>
                    <van-icon name="arrow" />
                </div>
                <div name="状态">
                    <h1 class="leading-none m-0 text-[12px] font-bold color-[#E7845B]">未发出</h1>
                </div>
            </div>
            <div class="flex flex-row w-100% gap-10">
                <EImage :width="'80px'" :height="'80px'" :photo-url="'[]'" />
                <div class="text-12">
                    <h1 class="m-0 text-14">Y24083001 14:46</h1>
                    <h1 class="m-0 text-10 text-[#323131] font-500">G502鼠标</h1>
                    <h1 class="m-0 text-10 text-[#323131] font-500">数量:1</h1>
                    <!-- <h1 class="m-0 text-14">Y24083001 14:46</h1> -->
                    <VanTag type="success">
                        退货
                    </VanTag>

                </div>
            </div>

            <p class=" bg-[#FAFAFA] p-5px w-100% ">
                <a class="text-12px font-bold">收件信息:</a>
                <a class="text-12px">深圳市武进区</a>
            </p>
        </div>

        <van-field required class="rounded-[10px] h-[60px] flex items-center" v-model="outputObj.issueMethod" is-link readonly
            label="发出方式 " placeholder="选择发出方式 " @click="outputObj.model.issue = true" />
        <van-popup teleport="#app" v-model:show="outputObj.model.issue" round position="bottom">
            <van-picker :columns="columns" @cancel="outputObj.model.issue = false" @confirm="({ selectedOptions }) => {
                outputObj.model.issue = false;
                outputObj.issueMethod = selectedOptions[0].text;
            }" />
        </van-popup>

        <van-field required class="rounded-[10px]" v-model="outputObj.waybillNo" label="运单号" placeholder="请输入运单号">
            <template #button>
              <div>
                <img @click="scan()" block width="16" height="16" src="/input/扫码.png" />
              </div>
            </template>
        </van-field>
        <van-field v-model="outputObj.remark" class="rounded-[10px]" rows="2" autosize
        label="详细" type="textarea" maxlength="50" placeholder="请输入文字或图片" show-word-limit />
        <StepBottom>
            <template #default>
                <VanButton round color="#235EFF" class="p-10 w-[100%]"> 确定发出</VanButton>
            </template>
          </StepBottom>
    </div>
</template>

<style lang="less" scoped></style>
