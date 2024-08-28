<script setup lang="ts">
import { STORAGE_TOKEN_KEY } from '@/stores/mutation-type';
import { localStorage } from '@/utils/local-storage';
import { LockOutlined, UserOutlined } from '@vicons/antd'

definePage({
  name: 'profile',
  meta: {
    level: 1,
  },
})

function logout() {
  localStorage.remove(STORAGE_TOKEN_KEY)
  location.replace("/login")
}
</script>

<template>
  <div class="head py-70 px-20 w-[100%] h-[100%] flex flex-col items-center">
    <div class="w-[100%] h-[250px] flex flex-col items-center" name="头像">
      <div class="avator" src=""></div>
      <h1 class="avator-h1">用户名称</h1>
      <h2 class="avator-h2">仓库管理员</h2>
    </div>
    <div name="操作栏" class="flex flex-col gap-[10px]">
      <van-field class="item" is-link readonly label="修改密码" @click="">
        <template #left-icon>
          <LockOutlined class="w-20 h-20" />
        </template>
      </van-field>
      <van-field class="item" is-link readonly label="退出登录" @click="logout">
        <template #left-icon>
          <UserOutlined class="w-20 h-20" />
        </template>
      </van-field>
    </div>

  </div>
</template>
<style lang="less">

.item {
  width: 335px;
  height: 50px;
  border-radius: 10px;
  opacity: 0.5;

  /* 纯白 */
  background: #FFFFFF;
}

.avator-h1 {
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

.avator-h2 {
  height: 1.48%;
  opacity: 1;

  font-family: 思源黑体;
  font-size: 12px;
  font-weight: normal;
  line-height: 12px;
  letter-spacing: 0em;

  /* 666 */
  color: #666666;

}

.head {
  background: linear-gradient(180deg, #4c70dc 0%, #849ee0 0%, rgba(242, 244, 248, 0) 100%);
}

.avator {
  width: 110px;
  height: 110px;
  border-radius: 30px;
  opacity: 1;
  border: 3px solid rgba(255, 255, 255, 0.5);
}
</style>