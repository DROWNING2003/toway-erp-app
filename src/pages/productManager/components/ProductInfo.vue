<script setup lang="ts">
import { queryMateriel } from '@/api/Base/repositoryManager';

definePage({
    name: 'productManager/ProductInfo',
    meta: {
        level: 3,
        title: '产品详细',
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

// const ProductManager = reactive({
//   search: {
//     searchText: "",
//     status: 0,
//   },
//   list:[],
//   reload:()=>{
//     load.value = true
//     queryMateriel({
//         "page": 1,
//         "pageSize": 999,
//     }).then(res=>{
//        ProductManager.list = res.data.list
//        load.value = false
//     })
//   }
// })

// const option = [
//   { text: '全部商品', value: 0 },
//   { text: '新款商品', value: 1 },
//   { text: '活动商品', value: 2 },
// ];

// onMounted(()=>{
//   ProductManager.reload()
// })
const load = ref(true)
</script>

<template>

    <div class="card m-[4rem] flex flex-col gap-[10px] mt-[70px]">
        啊吴大维
    </div>
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
