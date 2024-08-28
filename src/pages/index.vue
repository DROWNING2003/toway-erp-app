<script setup>
import { to } from '@/utils/routerUtil';
import { ScanOutlined } from '@vicons/antd'
definePage({
  name: 'home',
  meta: {
    level: 1,
  },
})

// const appStore = useAppStore()
// const checked = ref<boolean>(isDark.value)

// watch(
//   () => isDark.value,
//   (newMode) => {
//     checked.value = newMode
//   },
//   { immediate: true },
// )

// function toggle() {
//   toggleDark()
//   appStore.switchMode(isDark.value ? 'dark' : 'light')
// }

// const { t } = useI18n()

// const showLanguagePicker = ref(false)
// const languageValues = ref<Array<string>>([locale.value])
// const language = computed(() => languageColumns.find(l => l.value === locale.value).text)

// function onLanguageConfirm(event: { selectedOptions: PickerColumn }) {
//   locale.value = event.selectedOptions[0].value as string
//   showLanguagePicker.value = false
// }

// const menuItems = computed(() => ([
//   { title: t('home.mockGuide'), route: 'mock' },
//   { title: t('home.echartsDemo'), route: 'charts' },
//   { title: t('home.unocssExample'), route: 'unocss' },
//   { title: t('home.persistPiniaState'), route: 'counter' },
//   { title: t('home.404Demo'), route: 'unknown' },
//   { title: t('home.keepAlive'), route: 'keepalive' },
// ]))
const cur = ref("")
async function scan() {
  const res = await pro.scannerCode()
  cur.value = res
  if(startsWithProduct(cur.value)){
    to('ProductInfo?id='+cur.value)
  }
}
function startsWithProduct(s) {
  return s.startsWith("120") || s.startsWith("230");
}

</script>

<template>
 <van-pull-refresh
  v-model="isLoading"
  success-text="刷新成功"
  @refresh="onRefresh"
>



  <div class="px-[25px] py-[20px] bg flex flex-col gap-20">
    <div name="页面头" class="flex flex-row justify-between">
      <h1 class="top-title-h1">ERP管理系统</h1>
      <div class="top-title-right flex flex-row">
        <h1 class="top-title-right-text">通用扫码</h1>
        <ScanOutlined @click="scan()" class="w-24 h-24"/>
      </div>
    </div>
    <div name="快捷卡片" class="flex flex-row gap-10">
      <div name="产品管理" @click="to('productManager')" class="product-manager flex flex-col">
        <div class="p-10">
          <h1 class="product-manager-h1">产品管理</h1>
          <h1 class="product-manager-h2">今日出库100件</h1>
        </div>
        <van-image class="product-manager-image" src="/index/产品管理.png" />
      </div>

      <div class="flex flex-col gap-10">
        <div class="flex flex-row gap-10">
          <div @click="to('productInput')" name="入库" class="storehouse px-[20px] flex flex-col items-center"
            style="background: linear-gradient(180deg, #FFFBF6 0%, #FFF7EF 100%);">
            <h1 class="storehouse-h1  c-[#DA9318]">登记</h1>
            <van-image width="58" height="58" src="/index/入库.png" />
          </div>
          <div @click="to('productOutput')" name="出库" class="storehouse px-[20px] flex flex-col items-center"
            style="background: linear-gradient(180deg, #FBF9FF 0%, #F1ECFF 100%);">
            <h1 class="storehouse-h1 c-[#4C66A7]">出库</h1>
            <van-image width="58" height="48" src="/index/出库.png" />
          </div>
        </div>
        <div @click="to('library')" name="产品库" class="library flex flex-row items-center p-[15px] gap-[10px]">
          <van-image width="87" height="85" src="/index/产品库.png" />
          <h1 class="library-text">产品库</h1>
        </div>
      </div>
    </div>

    <div name="仓库管理" class="card py-[20px]">
      <div class="flex flex-row justify-between card-head px-[20px]">
        <h1 class="product-manager-h1">仓库管理</h1>
        <h2 class="product-manager-h2">库存1090件</h2>
      </div>
      <div name="仓库项目" class="flex flex-row justify-around items-center">
        <div @click="to('library')" name="仓库" class="flex flex-col p-[20px] gap-5 items-center">
          <van-image width="36" height="34" src="/index/仓库.png" />
          仓库
        </div>
        <div @click="to('stockTacking')" name="开始盘点" class="flex flex-col p-[20px] gap-5 items-center">
          <van-image width="36" height="34" src="/index/开始盘点.png" />
          开始盘点
        </div>
        <div @click="to('allocate')" name="库存调拨" class="flex flex-col p-[20px] gap-5 items-center">
          <van-image width="36" height="34" src="/index/库存调拨.png" />
          库存调拨
        </div>
      </div>
    </div>

    <div name="统计报表" style="height: 250px;" class="card py-[20px]">
      <div class="flex flex-row justify-between card-head px-[20px]">
        <h1 class="product-manager-h1">统计报表</h1>
      </div>
      <div name="统计项目" class="flex flex-row flex-wrap">
        <div name="出库报表" class="flex flex-col p-[10px] gap-5 items-center">
          <van-image width="36" height="34" src="/index/出库报表.png" />
          出库报表
        </div>
        <div name="入库报表" class="flex flex-col p-[10px] gap-5 items-center">
          <van-image width="36" height="34" src="/index/入库报表.png" />
          入库报表
        </div>
        <div name="商品出库" class="flex flex-col p-[10px] gap-5 items-center">
          <van-image width="36" height="34" src="/index/商品出库.png" />
          商品出库
        </div>
        <div name="商品入库" class="flex flex-col p-[10px] gap-5 items-center">
          <van-image width="36" height="34" src="/index/商品入库.png" />
          商品入库
        </div>
        <div name="仓库统计" class="flex flex-col p-[10px] gap-5 items-center">
          <van-image width="36" height="34" src="/index/仓库统计.png" />
          仓库统计
        </div>
        <div name="存货统计"  class="flex flex-col p-[10px] gap-5 items-center">
          <van-image width="36" height="34" src="/index/存货统计.png" />
          存货统计
        </div>
      </div>
    </div>
  </div>
