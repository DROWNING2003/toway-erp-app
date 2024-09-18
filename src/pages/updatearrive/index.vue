<script setup>
import { queryPreregisterMessage, updatePreregister } from '@/api/Base/preregister';
import { MinusCircleFilled } from '@vicons/antd'
definePage({
    name: 'updatearrive',
    meta: {
        level: 2,
        title: '更新到货',
    },
})
const route = useRoute()

const updatearrive = reactive({
    Product: {
        sPreregisterNo:"",
        photoList: [],
        serialList: [],
        faultMessage: "",
        productName: "",
        quantity: 0,
        brand: "",
        companyName: ""
    },
    filter: {
        type: "",
        showType: false,
        model: {
            SelectCustomer: {
                customer: {},
                show: false,
            },
            SelectBusinessStatus: {
                show: false,
                businessStatus: 0,
                columns: [
                    { text: '正常', value: 1 },
                    { text: '保修', value: 2 },
                    { text: '走账', value: 3 },
                ],
            },
            SelectProcurement: {
                Procurement: {},
                show: false,
            },
            SelectPCB: {
                PCB: {},
                show: false,
            }
        }
    },
    data: {},
    reload: () => {
        queryPreregisterMessage({
            "preNumber": route.query.id
        }).then(res => {
            updatearrive.Product.photoList = JSON.parse(res.data.sPhotoUrl)
            updatearrive.Product.quantity = res.data.nPreregisterNum
            updatearrive.Product.productName = res.data.sProductName
            updatearrive.Product.companyName = res.data.company?.sName
            updatearrive.Product.brand = res.data.lastRepairRecord?.brand
            updatearrive.Product.serialList = JSON.parse(res.data.lastRepairRecord?.serialList)
            updatearrive.Product.faultMessage = res.data.lastRepairRecord?.faultMessage
            updatearrive.filter.type =  getLabelByValue(res.data.nType)
            updatearrive.filter.model.SelectCustomer.customer.companySName = res.data.company?.sName
            updatearrive.Product.sPreregisterNo = res.data.sPreregisterNo
        })
    }
})
onMounted(() => {
    updatearrive.reload()
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
const router = useRouter()
function onBack() {
    if (window.history.state.back)
        history.back()
    else
        router.replace('/')
}

const sn = ref("")
function addSN() {
    updatearrive.Product.serialList.push(sn.value)
    sn.value = ""
}

function updateProduct(){
    switch (updatearrive.filter.type) {
    case '客户退换':

      return;
    case '客户送修':
        updatePreregister({
            sPreregisterNo:updatearrive.Product.sPreregisterNo,
            sPhotoUrl:updatearrive.Product.photoList,
            nPreregisterNum:updatearrive.Product.quantity,
            nType:updatearrive.filter.type,
            // sTypeOrderNo:
            sProductName:updatearrive.Product.productName,
            nCustomerId:updatearrive.filter.model.SelectCustomer.customer.nCustomerId,
            // sCustomerRemark:updatearrive.Product
            
        })
      return ;
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
</script>

<template>
    <div class="py-70 px-20 flex flex-col gap-10">
        <div name="图片" class="flex flex-col w-[100%] h-[100%] bg-white relative p-10">
            <a class="text-12">登记图片</a>
            <EImageList v-model:photoList="updatearrive.Product.photoList" />
            <van-stepper class="absolute bottom-0 right-10px" v-model="updatearrive.Product.quantity" />
        </div>

        <div name="分类">
            <van-field class="rounded-[10px] h-[60px] flex items-center" v-model="updatearrive.filter.type" is-link
                readonly label="来货分类" placeholder="选择分类" @click="updatearrive.filter.showType = true" />
            <van-popup teleport="#app" v-model:show="updatearrive.filter.showType" round position="bottom">
                <van-picker :columns="columns" @cancel="updatearrive.filter.showType = false" @confirm="({ selectedOptions }) => {
                    updatearrive.filter.showType = false;
                    updatearrive.filter.type = selectedOptions[0].text;
                }" />
            </van-popup>
        </div>

        <div name="客户送修" v-if="updatearrive.filter.type == '客户送修'" class="gap-[10px] flex flex-col py-[20px]">
            <van-field class="rounded-[10px] h-[60px] flex items-center"
                v-model="updatearrive.filter.model.SelectCustomer.customer.companySName" is-link readonly label="绑定客户"
                placeholder="客户" @click="updatearrive.filter.model.SelectCustomer.show = true" />
            <SelectCustomer v-model:customer="updatearrive.filter.model.SelectCustomer.customer"
                v-model:show="updatearrive.filter.model.SelectCustomer.show" />
            <van-field class="rounded-[10px] h-[60px] flex items-center" v-model="updatearrive.Product.productName"
                label="设备名称" placeholder="请输入" />
            <van-field class="rounded-[10px] h-[60px] flex items-center" v-model="updatearrive.Product.brand"
                label="品牌名称" placeholder="请输入" />
            <van-field class="rounded-[10px] h-[60px] flex items-center"
                v-model="updatearrive.filter.model.SelectBusinessStatus.businessStatus" is-link readonly label="业务状态"
                placeholder="请输入" @click="updatearrive.filter.model.SelectBusinessStatus.show = true" />
            <van-popup v-model:show="updatearrive.filter.model.SelectBusinessStatus.show" round position="bottom">
                <van-picker :columns="updatearrive.filter.model.SelectBusinessStatus.columns"
                    @cancel="updatearrive.filter.model.SelectBusinessStatus.show = false" @confirm="({ selectedOptions }) => {
                        updatearrive.filter.model.SelectBusinessStatus.show = false
                        updatearrive.filter.model.SelectBusinessStatus.businessStatus = selectedOptions[0].text
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
                <div class="flex flex-row h-20 items-center px-10"
                    v-for="(item, index) in updatearrive.Product.serialList" :key="index">
                    <MinusCircleFilled @click="() => {
                        updatearrive.Product.serialList.splice(index, 1)
                    }" class="w-16 h-16 c-[#ff4000]" />{{ item }}
                </div>

            </div>

            <van-field v-model="updatearrive.Product.faultMessage" class="rounded-[10px]" rows="2" autosize
                label="客描故障/要求" type="textarea" maxlength="50" placeholder="请输入留言" show-word-limit />
        </div>

        <div name="采购物料" v-if="updatearrive.filter.type == '采购物料'" class="gap-[10px] flex flex-col py-[20px]">
            <van-field class="rounded-[10px] h-[60px] flex items-center"
                v-model="updatearrive.filter.model.SelectProcurement.Procurement.sPurchaseName" is-link readonly
                label="绑定采购" placeholder="采购单" @click="updatearrive.filter.model.SelectProcurement.show = true" />
            <SelectProcurement v-model:show="updatearrive.filter.model.SelectProcurement.show"
                v-model:procurement="updatearrive.filter.model.SelectProcurement.Procurement" />
        </div>

        <div name="PCB订单" v-if="updatearrive.filter.type == 'PCB订单'" class="gap-[10px] flex flex-col py-[20px]">
            <van-field class="rounded-[10px] h-[60px] flex items-center"
                v-model="updatearrive.filter.model.SelectPCB.PCB" is-link readonly label="绑定PCB订单" placeholder="PCB订单"
                @click="updatearrive.filter.model.SelectPCB.show = true" />
            <SelectProcurement v-model:show="updatearrive.filter.model.SelectPCB.show"
                v-model:PCB="updatearrive.filter.model.SelectPCB.PCB" />
        </div>

        <div name="客供料" v-if="updatearrive.filter.type == '客供料'" class="gap-[10px] flex flex-col py-[20px]">
            <van-field class="rounded-[10px] h-[60px] flex items-center"
                v-model="updatearrive.filter.model.SelectCustomer.customer.companySName" is-link readonly label="绑定客户"
                placeholder="客户" @click="updatearrive.filter.model.SelectCustomer.show = true" />
            <SelectCustomer v-model:customer="updatearrive.filter.model.SelectCustomer.customer"
                v-model:show="updatearrive.filter.model.SelectCustomer.show" />
        </div>
        <StepBottom>
            <template #default>
                <div>
                    <span class="step-bottom-h2" @click="onBack">取消</span>
                </div>

                <el-button class="step-bottom-button flex flex-col justify-center items-center text-white" @click="updateProduct">更新</el-button>
            </template>
        </StepBottom>
    </div>
</template>

<style lang="less" scoped></style>
