<script setup>
import { queryPreregisterApp } from '@/api/Base/preregister';
import { querySelfDeliver } from '@/api/Base/selfDeliver';
import useAppStore from '@/stores/modules/app';
import { to } from '@/utils/routerUtil';
import { format, subMonths } from 'date-fns';
import { showConfirmDialog } from 'vant';

definePage({
  name: 'productOutput',
  meta: {
    // level: 2,
    // title: '到货管理',
  },
})
const load = ref(false)

const productOutput = reactive({
  search: {
    searchText: "",//登记号,料号,设备名称,
    startTime: format(subMonths(new Date(), 3), "yyyy-MM-dd"),
    endTime: format(new Date(), "yyyy-MM-dd"),
    deliver: 0,
    active: 0,
  },
  model: {
    startTime: {
      show: false,
    },
    endTime: {
      show: false,
    },
    deliver: {
      show: false,
      columns: [
        { text: '全部', value: 0 },
        { text: '快递', value: 1 },
        { text: '自主', value: 2 },
      ]
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
    querySelfDeliver({
      "page": 1,
      "pageSize": 999999,
      "searchKeyword": "",
      "type": productOutput.search.active,
      "startTime": productOutput.search.startTime,
      "endTime": productOutput.search.endTime,
      "sendType": productOutput.search.deliver,
    }).then(res => {
      if (res.code == 0) {
        productOutput.list = res.data.list.reverse()
      }
    })
  }
})

const router = useRouter()

watch(productOutput.search, () => {
  productOutput.reload()
})

function onBack() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}

