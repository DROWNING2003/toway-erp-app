<script setup>
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { ref } from 'vue'
import { useElementBounding } from '@vueuse/core'
import { queryPreregisterMessage } from '@/api/Base/preregister';
const toolbar = ref(null)
const position = useElementBounding(toolbar)

definePage({
    name: 'fixnote',
    meta: {
        level: 2,
        title: '维修笔记',
    },
})

const router = useRouter()
const route = useRoute()
const fixnoteObj = reactive({
    item: {},
    note: "",
    toolbar: false,
    reload: () => {
        loading.value = true
        queryPreregisterMessage({
            "preNumber": route.query.id
        }).then(res => {
            fixnoteObj.item = res.data
            loading.value = false
        })
    }
})

onMounted(() => {
    fixnoteObj.reload()
})
watch(position.bottom, (newValue, oldValue) => {
    if (oldValue > 500 && newValue > 800) {
        fixnoteObj.toolbar = false
        document.activeElement.blur();
    }
})

function getStatusByValue(value) {
    // 使用switch语句来匹配值并返回相应的标签
    switch (value) {
        case 1:
            return '待维修';
        case 2:
            return '维修中';
        case 3:
            return '维修完成';
        case 4:
            return '无法修复';
        case 5:
            return '暂停';
        case 6:
            return '需外修';
        case 7:
            return '外修中';
        case 8:
            return '已取消';
        case 8:
            return '借用参考';
        default:
            return '未知'; // 或者根据需要返回其他默认值
    }
}

function getBusinessTypeByValue(value) {
    // 使用switch语句来匹配值并返回相应的标签
    switch (value) {
        case 1:
            return '正常';
        case 2:
            return '保修';
        case 3:
            return '走账';
        default:
            return '未知'; // 或者根据需要返回其他默认值
    }
}

const loading = ref(true)
</script>

<template>
    <div class="p-10 mt-[43px] bg-white  w-100%">
        <div v-if="!loading" class="h-70vh">
            <div v-if="!fixnoteObj.toolbar"
                class="bg-white relative gap-5 rounded-[10px] w-[100%] min-h-100 flex flex-col items-center p-10">
                <div name="顶栏" class="w-[100%] flex justify-between">
                    <div class="flex flex-row justify-center items-center" name="客户">
                        {{ fixnoteObj.item.company.sName }}-{{
                            fixnoteObj.item.customer.sNameCn ? fixnoteObj.item.customer.sNameCn :
                                fixnoteObj.item.customer.sNameEn
                        }}
                    </div>
                    <div name="状态">
                        <h1 class="leading-none m-0 text-[12px] font-bold color-[#E7845B]">
                            {{ getStatusByValue(fixnoteObj.item.nStatus) }}</h1>
                    </div>
                </div>
                <div class="flex flex-row w-100% gap-10">
                    <EImage :width="'80px'" :height="'80px'"
                        :photo-url="fixnoteObj.item.sPhotoUrl == '' ? '[]' : fixnoteObj.item.sPhotoUrl" />
                    <div class="text-12">
                        <h1 class="m-0 text-14">{{ fixnoteObj.item.sPreregisterNo }}</h1>
                        <h1 class="m-0 text-10 text-[#323131] font-500">
                            {{ fixnoteObj.item.lastRepairRecord.brand }}-{{ fixnoteObj.item.lastRepairRecord.deviceName
                            }}
                        </h1>
                        <h1 class="m-0 text-10 text-[#323131] font-500">
                            {{ JSON.parse(fixnoteObj.item.lastRepairRecord.serialList)[0] }}</h1>

                        <VanTag v-if="fixnoteObj.item.lastRepairRecord.businessType == 2" type="success">
                            {{ getBusinessTypeByValue(fixnoteObj.item.lastRepairRecord.businessType) }}
                        </VanTag>
                        <VanTag v-if="fixnoteObj.item.lastRepairRecord.businessType == 1" type="primary">
                            {{ getBusinessTypeByValue(fixnoteObj.item.lastRepairRecord.businessType) }}
                        </VanTag>
                        <VanTag v-if="fixnoteObj.item.lastRepairRecord.businessType == 3" type="warning">
                            {{ getBusinessTypeByValue(fixnoteObj.item.lastRepairRecord.businessType) }}
                        </VanTag>

                    </div>
                </div>
                <p class=" bg-[#FAFAFA] m-0 p-5 w-100% ">
                    <a class="text-12px font-bold">故障状态:</a>
                    <a class="text-12px">{{ fixnoteObj.item.lastRepairRecord.faultMessage }}</a>
                </p>
            </div>
            <div class="w-100% bg-[#FAFAFA]" :class="fixnoteObj.toolbar ? 'edit' : 'look'" name="维修记录">
                <h1 class="text-14 font-400 m-10px">维修笔记</h1>
                <MdEditor style="border-width: 0px; background-color: #FAFAFA;" @onBlur="() => {
                    fixnoteObj.toolbar = false
                }" @onFocus="() => {
                    fixnoteObj.toolbar = true
                }" class="w-100% border-0 shadow-none bg-[#FAFAFA] p-0" :class="fixnoteObj.toolbar ? 'edit' : 'look'"
                    :footers="[]" :toolbars="[]" :preview="false" v-model="fixnoteObj.note" />
                <div ref="toolbar" name="工具栏" v-if="fixnoteObj.toolbar"
                    class="fixed bottom-0 w-100% p-[30px] border-[#AAAAAA] bg-white box-border border-t-[0.5px] w-100% h-[50px] flex flex-row justify-between">
                    <div class="w-[80px] h-100% flex justify-center items-center">
                        <img block class="" width="25" height="25" src="/note/语音.png" />
                    </div>
                    <div class="w-[80px] h-100% flex justify-center items-center">
                        <img block class="" width="25" height="25" src="/note/图片.png" />
                    </div>
                    <div class="w-[80px] h-100% flex justify-center items-center">
                        <img block class="" width="25" height="25" src="/note/画图.png" />
                    </div>
                    <div class="w-[80px] h-100% flex justify-center items-center">
                        <img block class="" width="25" height="25" src="/note/复选.png" />
                    </div>
                    <div class="w-[80px] h-100% flex justify-center items-center">
                        <img block class="" width="25" height="25" src="/note/文本.png" />
                    </div>
                </div>
            </div>
        </div>
        <van-loading v-if="loading" vertical>
            <template #icon>
                <van-icon name="star-o" size="30" />
            </template>
            加载中...
        </van-loading>
        <StepBottom v-show="!fixnoteObj.toolbar" v-model="inputData">
            <template #default>
                <div>
                    <span class="step-bottom-h2" @click="() => {
                        // input.value.step+=1
                        console.log(inputData.value--);
                        console.log(inputData.value);

                    }">返回上一步</span>
                </div>

                <el-button class="step-bottom-button flex flex-col justify-center items-center text-white" @click="() => {
                }">保存笔记</el-button>
            </template>
        </StepBottom>
    </div>
</template>

<style lang="less" scoped>
.edit {
    height: 380px;
}

.look {
    height: 500px;
}
</style>
