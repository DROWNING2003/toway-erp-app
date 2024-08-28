<script setup lang="ts">
import { MinusCircleFilled } from '@vicons/antd'
interface Product {
    id: number;
    name: string;
    price: number;
    description?: string; // 可选属性
    categories: string[];
    quantity: number; // 可选属性
    sPhotoUrl: string;
}
const list = defineModel("list")
const cur = defineModel("cur")
const prop = defineProps({
    type: {
        type: String as () => "edit" | "fixed",
        default: "fixed"
    },
    product: {
        type: Object as PropType<Product>,
        default: () => ({})
    },
})
</script>

<template>
    <div v-if="prop.type == 'edit'" class="flex flex-row gap-10 items-center">
        <MinusCircleFilled @click="()=>{
            list = undefined
            cur = ''
        }" class="w-24 h-24 c-[#ff4000]" />
        <van-card class="w-100%" :num="prop.product.quantity" :price="prop.product.price"
            :desc="prop.product.description" :title="prop.product.name">
            <template #thumb>
                <EImage :width="'100%'" :height="'100%'" :photo-url="prop.product.sPhotoUrl" />
            </template>
            <template #tags>
                <van-tag plain type="primary" v-for="item in prop.product.categories">{{ item }}</van-tag>
            </template>
            <template #num>
                <van-stepper v-model="prop.product.quantity" step="1" />
            </template>
            <template #footer>
                <!-- <van-button size="mini">按钮</van-button>
            <van-button size="mini">按钮</van-button> -->
            </template>
        </van-card>
    </div>

    <van-card v-else class="w-100%" num="2" price="2.00" desc="描述信息" title="商品标题"
        thumb="https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg">
        <template #tags>
            <van-tag plain type="primary">标签</van-tag>
            <van-tag plain type="primary">标签</van-tag>
        </template>
        <!-- <template #num>
            <van-stepper v-model="prop.product.quantity" step="1" />
        </template> -->
        <template #footer>
            <van-button size="mini">按钮</van-button>
            <van-button size="mini">按钮</van-button>
        </template>
    </van-card>


</template>
<style lang="less"></style>