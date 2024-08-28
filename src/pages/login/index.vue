<script setup lang="ts">
// import { localStorage } from '@/utils/local-storage'
// import { login } from '@/api/Base/user';
import { LockOutlined, UserOutlined } from '@vicons/antd'
// import { showNotify } from 'vant';
// import { STORAGE_TOKEN_KEY } from '@/stores/mutation-type';
import { useUser } from '@/stores/modules/user';
const userStore = useUser()
definePage({
  name: 'login',
  meta: {
  },
})

const loginObj = reactive({
  account: "320322200202088254",
  pwd: "999999",
  showKeyboard: false,
})

function _login() {
  userStore.login({
    "account": loginObj.account,
    "password": loginObj.pwd
  })
}
</script>

<template>

  <Container class="bg-[#e9ecf5] flex flex-col items-center">
    <h1 class="title-h1">拓维ERP手机端</h1>
    <h2 class="title-h2">简单·智能·高效·安全</h2>
    <div class="bg-transparent flex flex-col gap-24 mt-[70px]">
      <van-field class="input" input-align="center" :border="false" v-model="loginObj.account" placeholder="请输入账号">
        <template #left-icon>
          <UserOutlined class="w-20 h-20" />
        </template>
      </van-field>
      <van-field class="input" input-align="center" v-model="loginObj.pwd" placeholder="请输入密码">
        <template #left-icon>
          <LockOutlined class="w-20 h-20" />
        </template>
      </van-field>
      <van-button class="button button-text" @click="_login">登录</van-button>
    </div>
  </Container>
</template>
<style lang="less" scoped>
.title-h1 {
  width: 216px;
  height: 4rem;
  opacity: 1;
  font-family: Alimama ShuHeiTi;
  font-size: 36px;
  font-weight: bold;
  line-height: 4rem;
  letter-spacing: 0em;
  margin: 0px;
  background: linear-gradient(180deg, #235EFF 0%, #3F73FF 52%, #235EFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

.title-h2 {
  width: 154px;
  height: 14px;
  opacity: 1;

  font-family: 思源黑体;
  font-size: 14px;
  font-weight: normal;
  line-height: 14px;
  letter-spacing: 0em;

  /* 666 */
  color: #666666;
}

.input {
  width: 300px;
  height: 50px;
  border-radius: 25px;
  opacity: 1;

  background: #E3E8F7;

  backdrop-filter: blur(3px);
}

.input-text {
  opacity: 1;

  font-family: 思源黑体;
  font-size: 14px;
  font-weight: normal;
  line-height: 50px;
  letter-spacing: 0em;

  /* 333 */
  color: #333333;

}

.button {
  width: 300px;
  height: 50px;
  border-radius: 25px;
  opacity: 1;
  /* 主色 */
  background: #235EFF;
  backdrop-filter: blur(3px);
}

.button-text {
  opacity: 1;

  font-family: 思源黑体;
  font-size: 16px;
  font-weight: 500;
  line-height: 50px;
  text-align: center;
  letter-spacing: 0em;

  /* 纯白 */
  color: #FFFFFF;

}
</style>
