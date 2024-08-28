<script setup>
import { queryMateriel, queryProductMessage } from '@/api/Base/repositoryManager';
import { sum } from 'lodash-es';
import 'md-editor-v3/lib/style.css';
import { MdPreview } from 'md-editor-v3';

definePage({
    name: 'productInfo',
    meta: {
        level: 2,
        title: '产品详细',
    },
})

const route = useRoute()
const router = useRouter()

const ProductInfoObj = reactive({
    Product: {},
    reload: () => {
        load.value = true
        queryProductMessage({
            "productNumber": route.query.id
        }).then(res => {
            console.log(res);
            ProductInfoObj.Product = res.data
            load.value = false
        })
    }
})
onMounted(() => {
    ProductInfoObj.reload()
})
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
        <van-loading v-if="load" vertical>
            <template #icon>
                <van-icon name="star-o" size="30" />
            </template>
            加载中...
        </van-loading>
        <div class="flex flex-col gap-[10px] overflow-y-scroll" v-if="!load">
            <EImage :height="'334px'" class=" shadow-sm" :photo-url="ProductInfoObj.Product?.product?.sPhotoUrl" />
            <div class="rounded-[10px] relative shadow-sm w-[100%] bg-white p-[10px]">
                <img block class="absolute right-10 top-10" width="16" height="16" src="/productManager/打印.png" />
                <h1 class="text-[18px] leading-none">{{
                    JSON.parse(ProductInfoObj.Product.product.sProductClass).join(",") +
                    JSON.parse(ProductInfoObj.Product.product.sProductPublicClass).join(",") + "," +
                    ProductInfoObj.Product.product.sProductName
                    }} </h1>
                <h2 class="text-[15px] leading-none text-coolgray">料号:{{ ProductInfoObj.Product.product.sProductNo }}
                </h2>
                <h2 class="text-[15px] leading-none text-coolgray">推荐等级:{{
                    ProductInfoObj.Product.product.sRecommendGrade }}
                </h2>
                <h2 class="text-[15px] leading-none text-coolgray">控制等级{{ ProductInfoObj.Product.product.nControlLevel
                    }}</h2>
                <h2 class="text-[15px] leading-none text-coolgray">类型:{{ ProductInfoObj.Product.product.nProductType }}
                </h2>
                <h1 class="w-[100%] text-right text-coolgray text-[10px] leading-none">
                    库存{{ sum(ProductInfoObj.Product.quantityMessage.map(item => {
                        return item.nType == 0 ? item.nQuantity : 0
                    })) }}件</h1>


            </div>
            <div class="rounded-[10px] shadow-sm w-[100%] bg-white p-[10px]">
                <h2 class="text-[15px] leading-none text-coolgray">功能/参数:{{
                    ProductInfoObj.Product.product.sProductDescription
                }}</h2>
                <h2 class="text-[15px] leading-none text-coolgray">备注:{{ ProductInfoObj.Product.product.sRemark }}</h2>
                <h2 class="text-[15px] leading-none text-coolgray">产品文档:</h2>
                <MdPreview :modelValue="ProductInfoObj.Product.product.sProductDocument" />
            </div>
        </div>

        <StepBottom>
            <template #default>
                <!-- <div>
            <span class="step-bottom-h2" @click="() => {
              // input.value.step+=1
              console.log(inputData.value--);
              console.log(inputData.value);

            }">返回上一步</span>
          </div> -->
                <!-- <el-button link  @click="()=>{
            // input.value.step+=1
            console.log(inputData.value--);
            console.log(inputData.value);
            
        }">返回上一步</el-button> -->
                <el-button class="step-bottom-button flex flex-col justify-center items-center text-white" @click="() => {
                }">修改</el-button>
            </template>
        </StepBottom>
    </div>
</template>

<style lang="less" scoped>
.card {
    border-radius: 5px;
    opacity: 1;
}
</style>