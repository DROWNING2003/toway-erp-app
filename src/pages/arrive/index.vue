<script setup>
import { queryPreregisterApp } from '@/api/Base/preregister';
import useAppStore from '@/stores/modules/app';
import { to } from '@/utils/routerUtil';
import { format, subMonths } from 'date-fns';

definePage({
  name: 'arrive',
  meta: {
    // level: 2,
    // title: '到货管理',
  },
})
const load = ref(false)

const arriveObj = reactive({
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
    }
  },
  list: [],
  reload: () => {
    queryPreregisterApp({
      page: 1,
      pageSize: 999999,
      startTime: arriveObj.search.startTime,
      endTime: arriveObj.search.endTime,
      keyword: arriveObj.search.searchText,
      status: arriveObj.search.active
    }).then(res => {
      if (res.code == 0) {
        arriveObj.list = res.data.list
      }
    })
  }
})

const router = useRouter()

watch(arriveObj.search, () => {
  arriveObj.reload()
})

function onBack() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}

onMounted(() => {
  arriveObj.reload()
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

async function scan() {
  const res = await pro.scannerCode()
  arriveObj.search.searchText = res
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

</script>

<template>

  <VanNavBar :fixed="true" clickable left-arrow @click-left="onBack">
    <template #title>
      <div class="flex flex-row gap-8">
        <van-search class="search" shape="round" v-model="arriveObj.search.searchText" placeholder="请输入品名/料号/登记号" />
      </div>


    </template>
    <template #right>
      <div class="flex justify-center items-center">
        <van-image @click="scan" width="16" height="16" src="/productManager/扫码.png" />
      </div>
    </template>
  </VanNavBar>
  <van-tabs class="bg-#f2f4f8 mt-[43px]" v-model:active="arriveObj.search.active">
    <div class="p-10px flex flex-row gap-20 bg-white rounded-[10px] m-10">
      <h1 @click="arriveObj.model.startTime.show = true" class="text-15px">开始时间:{{ arriveObj.search.startTime }}</h1>
      <h1 @click="arriveObj.model.endTime.show = true" class="text-15px">结束时间:{{ arriveObj.search.endTime }}</h1>
    </div>
    <van-popup v-model:show="arriveObj.model.startTime.show" position="bottom">
      <van-date-picker :model-value="arriveObj.search.startTime.split('-')" @confirm="({ selectedValues }) => {
        arriveObj.search.startTime = selectedValues.join('-');
        arriveObj.model.startTime.show = false
      }" @cancel="arriveObj.model.startTime.show = false" />
    </van-popup>
    <van-popup v-model:show="arriveObj.model.endTime.show" position="bottom">
      <van-date-picker :model-value="arriveObj.search.endTime.split('-')" @confirm="({ selectedValues }) => {
        arriveObj.search.endTime = selectedValues.join('-');
        arriveObj.model.endTime.show = false
      }" @cancel="arriveObj.model.endTime.show = false" />
    </van-popup>

    <van-tab title="全部" class="m-[10px] w-[100vw] flex flex-col gap-[10px]">
      <div v-for="(item, index) in arriveObj.list"
        class="bg-white relative gap-10 rounded-[10px] w-[94%] min-h-100 flex flex-col items-center p-10">
        <div name="顶栏" class="w-[100%] flex justify-between">
          <div class="flex flex-row justify-center items-center" name="客户">
            <h1 class="text-12px leading-none m-0">{{ (!item.company ? '待补充' : item.company?.sName) + "-" +
              (!item.customer ? '待补充' : item.customer.sNameCn ? item.customer.sNameCn : item.customer.sNameEn) }}</h1>
            <van-icon name="arrow" />
          </div>
          <div name="状态">
            <img @click="to('updatearrive?id='+item.sPreregisterNo)" block class="absolute right-10 top-10" width="16" height="16" src="/arrive/修改.png" />
          </div>
        </div>
        <div class="flex flex-row w-100% gap-10">
          <EImage :width="'80px'" :height="'80px'" :photo-url="item.sPhotoUrl == '' ? '[]' : item.sPhotoUrl" />
          <div class="text-12">
            <h1 class="m-0 text-14">{{ item.sPreregisterNo }} {{ format(new Date(item.dPreregisterTime), "hh:mm") }}
            </h1>
            <h1 class="m-0 text-10 text-[#323131] font-500">{{ item.sProductName }}-{{ item.sProductNo }}</h1>
            <h1 class="m-0 text-10 text-[#323131] font-500">数量:{{ item.nPreregisterNum }}</h1>
            <h1 class="m-0 text-10 text-[#323131] font-500">{{ item.serialList ? JSON.parse(item.serialList)[0] : "" }}</h1>
            <!-- <h1 class="m-0 text-14">Y24083001 14:46</h1> -->
            <VanTag size="medium" color="#fdc71c" class="text-12 rounded-[20px]" type="success">
              {{ getLabelByValue(item.nType) }}</VanTag>
          </div>
        </div>

        <p class=" bg-[#FAFAFA] p-5px w-100% ">
          <a class="text-12px font-bold">备注:</a>
          <a class="text-12px">{{ item.sTypeRemark }}</a>
        </p>
        <div class="flex flex-row justify-end w-100% gap-10">
          <VanButton round size="small" type="danger">确认入库</VanButton>
        </div>
      </div>
      <div v-for="(item, index) in arriveObj.list"
        class="bg-white relative gap-10 rounded-[10px] w-[94%] min-h-100 flex flex-row items-center p-10">
        <img @click="to('editarrive')" block class="absolute right-10 top-10" width="16" height="16"
          src="/arrive/修改.png" />
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
    <van-tab title="待确认" class="m-[10px] w-[100vw] flex flex-col gap-[10px]">
      <div v-for="(item, index) in arriveObj.list"
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
    <van-tab title="待测试" class="m-[10px] w-[100vw] flex flex-col gap-[10px]">
      <div v-for="(item, index) in arriveObj.list"
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
    <van-tab title="待入库" class="m-[10px] w-[100vw] flex flex-col gap-[10px]">
      <div v-for="(item, index) in arriveObj.list"
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
    <van-tab title="已完成" class="m-[10px] w-[100vw] flex flex-col gap-[10px]">
      <div v-for="(item, index) in arriveObj.list"
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
