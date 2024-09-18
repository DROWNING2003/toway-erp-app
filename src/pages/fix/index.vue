<script setup>
import { queryRepairTaskByApp } from '@/api/Base/fix';

import useAppStore from '@/stores/modules/app';
import { to } from '@/utils/routerUtil';
import { format, subMonths } from 'date-fns';

definePage({
  name: 'fix',
  meta: {
    // level: 2,
    // title: '到货管理',
  },
})
const load = ref(false)

const fixObj = reactive({
  search: {
    searchText: "",//登记号,料号,设备名称,
    startTime: format(subMonths(new Date(), 3), "yyyy-MM-dd"),
    endTime: format(new Date(), "yyyy-MM-dd"),
    active: 0
  },
  model: {
    startTime: {
      show: false,
    },
    endTime: {
      show: false,
    },
    feedback: {
      show: false,
      status: 0,
      statusShow: false,
      message: "",
      columns: [
        { text: '正常', value: 0 },
        { text: '待确认', value: 1 },
        { text: '未修复', value: 2 },
        { text: '继续维修', value: 3 },
      ]
    }
  },
  list: [],
  reload: () => {
    queryRepairTaskByApp({
      page: 1,
      pageSize: 999999,
      startTime: fixObj.search.startTime,
      endTime: fixObj.search.endTime,
      searchKeyword: fixObj.search.searchText,
      status: fixObj.search.active
    }).then(res => {
      if (res.code == 0) {
        fixObj.list = res.data.list
      }
    })
  }
})

const router = useRouter()

watch(fixObj.search, () => {
  fixObj.reload()
})

function onBack() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}

onMounted(() => {
  fixObj.reload()
})

function getLabelByValue(value) {
  // 使用switch语句来匹配值并返回相应的标签
  switch (value) {
    case 0:
      return '客户退换';
    case 1:
      return '客户送修';
    case 2:
      return '客供料';
    case 3:
      return '进货物料';
    case 4:
      return '外修送回';
    case 5:
      return '代工交货';
    case 7:
      return 'PCB';
    case 6:
      return '其他';
    default:
      return '未知'; // 或者根据需要返回其他默认值
  }
}

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
async function scan() {
  const res = await pro.scannerCode()
  fixObj.search.searchText = res
}
</script>

