<script setup>
import { CameraOutlined } from '@vicons/antd'
import AddProduct from './components/AddProduct.vue';
import { preregisterRegister, putRepairPreregister, queryPreregisterMessage } from '@/api/Base/preregister';
import { MinusCircleFilled } from '@vicons/antd'
import { showNotify } from 'vant';
import SelectProcurement from '@/components/SelectProcurement.vue';
import { uploadFile } from '@/api/Base/file';
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
  type: "",
  showType: false,
  remark: "",
})

const onConfirm = ({ selectedOptions }) => {
  inputData.showType = false;
  console.log(selectedOptions);

  inputData.type = selectedOptions[0].text;
};

const columns = [
  { text: '采购物料', value: 0 },
  { text: '客户送修', value: 1 },
  { text: 'PCB订单', value: 6 },
  { text: '客户退换', value: 2 },
  { text: '外修返回', value: 3 },
  { text: '代工交货', value: 4 },
  { text: '客供料', value: 5 },
  { text: '其他', value: 7 },
];

const ProductInputObj = reactive({
  list: undefined,
  Product: {
    photoList: [],
    customerId: "",
    productName: "",
    brand: "",
    serialList: [],
    faultMessage: "",
    quantity: 1,
    remark: "",
    businessStatus: "正常",
    // customerFeedback:""
  },
  model: {
    SelectCustomer: {
      show: false,
      customer: {}
    },
    SelectProcurement: {
      show: false,
      Procurement: {}
    },
    SelectPCB: {
      show: false,
      PCB: {}
    },
    SelectBusinessStatus: {
      show: false,
      columns: [
        { text: '正常', value: 1 },
        { text: '保修', value: 2 },
        { text: '走账', value: 3 },
      ]
    }
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
async function scanSerial() {
  const res = await pro.scannerCode()
  ProductInputObj.Product.serialList.push(res)
}
async function photo() {
  const base64 = await pro.openCamera();
  //TODO:图片处理
  const data = window.atob(base64);
  const ia = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    ia[i] = data.charCodeAt(i);
  }
  const file = new File([ia], "打标.png", { type: "image/png" });
  uploadFile(file).then(res => {
    if (res.code == 0) {
      ProductInputObj.Product.photoList.push(res.data.fileid)
    }
  })
}


function startsWithProduct(s) {
  return s.startsWith("Y");
}

const customerFullName = computed(() => {
  return ProductInputObj.model.SelectCustomer.customer.companySName + ProductInputObj.model.SelectCustomer.customer.sNameCn;
})
const load = ref(false)
const sn = ref("")
function addSN() {
  ProductInputObj.Product.serialList.push(sn.value)
  sn.value = ""
}
</script>

<template>
  <div class="py-70 px-20 flex flex-col gap-10">
    <div name="步骤条" class="setpbar">
      <StepBar :step-list="inputData.stepList" :value="inputData.value"></StepBar>
    </div>
    <div v-if="inputData.value == 0" name="添加产品" class="rounded-[10px] shadow-2xl py-[20px] mb-[30px]">
      <div class="flex relative flex-row justify-between card-head px-[20px]">
        <h1 class="add-product-h1">选择物品</h1>
        <img @click="scan()" block class="absolute right-10 top-10" width="16" height="16" src="/input/扫码.png" />
      </div>

      <div v-if="ProductInputObj.Product.photoList.length == 0" name="仓库项目"
        class="flex flex-col w-[100%] h-[100%] items-center justify-center">
        <div name="没有物品时" class="flex flex-col min-h-[250px] items-center justify-center">
          <img @click="photo()" block width="120" height="100" src="/input/拍照.png" />
          <h3 class="text-[14px] text-coolGray">拍摄预登记物品,有登记号请使用上面的扫码</h3>
          <!-- <van-uploader :after-read="afterRead" /> -->
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
      <div v-if="ProductInputObj.Product.photoList.length != 0" class="flex flex-col w-[100%] h-[100%] relative p-10">
        <EImageList v-model:photoList="ProductInputObj.Product.photoList" />
        <van-stepper class="absolute bottom-0 right-10px" v-model="ProductInputObj.Product.quantity" />
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

      <StepBottom class="flex items-center justify-center" v-model="inputData">
        <VanButton :disabled="ProductInputObj.Product.photoList.length == 0 && cur == ''" color="#235EFF"
          class="bg-[#235EFF] color-[#235EFF] w-100% text-white" @click="() => {

            console.log(inputData.value++);
            console.log(inputData.value);
          }">下一步</VanButton>
      </StepBottom>
    </div>

    <div v-if="inputData.value == 1" name="分类" class="h-[70vh] overflow-y-scroll">
      <van-field class="rounded-[10px] h-[60px] flex items-center" v-model="inputData.type" is-link readonly
        label="来货分类" placeholder="选择分类" @click="inputData.showType = true" />
      <van-popup teleport="#app" v-model:show="inputData.showType" round position="bottom">
        <van-picker :columns="columns" @cancel="inputData.showType = false" @confirm="onConfirm" />
      </van-popup>

      <StepBottom v-if="inputData.type == ''" v-show="!inputData.showType" v-model="inputData">
        <template #default>
          <div>
            <span class="step-bottom-h2" @click="() => {
              // input.value.step+=1
              console.log(inputData.value--);
              console.log(inputData.value);

            }">返回上一步</span>
          </div>

          <el-button class="step-bottom-button flex flex-col justify-center items-center text-white" @click="() => {
            preregisterRegister({
              photoFileId: JSON.stringify(ProductInputObj.Product.photoList),
              type: 6,
              orderNo: '',
              customerId: '',
              customerRemark: '',
              count: ProductInputObj.Product.quantity
            }).then(res => {
              if (res.code == 0) {
                inputData.value++
              }
            })

          }">确认创建</el-button>
        </template>
      </StepBottom>

      <div v-if="inputData.type == '客户送修'" name="预登记号维修送回" class="gap-[10px] flex flex-col py-[20px]">
        <van-field class="rounded-[10px] h-[60px] flex items-center"
          v-model="ProductInputObj.model.SelectCustomer.customer.companySName" is-link readonly label="绑定客户"
          placeholder="客户" @click="ProductInputObj.model.SelectCustomer.show = true" />
        <SelectCustomer v-model:customer="ProductInputObj.model.SelectCustomer.customer"
          v-model:show="ProductInputObj.model.SelectCustomer.show" />
        <van-field class="rounded-[10px] h-[60px] flex items-center" v-model="ProductInputObj.Product.productName"
          label="设备名称" placeholder="请输入" />
        <van-field class="rounded-[10px] h-[60px] flex items-center" v-model="ProductInputObj.Product.brand"
          label="品牌名称" placeholder="请输入" />
        <van-field class="rounded-[10px] h-[60px] flex items-center" v-model="ProductInputObj.Product.businessStatus"
          is-link readonly label="业务状态" placeholder="请输入"
          @click="ProductInputObj.model.SelectBusinessStatus.show = true" />
        <van-popup v-model:show="ProductInputObj.model.SelectBusinessStatus.show" round position="bottom">
          <van-picker :columns="ProductInputObj.model.SelectBusinessStatus.columns"
            @cancel="ProductInputObj.model.SelectBusinessStatus.show = false" @confirm="({ selectedOptions }) => {
              ProductInputObj.model.SelectBusinessStatus.show = false
              ProductInputObj.Product.businessStatus = selectedOptions[0].text
            }" />
        </van-popup>

        <div class="bg-white p-[10px] min-h-[150px] rounded-[10px]">
          <van-field class="rounded-[10px]" @blur="addSN" v-model="sn" label="序列号" placeholder="扫码">
            <template #button>
              <div>
                <img @click="scanSerial()" block width="16" height="16" src="/input/扫码.png" />
              </div>
            </template>
          </van-field>
          <div class="flex flex-row h-20 items-center px-10" v-for="(item, index) in ProductInputObj.Product.serialList"
            :key="index">
            <MinusCircleFilled @click="() => {
              ProductInputObj.Product.serialList.splice(index, 1)
            }" class="w-16 h-16 c-[#ff4000]" />{{ item }}
          </div>

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

            <el-button class="step-bottom-button flex flex-col justify-center items-center text-white" @click="() => {
              putRepairPreregister({
                // preregisterNumber: input.RegistrationNo,
                photoList: ProductInputObj.Product.photoList,
                serialNumber: ProductInputObj.Product.serialList,
                deviceName: ProductInputObj.Product.productName,
                businessStatus: ProductInputObj.Product.businessStatus == '正常' ? 1 : ProductInputObj.Product.businessStatus == '保修' ? 2 : 3,
                // customerFeedback: input.customerFeedback,
                brand: ProductInputObj.Product.brand,
                faultMessage: ProductInputObj.Product.faultMessage,
                quantity: ProductInputObj.Product.quantity,
                remark: ProductInputObj.Product.remark,
                customerID: ProductInputObj.model.SelectCustomer.customer.nCustomerId,
              })
              console.log(inputData.value++);
              console.log(inputData.value);
            }">确认创建</el-button>
          </template>
        </StepBottom>
        <van-field v-model="ProductInputObj.Product.faultMessage" class="rounded-[10px]" rows="2" autosize
          label="客描故障/要求" type="textarea" maxlength="50" placeholder="请输入留言" show-word-limit />
      </div>
      <div v-if="inputData.type == '采购物料'" name="采购物料" class="gap-[10px] flex flex-col py-[20px]">
        <van-field class="rounded-[10px] h-[60px] flex items-center"
          v-model="ProductInputObj.model.SelectProcurement.Procurement.sPurchaseName" is-link readonly label="绑定采购"
          placeholder="采购单" @click="ProductInputObj.model.SelectProcurement.show = true" />
        <SelectProcurement v-model:show="ProductInputObj.model.SelectProcurement.show"
          v-model:procurement="ProductInputObj.model.SelectProcurement.Procurement" />
          {{ProductInputObj.model.SelectProcurement.Procurement.sPurchaseNumber}}
          <StepBottom v-show="!inputData.showType" v-model="inputData">
          <template #default>
            <div>
              <span class="step-bottom-h2" @click="() => {
                // input.value.step+=1
                console.log(inputData.value--);
                console.log(inputData.value);

              }">返回上一步</span>
            </div>

            <el-button class="step-bottom-button flex flex-col justify-center items-center text-white" @click="() => {
              preregisterRegister(
                {
                  photoFileId: JSON.stringify(ProductInputObj.Product.photoList),
                  type: 3,
                  orderNo: ProductInputObj.model.SelectProcurement.Procurement.sPurchaseNumber,
                  customerId: '',
                  customerRemark: '',
                  count: ProductInputObj.Product.quantity
                }
              ).then(res => {
              if (res.code == 0) {
                inputData.value++
              }
            })
            }">确认创建</el-button>
          </template>
        </StepBottom>
      </div>
      <div v-if="inputData.type == 'PCB订单'" name="PCB订单" class="gap-[10px] flex flex-col py-[20px]">
        <van-field class="rounded-[10px] h-[60px] flex items-center"
          v-model="ProductInputObj.model.SelectProcurement.Procurement.sPurchaseName" is-link readonly label="绑定PCB订单"
          placeholder="PCB订单" @click="ProductInputObj.model.SelectProcurement.show = true" />
        <SelectProcurement v-model:show="ProductInputObj.model.SelectPCB.show"
          v-model:PCB="ProductInputObj.model.SelectPCB.PCB" />
      </div>
      <div v-if="inputData.type == '客供料'" name="客供料" class="gap-[10px] flex flex-col py-[20px]">
        <van-field class="rounded-[10px] h-[60px] flex items-center"
          v-model="ProductInputObj.model.SelectCustomer.customer.companySName" is-link readonly label="绑定客户"
          placeholder="客户" @click="ProductInputObj.model.SelectCustomer.show = true" />
        <SelectCustomer v-model:customer="ProductInputObj.model.SelectCustomer.customer"
          v-model:show="ProductInputObj.model.SelectCustomer.show" />
      </div>
      <div v-if="inputData.type == '代工交货'" name="代工交货" class="gap-[10px] flex flex-col py-[20px]">
        <van-field class="rounded-[10px] h-[60px] flex items-center"
          v-model="ProductInputObj.model.SelectCustomer.customer.companySName" is-link readonly label="绑定代工"
          placeholder="代工" @click="ProductInputObj.model.SelectCustomer.show = true" />
        <SelectCustomer v-model:customer="ProductInputObj.model.SelectCustomer.customer"
          v-model:show="ProductInputObj.model.SelectCustomer.show" />
      </div>
      <div v-if="inputData.type == '外修送回'" name="外修送货" class="gap-[10px] flex flex-col py-[20px]">
        <van-field class="rounded-[10px] h-[60px] flex items-center"
          v-model="ProductInputObj.model.SelectCustomer.customer.companySName" is-link readonly label="绑定维修"
          placeholder="代工" @click="ProductInputObj.model.SelectCustomer.show = true" />
        <SelectCustomer v-model:customer="ProductInputObj.model.SelectCustomer.customer"
          v-model:show="ProductInputObj.model.SelectCustomer.show" />
      </div>
    </div>

    <div v-if="inputData.value == 2" name="创建成功" class="card flex flex-col items-center gap-[10px] py-[20px]">
      <van-image class="create-success" src="../../../public/input/创建完成.png" />
      <h2>预登录成功</h2>
      <VanButton class="create-h1"> 打印预登录码</VanButton>
      <VanButton class="create-h2" @click='() => {
        inputData.value = 0
        ProductInputObj.list = undefined
        ProductInputObj.Product = {
          photoList: [],
          customerId: "",
          productName: "",
          brand: "",
          serialList: [],
          faultMessage: "",
          quantity: 1,
          remark: "",
          businessStatus: "正常",
          // customerFeedback:""
        }
      }'> 继续预登录</VanButton>
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
