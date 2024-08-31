<script setup>
import { queryPreregister } from '@/api/Base/preregister';
import useAppStore from '@/stores/modules/app';
import { format, subMonths } from 'date-fns';

definePage({
  name: 'editarrive',
  meta: {
    level: 2,
    title: '信息补充',
  },
})
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
</script>

<template>

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
