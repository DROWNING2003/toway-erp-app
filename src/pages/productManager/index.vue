<script setup lang="ts">
import { queryMateriel } from '@/api/Base/repositoryManager';
import { to } from '@/utils/routerUtil';

definePage({
  name: 'productManager',
  meta: {
    // level: 2,
    // title: '产品管理',
  },
})

const route = useRoute()
const router = useRouter()

function onBack() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}

const ProductManager = reactive({
  search: {
    searchText: "",
    status: 0,
  },
  list: [],
  reload: () => {
    load.value = true
    queryMateriel({
      "page": 1,
      "pageSize": 999,
    }).then(res => {
      ProductManager.list = res.data.list
      load.value = false
    })
  }
})

const option = [
  { text: '全部商品', value: 0 },
  { text: '新款商品', value: 1 },
  { text: '活动商品', value: 2 },
];

onMounted(() => {
  ProductManager.reload()
})
const load = ref(true)
</script>

<template>
  <van-pull-refresh v-model="load" success-text="刷新成功" @refresh="ProductManager.reload()">
    <!--   <div class="flex flex-row"> -->
    <VanNavBar :fixed="true" clickable left-arrow @click-left="onBack">
      <template #title>
        <div class="flex flex-row gap-8">
          <van-search class="search" shape="round" v-model="ProductManager.search.searchText" placeholder="请输入品名/料号" />
          <div class="flex justify-center items-center">
            <van-image width="16" height="16" src="/productManager/扫码.png" />
          </div>
        </div>


      </template>
      <template #right>
        <div class="scan flex justify-center items-center">
          <van-image width="16" height="16" src="/productManager/添加.png" />
        </div>
      </template>
    </VanNavBar>
    <div class="card m-[4rem] flex flex-col gap-[10px] mt-[70px]">

      <!-- <van-dropdown-menu class="bg-white flex justify-between flex-row h-[80px] rounded-[10px] shadow-sm">
      <van-dropdown-item v-model="ProductManager.search.status" :options="option" />
    </van-dropdown-menu> -->
      <van-loading v-if="load" vertical>
        <template #icon>
          <van-icon name="star-o" size="30" />
        </template>
        加载中...
      </van-loading>
      <van-row :gutter="[20, 20]">
        <van-col v-for="(item, index) in ProductManager.list" :key="index" span="12">
          <div @click="(to('ProductInfo?id=' + item.sProductNo))"
            class="w-[100%] h-[250px] p-[10px] border-radius: 10px; bg-white">
            <!-- <van-image width="100%" height="70%" src="/productManager/扫码.png" /> -->
            <EImage :photo-url="item.sPhotoUrl" :water-mark='item.status == 0 ? "停用" : ""' />
            <div>
              <h1 class="text-[12px] leading-none">
                {{ JSON.parse(item.sProductClass).join(",") + JSON.parse(item.sProductPublicClass).join(",") +
                  item.sProductName }}
              </h1>
              <h1 class="text-[10px] text-coolgray leading-none">料号:{{ item.sProductNo }}</h1>
              <h1 class="text-[10px] text-coolgray leading-none">推荐等级:{{ item.sRecommendGrade }}</h1>
              <h1 class="w-[100%] text-right text-coolgray text-[10px] leading-none">库存{{ item.effectiveQuantity }}</h1>
            </div>
          </div>
        </van-col>
      </van-row>
      <!-- <div class="w-[100%] flex flex-row justify-center flex-wrap gap-[10px]">
        <div class="w-[160px] h-[200px] bg-black">
        awda
        </div>
        <div class="w-[160px] h-[200px] bg-black">
        awda
        </div>
        <div class="w-[200px] h-[200px] bg-black">
        awda
        </div>
      </div> -->
      <!-- <van-dropdown-item v-model="value1" :options="option1" />
      <van-dropdown-item v-model="value1" :options="option1" /> -->

    </div>
  </van-pull-refresh>
</template>

<style lang="less" scoped>
.card {
  border-radius: 5px;
  opacity: 1;

  /* 纯白 */
  // background: #131313;

}

.search {
  // width: 110px;
  height: 2rem;
  border-radius: 5px;
  opacity: 1;

  /* 纯白 */
  background: #FFFFFF;

}

// .scan {
//   width: 80px;
//   height: 80px;
//   border-radius: 5px;
//   opacity: 1;
//   /* 纯白 */
//   background: #FFFFFF;

// }</style>
