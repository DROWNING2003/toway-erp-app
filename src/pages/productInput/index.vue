<script setup>
import { CameraOutlined } from '@vicons/antd'
import AddProduct from './components/AddProduct.vue';
import { queryPreregisterMessage } from '@/api/Base/preregister';
import { MinusCircleFilled } from '@vicons/antd'
definePage({
  name: 'productInput',
  meta: {
    level: 2,
    title: '商品入库',
  },
})

const _addProduct = reactive({
  show: false,
})

const inputData = reactive({
  stepList: ["登记新到", "分类到货", "创建成功"],
  value: 0,
  total: 1,
  type: "进货物料",
  showType: false,
  remark: "",
})

const onConfirm = ({ selectedOptions }) => {
  inputData.showType = false;
  console.log(selectedOptions);

  inputData.type = selectedOptions[0].text;
};

const columns = [
  { text: '进货物料', value: 0 },
  { text: '客户送修', value: 1 },
  { text: '客户退换', value: 2 },
  { text: '外修返回', value: 3 },
  { text: '代工交货', value: 4 },
  { text: '客供料', value: 5 },
];

const ProductInputObj = reactive({
  list: undefined,
  Product: {
    customerId: "",
    productName: "",
    brand: "",
    serialList: [],
    faultMessage: "",
  }
})
const cur = ref("")
async function scan() {
  const res = await pro.scannerCode()
  cur.value = res
  if (startsWithProduct(cur.value)) {
    queryPreregisterMessage({
      "preNumber": cur.value
    }).then(res => {
      ProductInputObj.list = res.data
      inputData.type = '客户送修'
      ProductInputObj.Product = {
        customerId: res.data.nCustomerId,
        productName: res.data.sProductName,
        brand: res.data.lastRepairRecord.brand,
        serialList: JSON.parse(res.data.lastRepairRecord.serialList),
        faultMessage: res.data.lastRepairRecord.faultMessage,
      }
    })
  }
}
async function scanSerial(){
  const res = await pro.scannerCode()
  ProductInputObj.Product.serialList.push(res)
}
function startsWithProduct(s) {
  return s.startsWith("Y");
}
const load = ref(false)
</script>