onMounted(() => {
  productOutput.reload()
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
  productOutput.search.searchText = res
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
function getStatus(type) {
  switch (type) {
    case 1:
      return '待发出'
    case 2:
      return '待返回'
    case 3:
      return '已取消'
    case 4:
      return '已完成'
    default:
      break;
  }
}
function getDeliverType(type) {
  switch (type) {
    case 0:
      return '全部'
    case 1:
      return '外发'
    case 2:
      return '自主'
    default:
      break;
  }
}
</script>

<template>

  <VanNavBar :fixed="true" clickable left-arrow @click-left="onBack">
    <template #title>
      <div class="flex flex-row gap-8">
        <van-search class="search" shape="round" v-model="productOutput.search.searchText" placeholder="对应单号/关键字/运单号" />
      </div>


    </template>
    <template #right>
      <div class="flex gap-[20px] justify-center items-center">
        <van-image @click="scan" width="16" height="16" src="/productManager/扫码.png" />
        <van-image @click="to('newoutput')" width="16" height="16" src="/productManager/添加.png" />
      </div>
    </template>
  </VanNavBar>
  <van-tabs class="bg-#f2f4f8 mt-[43px]" v-model:active="productOutput.search.active">
    <div class="p-10px flex flex-row flex-wrap gap-20 bg-white rounded-[10px] m-10">
      <a @click="productOutput.model.startTime.show = true" class="text-15px">开始时间:{{ productOutput.search.startTime
        }}</a>
      <a @click="productOutput.model.endTime.show = true" class="text-15px">结束时间:{{ productOutput.search.endTime }}</a>
      <a @click="productOutput.model.deliver.show = true" class="text-15px">发出方式:{{
        getDeliverType(productOutput.search.deliver)
      }}</a>
    </div>
    <van-popup v-model:show="productOutput.model.startTime.show" position="bottom">
      <van-date-picker :model-value="productOutput.search.startTime.split('-')" @confirm="({ selectedValues }) => {
        productOutput.search.startTime = selectedValues.join('-');
        productOutput.model.startTime.show = false
      }" @cancel="productOutput.model.startTime.show = false" />
    </van-popup>
    <van-popup v-model:show="productOutput.model.endTime.show" position="bottom">
      <van-date-picker :model-value="productOutput.search.endTime.split('-')" @confirm="({ selectedValues }) => {
        productOutput.search.endTime = selectedValues.join('-');
        productOutput.model.endTime.show = false
      }" @cancel="productOutput.model.endTime.show = false" />
    </van-popup>
    <van-popup v-model:show="productOutput.model.deliver.show" position="bottom">
      <van-picker title="选择快递方式" :columns="productOutput.model.deliver.columns" @confirm="({ selectedValues }) => {
        productOutput.model.deliver.show = false
        productOutput.search.deliver = selectedValues
      }" @cancel="() => {
        productOutput.model.deliver.show = false
      }" />
    </van-popup>
    <van-tab title="全部" class="m-[10px] w-[100vw] flex flex-col gap-[10px]">

      <div v-for="(item, index) in productOutput.list"
        class="bg-white relative gap-10 rounded-[10px] w-[94%] min-h-100 flex flex-col items-center p-10">
        <div name="顶栏" class="w-[100%] flex justify-between">
          <!-- <div class="flex flex-row justify-center items-center" name="客户">
            <h1 class="text-12px leading-none m-0">{{ (item.sProductName == '' ? '待补充' : item.sProductName) + "-" +
              (item.sProductNo == '' ? '待补充' : item.sProductNo) }}</h1>
            <van-icon name="arrow" />
          </div> -->
          <div name="状态">
            <h1 class="leading-none m-0 text-[12px] font-bold color-[#E7845B]">{{ getStatus(item.status) }}</h1>
          </div>
        </div>
        <div class="flex flex-row w-100% gap-10">
          <EImage :width="'80px'" :height="'80px'" :photo-url="item.photoList" />
          <div class="text-12">
            <h1 class="m-0 text-14">{{ item.deliverNumber }}</h1>
            <h1 class="m-0 text-10 text-[#323131] font-500">{{ item.productName }}</h1>
            <h1 class="m-0 text-10 text-[#323131] font-500">数量:{{ item.quantity }}</h1>
            <!-- <h1 class="m-0 text-14">Y24083001 14:46</h1> -->
            <VanTag type="success">
              {{ getType(item.type) }}
            </VanTag>

          </div>
        </div>

        <p class=" bg-[#FAFAFA] p-5px w-100% ">
          <a class="text-12px font-bold">收件信息:</a>
          <a class="text-12px">{{ item.receiveMessage }}</a>
        </p>
        <div class="flex flex-row justify-end w-100% gap-10">

          <van-popup id="fu" class="h-50vh bg-[#f2f4f8] flex flex-col p-10 items-center rounded-t-[10px]"
            v-model:show="productOutput.model.feedback.show" position="bottom">
            <div class="w-[100%] p-10">
              结果状态:
              <VanRadioGroup direction="horizontal">
                <VanRadio>正常</VanRadio>
                <VanRadio>未收到</VanRadio>
                <VanRadio>必要</VanRadio>
              </VanRadioGroup>
            </div>
            <van-field v-model="productOutput.model.feedback.message" class="rounded-[10px]" rows="2" autosize
              label="结果反馈" type="textarea" maxlength="50" placeholder="结果反馈" show-word-limit />
            <VanButton round color="#235EFF" class="fixed bottom-0 bg-[#235EFF] w-[100%]">确定提交</VanButton>
          </van-popup>
          <VanButton class="w-[90px]" round size="small" @click="to('fixhistory')">详细</VanButton>
          <VanButton class="w-[90px]" round size="small" @click="showConfirmDialog({
            title: '取消发货',
            message: '是否确认取消这个计划。',
          }).then(() => {
            // on confirm

          })
            .catch(() => {
              // on cancel
            });">取消</VanButton>
          <VanButton v-if="item.status == 1" class="w-[90px]" color="#E7845B" round size="small"
            @click="to('output?id=' + item.deliverNumber)">发出</VanButton>
          <VanButton v-else class="w-[90px]" color="#E7845B" round size="small"
            @click="productOutput.model.feedback.show = true">返回登记
          </VanButton>
        </div>
      </div>
    </van-tab>
    <van-tab title="待发出" class="m-[10px] w-[100vw] flex flex-col gap-[10px]">
      <div v-for="(item, index) in productOutput.list"
        class="bg-white relative gap-10 rounded-[10px] w-[94%] min-h-100 flex flex-col items-center p-10">
        <div name="顶栏" class="w-[100%] flex justify-between">
          <!-- <div class="flex flex-row justify-center items-center" name="客户">
            <h1 class="text-12px leading-none m-0">{{ (item.sProductName == '' ? '待补充' : item.sProductName) + "-" +
              (item.sProductNo == '' ? '待补充' : item.sProductNo) }}</h1>
            <van-icon name="arrow" />
          </div> -->
          <div name="状态">
            <h1 class="leading-none m-0 text-[12px] font-bold color-[#E7845B]">{{ getStatus(item.status) }}</h1>
          </div>
        </div>
        <div class="flex flex-row w-100% gap-10">
          <EImage :width="'80px'" :height="'80px'" :photo-url="item.photoList" />
          <div class="text-12">
            <h1 class="m-0 text-14">{{ item.deliverNumber }}</h1>
            <h1 class="m-0 text-10 text-[#323131] font-500">{{ item.productName }}</h1>
            <h1 class="m-0 text-10 text-[#323131] font-500">数量:{{ item.quantity }}</h1>
            <!-- <h1 class="m-0 text-14">Y24083001 14:46</h1> -->
            <VanTag type="success">
              {{ getType(item.type) }}
            </VanTag>

          </div>
        </div>

        <p class=" bg-[#FAFAFA] p-5px w-100% ">
          <a class="text-12px font-bold">收件信息:</a>
          <a class="text-12px">{{ item.receiveMessage }}</a>
        </p>
        <div class="flex flex-row justify-end w-100% gap-10">
          <VanButton class="w-[90px]" color="#E7845B" round size="small"
            @click="productOutput.model.feedback.show = true">返回登记
          </VanButton>
          <van-popup id="fu" class="h-50vh bg-[#f2f4f8] flex flex-col p-10 items-center rounded-t-[10px]"
            v-model:show="productOutput.model.feedback.show" position="bottom">
            <div class="w-[100%] p-10">
              结果状态:
              <VanRadioGroup direction="horizontal">
                <VanRadio>正常</VanRadio>
                <VanRadio>未收到</VanRadio>
                <VanRadio>必要</VanRadio>
              </VanRadioGroup>
            </div>
            <van-field v-model="productOutputppp.model.feedback.message" class="rounded-[10px]" rows="2" autosize
              label="结果反馈" type="textarea" maxlength="50" placeholder="结果反馈" show-word-limit />
            <VanButton round color="#235EFF" class="fixed bottom-0 bg-[#235EFF] w-[100%]">确定提交</VanButton>
          </van-popup>
          <VanButton class="w-[90px]" round size="small" @click="to('fixhistory')">取消</VanButton>
          <VanButton class="w-[90px]" color="#E7845B" round size="small" @click="to('output')">发出</VanButton>
        </div>
      </div>
    </van-tab>
    <van-tab title="待返回" class="m-[10px] w-[100vw] flex flex-col gap-[10px]">
      <div v-for="(item, index) in productOutput.list"
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
      <div v-for="(item, index) in productOutput.list"
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
      <div v-for="(item, index) in productOutput.list"
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