</van-pull-refresh>
</template>
<style lang="less" scoped>
.bg {
  background: linear-gradient(180deg, #F2F4F9 0%, #E6EAF4 100%);
}

.top-title-h1 {
  height: 2.22%;
  opacity: 1;

  font-family: 思源黑体;
  font-size: 18px;
  font-weight: bold;
  line-height: 18px;
  letter-spacing: 0em;

  /* 标题 */
  color: #333333;

}

.top-title-right {
  width: 100px;
  padding-left: 1rem;
  padding-right: 1rem;
  height: 30px;
  border-radius: 15px;
  opacity: 0.6;
  /* 纯白 */
  background: #FFFFFF;
}

.top-title-right-text {
  width: 63px;
  height: 12px;
  opacity: 1;

  font-family: 思源黑体;
  font-size: 12px;
  font-weight: normal;
  line-height: 12px;
  letter-spacing: 0em;
  /* 待办事项    */
  color: #333333
}

.product-manager {
  width: 135px;
  height: 160px;
  border-radius: 10px;
  opacity: 1;
  background: linear-gradient(270deg, #F8F7FC 0%, #FAFAFA 100%);
}

.product-manager-h1 {
  width: 64px;
  height: 16px;
  opacity: 1;
  font-family: 思源黑体;
  font-size: 16px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0em;
  /* 333 */
  color: #000000;
}

.product-manager-h2 {
  height: 12px;
  opacity: 1;

  font-family: 思源黑体;
  font-size: 12px;
  font-weight: normal;
  line-height: 12px;
  letter-spacing: 0em;

  color: #4B79A9;

}

.product-manager-image {
  width: 135px;
  height: 102px;
  border-radius: 0px 0px 10px 10px;
  opacity: 1;
}

.storehouse {
  width: 90px;
  height: 100px;
  border-radius: 10px;
  opacity: 1;
}

.storehouse-h1 {
  width: 24px;
  height: 14px;
  opacity: 1;

  font-family: 思源黑体;
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  text-align: center;
  letter-spacing: 0em;
}

.library {
  width: 190px;
  height: 70px;
  border-radius: 10px;
  opacity: 1;

  background: linear-gradient(350deg, #FFF5F5 18%, #FFF9F9 83%);

}

.library-text {
  height: 14px;
  opacity: 1;

  font-family: 思源黑体;
  font-size: 16px;
  font-weight: 500;
  line-height: 14px;
  text-align: center;
  letter-spacing: 0em;

  color: #AC4838;

}

.card{
width: 335px;
height: 150px;
border-radius: 10px;
opacity: 0.6;
background: linear-gradient(270deg, #F8F7FC 0%, #FAFAFA 100%);
}
.card-head{
  border-bottom: 1px solid #E6EAF3;
}
</style>