<template>
  <div class="py-70 px-20 flex flex-col gap-10">
    <div name="步骤条" class="setpbar">
      <StepBar :step-list="inputData.stepList" :value="inputData.value"></StepBar>
    </div>
    <div v-if="inputData.value == 0" name="添加产品" class="card shadow-2xl py-[20px] mb-[30px]">
      <div class="flex relative flex-row justify-between card-head px-[20px]">
        <h1 class="add-product-h1">选择物品</h1>
        <img @click="scan()" block class="absolute right-10 top-10" width="16" height="16" src="/input/扫码.png" />
      </div>
      <div v-if="!ProductInputObj.list" name="仓库项目" class="flex flex-col w-[100%] h-[100%] items-center justify-center">
        <div name="没有物品时" class="flex flex-col min-h-[250px] items-center justify-center">
          <img block width="120" height="100" src="/input/拍照.png" />
          <h3 class="text-[14px] text-coolGray">拍摄预登记物品,有登记号请使用上面的扫码</h3>
        </div>
        <div v-if="load" name="搜索中" class="flex flex-col min-h-[250px] items-center justify-center">
          <van-loading vertical>
            <template #icon>
              <van-icon name="star-o" size="30" />
            </template>
            加载中...
          </van-loading>
        </div>
      </div>
      <ProductItem v-model:cur="cur" v-model:list="ProductInputObj.list" v-if="cur != ''" :type="'edit'" :product="{
        id: 1,
        name: ProductInputObj.list.sProductName,
        description: ProductInputObj.list.company.sName + '-' + (ProductInputObj.list.customer.sNameCn ? ProductInputObj.list.customer.sNameCn : ProductInputObj.list.customer.sNameEn),
        // price: 2,
        categories: ['维修',],
        quantity: ProductInputObj.list.nPreregisterNum,
        sPhotoUrl: ProductInputObj.list.sPhotoUrl
      }"></ProductItem>
      <StepBottom v-show="!inputData.showType" v-model="inputData">
        <template #default>
          <div>
            <!-- <span class="step-bottom-h2">共{{ inputData.total }}件</span> -->
          </div>
          <VanButton class="step-bottom-button flex flex-col justify-center items-center text-white" @click="() => {
            // input.value.step+=1
            // 
            console.log(inputData.value++);
            console.log(inputData.value);

          }">下一步</VanButton>
        </template>
      </StepBottom>
    </div>
    <div v-if="inputData.value == 1" name="分类" class="">
      <div v-if="inputData.type == '客户送修'"  name="预登记号维修送回" class="gap-[10px] flex flex-col py-[20px]">
        <van-field class="rounded-[10px] h-[60px] flex items-center" v-model="inputData.type" is-link readonly
          label="来货分类" placeholder="选择分类" @click="inputData.showType = true" />
        <van-popup teleport="#app" v-model:show="inputData.showType" round position="bottom">
          <van-picker :columns="columns" @cancel="inputData.showType = false" @confirm="onConfirm" />
        </van-popup>

        <van-field class="rounded-[10px] h-[60px] flex items-center" v-model="ProductInputObj.Product.customerId"
          is-link readonly label="绑定客户" placeholder="客户" @click="inputData.showType = true" />
        <van-popup teleport="#app" v-model:show="inputData.showType" round position="bottom">
          <van-picker :columns="columns" @cancel="inputData.showType = false" @confirm="onConfirm" />
        </van-popup>

        <van-field class="rounded-[10px] h-[60px] flex items-center" v-model="ProductInputObj.Product.productName"
          label="设备名称" placeholder="请输入" />
        <van-field class="rounded-[10px] h-[60px] flex items-center" v-model="ProductInputObj.Product.brand"
          label="品牌名称" placeholder="请输入" />

        <div class="bg-white p-[10px] min-h-[150px] rounded-[10px]">
          <van-field class="rounded-[10px]" readonly label="序列号" placeholder="扫码">
            <template #button>
              <div>
                <img @click="scanSerial()" block width="16" height="16" src="/input/扫码.png" />
              </div>
            </template>
          </van-field>
          <div class="flex flex-row h-20 items-center px-10" v-for="(item, index) in ProductInputObj.Product.serialList"
            :key="index">
            <MinusCircleFilled @click="() => {
              ProductInputObj.Product.serialList.splice(index,1)
            }" class="w-16 h-16 c-[#ff4000]" />{{ item }}
          </div>

        </div>
        <van-field v-model="ProductInputObj.Product.faultMessage" class="rounded-[10px]" rows="2" autosize
          label="客描故障/要求" type="textarea" maxlength="50" placeholder="请输入留言" show-word-limit />

      </div>
      <StepBottom v-show="!inputData.showType" v-model="inputData">
        <template #default>
          <div>
            <span class="step-bottom-h2" @click="() => {
              // input.value.step+=1
              console.log(inputData.value--);
              console.log(inputData.value);

            }">返回上一步</span>
          </div>
          <!-- <el-button link  @click="()=>{
            // input.value.step+=1
            console.log(inputData.value--);
            console.log(inputData.value);
            
        }">返回上一步</el-button> -->
          <el-button class="step-bottom-button flex flex-col justify-center items-center text-white" @click="() => {
            // input.value.step+=1
            console.log(inputData.value++);
            console.log(inputData.value);
          }">确认创建</el-button>
        </template>
      </StepBottom>
    </div>

    <div v-if="inputData.value == 2" name="创建成功" class="card flex flex-col items-center gap-[10px] py-[20px]">
      <van-image class="create-success" src="../../../public/input/创建完成.png" />
      <h2>预登录成功</h2>
      <VanButton class="create-h1"> 打印预登录码</VanButton>
      <VanButton class="create-h2" @click="inputData.value = 0"> 继续预登录</VanButton>
    </div>
  </div>
</template>

<style lang="less" scoped>
.create-success {
  width: 120px;
  height: 110px;
  opacity: 1;
}

.create-h1 {
  width: 240px;
  height: 40px;
  border-radius: 20px;
  opacity: 1;

  box-sizing: border-box;
  /* 主色 */
  border: 1px solid #235EFF;


  font-family: 思源黑体;
  font-size: 14px;
  font-weight: normal;
  line-height: 14px;
  letter-spacing: 0em;

  /* 主色 */
  color: #235EFF;
}

.create-h2 {
  width: 240px;
  height: 40px;
  border-radius: 20px;
  opacity: 1;

  /* 主色 */
  background: #235EFF;

  font-family: 思源黑体;
  font-size: 14px;
  font-weight: normal;
  line-height: 14px;
  text-align: center;
  letter-spacing: 0em;

  /* 纯白 */
  color: #FFFFFF;
}

.setpbar {
  width: 335px;
  height: 80px;
  border-radius: 10px;
  opacity: 1;
  /* 纯白 */
  background: #FFFFFF;

}


.step-bottom-h2 {

  font-family: 思源黑体;
  font-size: 12px;
  font-weight: normal;
  line-height: 12px;
  letter-spacing: 0em;

  /* 333 */
  color: #333333;
}

.step-bottom-button {
  width: 130px;
  height: 36px;
  border-radius: 18px;
  opacity: 1;

  /* 主色 */
  background: #235EFF;

}

.card {
  width: 335px;
  min-height: 335px;
  border-radius: 10px;
  opacity: 0.6;
  background: #FFFFFF;
}

.card-head {
  border-bottom: 1px solid #E6EAF3;
}

.add-product-h1 {
  height: 2rem;
  opacity: 1;

  font-family: 思源黑体;
  font-size: 16px;
  font-weight: normal;
  line-height: 12px;
  text-align: right;
  letter-spacing: 0em;

  /* 选择商品 */
  color: #363636
}
</style>