<template>

  <VanNavBar :fixed="true" clickable left-arrow @click-left="onBack">
    <template #title>
      <div class="flex flex-row gap-8">
        <van-search class="search" shape="round" v-model="fixObj.search.searchText" placeholder="登记号/公司/设备名称/SN" />
      </div>


    </template>
    <template #right>
      <div class="flex gap-[20px] justify-center items-center">
        <van-image @click="scan" width="16" height="16" src="/productManager/扫码.png" />
        <van-image @click="scan" width="16" height="16" src="/productManager/添加.png" />
      </div>
    </template>
  </VanNavBar>
  <van-tabs class="bg-#f2f4f8 mt-[43px]" v-model:active="fixObj.search.active">
    <div class="p-10px flex flex-row gap-20 bg-white rounded-[10px] m-10">
      <h1 @click="fixObj.model.startTime.show = true" class="text-15px">开始时间:{{ fixObj.search.startTime }}</h1>
      <h1 @click="fixObj.model.endTime.show = true" class="text-15px">结束时间:{{ fixObj.search.endTime }}</h1>
    </div>
    <van-popup v-model:show="fixObj.model.startTime.show" position="bottom">
      <van-date-picker :model-value="fixObj.search.startTime.split('-')" @confirm="({ selectedValues }) => {
        fixObj.search.startTime = selectedValues.join('-');
        fixObj.model.startTime.show = false
      }" @cancel="fixObj.model.startTime.show = false" />
    </van-popup>
    <van-popup v-model:show="fixObj.model.endTime.show" position="bottom">
      <van-date-picker :model-value="fixObj.search.endTime.split('-')" @confirm="({ selectedValues }) => {
        fixObj.search.endTime = selectedValues.join('-');
        fixObj.model.endTime.show = false
      }" @cancel="fixObj.model.endTime.show = false" />
    </van-popup>

    <van-tab title="全部" class="m-[10px] w-[100vw] flex flex-col gap-[10px]">
      <div v-for="(item, index) in fixObj.list"
        class="bg-white relative gap-10 rounded-[10px] w-[94%] min-h-100 flex flex-col items-center p-10">
        <div name="顶栏" class="w-[100%] flex justify-between">
          <div class="flex flex-row justify-center items-center" name="客户">
            <h1 class="text-12px leading-none m-0">{{ (item.deviceName == '' ? '待补充' : item.deviceName) + "-" +
              (item.brand == '' ? '待补充' : item.brand) }}</h1>
            <van-icon name="arrow" />
          </div>
          <div name="状态">
            <h1 class="leading-none m-0 text-[12px] font-bold color-[#E7845B]">{{ getStatusByValue(item.status) }}</h1>
          </div>
        </div>
        <div class="flex flex-row w-100% gap-10">
          <EImage :width="'80px'" :height="'80px'"
            :photo-url="item.preregisterPhoto == '' ? '[]' : item.preregisterPhoto" />
          <div class="text-12">
            <h1 class="m-0 text-14">{{ item.preregisterNumber }} {{ format(new Date(item.creationDatetime), "hh:mm") }}</h1>
            <h1 class="m-0 text-10 text-[#323131] font-500">{{ item.brand }}-{{ item.deviceName }}</h1>
            <h1 class="m-0 text-10 text-[#323131] font-500">{{item.serialList? JSON.parse(item.serialList)[0]:"" }}</h1>
            <!-- <h1 class="m-0 text-14">Y24083001 14:46</h1> -->
            <VanTag v-if="item.businessType == 2" type="success">
              {{ getBusinessTypeByValue(item.businessType) }}
            </VanTag>
            <VanTag v-if="item.businessType == 1" type="primary">
              {{ getBusinessTypeByValue(item.businessType) }}
            </VanTag>
            <VanTag v-if="item.businessType == 3" type="warning">
              {{ getBusinessTypeByValue(item.businessType) }}
            </VanTag>

          </div>
        </div>

        <p class=" bg-[#FAFAFA] p-5px w-100% ">
          <a class="text-12px font-bold">故障现象:</a>
          <a class="text-12px">{{ item.faultMessage }}</a>
        </p>
        <div class="flex flex-row justify-end w-100% gap-10">
          <VanButton class="w-[90px]" round size="small">详细</VanButton>
          <van-popup id="fu" class="h-50vh bg-[#f2f4f8] flex flex-col p-10 items-center rounded-t-[10px]"
            v-model:show="fixObj.model.feedback.show" position="bottom">
            <div class="w-[100%] p-10">
              结果状态:
              <VanRadioGroup direction="horizontal">
                <VanRadio>正常</VanRadio>
                <VanRadio>未修复</VanRadio>
                <VanRadio>继续维修</VanRadio>
              </VanRadioGroup>
            </div>
            <van-field v-model="fixObj.model.feedback.message" class="rounded-[10px]" rows="2" autosize label="结果反馈"
              type="textarea" maxlength="50" placeholder="结果反馈" show-word-limit />
            <VanButton round color="#235EFF" class="fixed bottom-0 bg-[#235EFF] w-[100%]">确定提交</VanButton>
          </van-popup>
          <VanButton class="w-[90px]" round size="small" @click="to('fixhistory')">维修记录</VanButton>
          <VanButton v-if="item.status != 3 && item.status != 6" class="w-[90px]" color="#E7845B" round size="small"
            @click="to('fixnote?id='+item.preregisterNumber)">维修笔记</VanButton>
          <VanButton v-if="item.status == 3" class="w-[90px]" color="#E7845B" round size="small"
            @click="fixObj.model.feedback.show = true">维修反馈</VanButton>
          <VanButton v-if="item.status == 6" class="w-[90px]" color="#E7845B" round size="small" @click="to('fixnote?id='+item.preregisterNumber)">
            取消外修
          </VanButton>
        </div>
      </div>
    </van-tab>
    <van-tab title="待维修" class="m-[10px] w-[100vw] flex flex-col gap-[10px]">
      <div v-for="(item, index) in fixObj.list"
        class="bg-white relative gap-10 rounded-[10px] w-[94%] min-h-100 flex flex-row items-center p-10">
        <img @click="" block class="absolute right-10 top-10" width="16" height="16" src="/arrive/修改.png" />
        <div>
          <EImage :width="'80px'" :height="'80px'" :photo-url="item.sPhotoUrl == '' ? '[]' : item.sPhotoUrl" />
          <div class="text-12">{{ format(new Date(item.dPreregisterTime), "yyyy-MM-dd") }}</div>
        </div>
        <div class="h-[100%] w-[100%] flex flex-col items-start justify-start">
          <h1 class="text-15px leading-none m-0">{{ (item.sProductName == '' ? '待补充' : item.sProductName) + ":" +
            (item.sProductNo == '' ? '待补充' : item.sProductNo) }}</h1>
          <div class="text-12">{{ item.company?.sName }}</div>
          <div class="text-12">{{ item.customer?.sNameCn ? item.customer?.sNameCn : item.customer?.sNameEn }}</div>
          <VanTag size="medium" color="#fdc71c" class="text-12 rounded-[20px]" type="success">
            {{ getLabelByValue(item.nType) }}</VanTag>
          <div class="w-100% flex justify-end">
            <!-- <VanButton round size="small" type="danger">详细</VanButton> -->
            <VanButton round size="small" type="danger">确认入库</VanButton>

            <!-- <VanButton round size="small" type="danger">确认入库</VanButton> -->
          </div>
        </div>
      </div>
    </van-tab>
    <van-tab title="维修中" class="m-[10px] w-[100vw] flex flex-col gap-[10px]">
      <div v-for="(item, index) in fixObj.list"
        class="bg-white relative gap-10 rounded-[10px] w-[94%] min-h-100 flex flex-row items-center p-10">
        <img @click="" block class="absolute right-10 top-10" width="16" height="16" src="/arrive/修改.png" />
        <div>
          <EImage :width="'80px'" :height="'80px'" :photo-url="item.sPhotoUrl == '' ? '[]' : item.sPhotoUrl" />
          <div class="text-12">{{ format(new Date(item.dPreregisterTime), "yyyy-MM-dd") }}</div>
        </div>
        <div class="h-[100%] w-[100%] flex flex-col items-start justify-start">
          <h1 class="text-15px leading-none m-0">{{ (item.sProductName == '' ? '待补充' : item.sProductName) + ":" +
            (item.sProductNo == '' ? '待补充' : item.sProductNo) }}</h1>
          <div class="text-12">{{ item.company?.sName }}</div>
          <div class="text-12">{{ item.customer?.sNameCn ? item.customer?.sNameCn : item.customer?.sNameEn }}</div>

          <VanTag size="medium" color="#fdc71c" class="text-12 rounded-[20px]" type="success">
            {{ getLabelByValue(item.nType) }}</VanTag>
          <div class="w-100% flex justify-end">
            <!-- <VanButton round size="small" type="danger">详细</VanButton> -->
            <VanButton round size="small" type="danger">确认入库</VanButton>

            <!-- <VanButton round size="small" type="danger">确认入库</VanButton> -->
          </div>
        </div>
      </div>
    </van-tab>
    <van-tab title="已取消" class="m-[10px] w-[100vw] flex flex-col gap-[10px]">
      <div v-for="(item, index) in fixObj.list"
        class="bg-white relative gap-10 rounded-[10px] w-[94%] min-h-100 flex flex-row items-center p-10">
        <img @click="" block class="absolute right-10 top-10" width="16" height="16" src="/arrive/修改.png" />
        <div>
          <EImage :width="'80px'" :height="'80px'" :photo-url="item.sPhotoUrl == '' ? '[]' : item.sPhotoUrl" />
          <div class="text-12">{{ format(new Date(item.dPreregisterTime), "yyyy-MM-dd") }}</div>
        </div>
        <div class="h-[100%] w-[100%] flex flex-col items-start justify-start">
          <h1 class="text-15px leading-none m-0">{{ (item.sProductName == '' ? '待补充' : item.sProductName) + ":" +
            (item.sProductNo == '' ? '待补充' : item.sProductNo) }}</h1>
          <div class="text-12">{{ item.company?.sName }}</div>
          <div class="text-12">{{ item.customer?.sNameCn ? item.customer?.sNameCn : item.customer?.sNameEn }}</div>

          <VanTag size="medium" color="#fdc71c" class="text-12 rounded-[20px]" type="success">
            {{ getLabelByValue(item.nType) }}</VanTag>
          <div class="w-100% flex justify-end">
            <!-- <VanButton round size="small" type="danger">详细</VanButton> -->
            <VanButton round size="small" type="danger">确认入库</VanButton>

            <!-- <VanButton round size="small" type="danger">确认入库</VanButton> -->
          </div>
        </div>
      </div>
    </van-tab>
    <van-tab title="未修复" class="m-[10px] w-[100vw] flex flex-col gap-[10px]">
      <div v-for="(item, index) in fixObj.list"
        class="bg-white relative gap-10 rounded-[10px] w-[94%] min-h-100 flex flex-row items-center p-10">
        <img @click="" block class="absolute right-10 top-10" width="16" height="16" src="/arrive/修改.png" />
        <div>
          <EImage :width="'80px'" :height="'80px'" :photo-url="item.sPhotoUrl == '' ? '[]' : item.sPhotoUrl" />
          <div class="text-12">{{ format(new Date(item.dPreregisterTime), "yyyy-MM-dd") }}</div>
        </div>
        <div class="h-[100%] w-[100%] flex flex-col items-start justify-start">
          <h1 class="text-15px leading-none m-0">{{ (item.sProductName == '' ? '待补充' : item.sProductName) + ":" +
            (item.sProductNo == '' ? '待补充' : item.sProductNo) }}</h1>
          <div class="text-12">{{ item.company?.sName }}</div>
          <div class="text-12">{{ item.customer?.sNameCn ? item.customer?.sNameCn : item.customer?.sNameEn }}</div>

          <VanTag size="medium" color="#fdc71c" class="text-12 rounded-[20px]" type="success">
            {{ getLabelByValue(item.nType) }}</VanTag>
          <div class="w-100% flex justify-end">
            <!-- <VanButton round size="small" type="danger">详细</VanButton> -->
            <VanButton round size="small" type="danger">确认入库</VanButton>

            <!-- <VanButton round size="small" type="danger">确认入库</VanButton> -->
          </div>
        </div>
      </div>
    </van-tab>
  </van-tabs>
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
