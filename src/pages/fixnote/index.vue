<script setup>
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { ref } from 'vue'
import { useElementBounding } from '@vueuse/core'
const toolbar = ref(null)
const position = useElementBounding(toolbar)

definePage({
    name: 'fixnote',
    meta: {
        level: 2,
        title: '维修笔记',
    },
})
const fixnoteObj = reactive({
    note: "",
    toolbar: false
})
var first = false
watch(position.bottom, (newValue, oldValue) => {
    // console.log(oldValue, "<----->", newValue);
    // console.log(oldValue != newValue, oldValue > 500, "<----->", newValue > 800);
    if (oldValue > 500 && newValue > 800) {
        fixnoteObj.toolbar = false
        document.activeElement.blur();
    }
})
</script>

<template>
    <div class="p-10 mt-[43px] bg-white  w-100%">
        <div class="h-70vh">
            <div v-if="!fixnoteObj.toolbar"
                class="bg-white relative gap-5 rounded-[10px] w-[100%] min-h-100 flex flex-col items-center p-10">
                <div name="顶栏" class="w-[100%] flex justify-between">
                    <div class="flex flex-row justify-center items-center" name="客户">
                        客户公司-为家国
                    </div>
                    <div name="状态">
                        <h1 class="leading-none m-0 text-[12px] font-bold color-[#E7845B]">维修中</h1>
                    </div>
                </div>
                <div class="flex flex-row w-100% gap-10">
                    <EImage :width="'80px'" :height="'80px'" :photo-url="'[]'" />
                    <div class="text-12">
                        <h1 class="m-0 text-14">Y24083001 14:46</h1>
                        <h1 class="m-0 text-10 text-[#323131] font-500">G502鼠标</h1>
                        <h1 class="m-0 text-10 text-[#323131] font-500">32355354684384353</h1>
                        <!-- <h1 class="m-0 text-14">Y24083001 14:46</h1> -->
                        <VanTag type="success">
                            保修
                        </VanTag>

                    </div>
                </div>
                <p class=" bg-[#FAFAFA] m-0 p-5 w-100% ">
                    <a class="text-12px font-bold">故障状态:</a>
                    <a class="text-12px">鼠标漂移</a>
                </p>
            </div>
            <div class="w-100% bg-[#FAFAFA]" :class="fixnoteObj.toolbar ? 'edit' : 'look'" name="维修记录">
                <h1 class="text-14 font-400 m-10px">维修笔记{{position.bottom}}{{fixnoteObj.toolbar}}</h1>
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
