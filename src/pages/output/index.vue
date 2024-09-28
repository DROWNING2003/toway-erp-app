<script setup>
import { querySelfDeliver } from '@/api/Base/selfDeliver';


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

const route = useRoute()
const router = useRouter()

const outputObj = reactive({
    info: {},
    issueMethod: "快递",
    waybillNo: "",
    remark: "",
    model: {
        issue: {
            show: false
        }
    },
    reload: () => {
        load.value = true
        querySelfDeliver({
            "page": 1,
            "pageSize": 999999,
            "searchKeyword": route.query.id,
            "type": 0,
            "startTime": "2018-12-17",
            "endTime": "3222-08-18",
            "sendType": 0,
        }).then(res => {
            if (res.code == 0) {
                outputObj.info = res.data.list[0]
                load.value = false
            }
        })
    }
})

onMounted(()=>{
    outputObj.reload()
})

async function scan() {
    const res = await pro.scannerCode()
    outputObj.waybillNo = res
}

function getType(type) {
    switch (type) {
        case 1:
            return '外修'
        case 2:
            return '代工发料'
        case 3:
            return '退货'
        case 4:
            return '未修归还'
        case 5:
            return '其他'
        default:
            break;
    }
}
const load = ref(true)
</script>

<template>
    <van-loading class="mt-200" v-if="load" vertical>
        <template #icon>
          <van-icon name="star-o" size="30" />
        </template>
        加载中...
    </van-loading>
    <div v-else class="py-70 px-20 flex flex-col gap-10">

        <div class="bg-white relative gap-10 rounded-[10px] w-[100%] min-h-100 flex flex-col items-center p-10">
            <div name="顶栏" class="w-[100%] flex justify-between">
                <div name="状态">
                    <h1 class="leading-none m-0 text-[12px] font-bold color-[#E7845B]">未发出</h1>
                </div>
            </div>
            <div class="flex flex-row w-100% gap-10">
                <EImage :width="'80px'" :height="'80px'" :photo-url="outputObj.info.photoList" />
                <div class="text-12">
                    <h1 class="m-0 text-14">{{ outputObj.info.deliverNumber }}</h1>
                    <h1 class="m-0 text-10 text-[#323131] font-500">{{ outputObj.info.productName }}</h1>
                    <h1 class="m-0 text-10 text-[#323131] font-500">数量:{{ outputObj.info.quantity }}</h1>
                    <VanTag type="success">
                        {{ getType(outputObj.info.type) }}
                    </VanTag>

                </div>
            </div>

            <p class=" bg-[#FAFAFA] p-5px w-100% ">
                <a class="text-12px font-bold">收件信息:</a>
                <a class="text-12px">{{ outputObj.info.receiveMessage }}</a>
            </p>
        </div>

        <van-field required class="rounded-[10px] h-[60px] flex items-center" v-model="outputObj.issueMethod" is-link
            readonly label="发出方式 " placeholder="选择发出方式 " @click="outputObj.model.issue = true" />
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
        <van-field v-model="outputObj.remark" class="rounded-[10px]" rows="2" autosize label="详细" type="textarea"
            maxlength="50" placeholder="请输入文字或图片" show-word-limit />
        <StepBottom>
            <template #default>
                <VanButton round color="#235EFF" class="p-10 w-[100%]"> 确定发出</VanButton>
            </template>
        </StepBottom>
    </div>
</template>

<style lang="less" scoped></style>
