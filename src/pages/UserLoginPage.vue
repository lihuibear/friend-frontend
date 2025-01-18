<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
          v-model="userAccount"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
          v-model="userPassword"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
      />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>

</template>

<script setup lang="ts">

import {ref} from 'vue';
import myAxios from "../plugins/myAxios.ts";
import {showSuccessToast, Toast} from "vant";
import {useRouter} from "vue-router";

const router = useRouter();
``

const userAccount = ref('');
const userPassword = ref('');
const onSubmit = async () => {
  const res = await myAxios.post('/user/login', {
    userAccount: userAccount.value,
    userPassword: userPassword.value
  })
  console.log(res, '用户登录');
  if (res.code === 0 && res.data) {
    // Toast.success('登录成功');
    showSuccessToast('登录成功');
    router.replace('/'); // todo 跳转到首页 替换历史记录 不是压入 点击返回 不会再回到登录页
  }
};

</script>

<style scoped>

</style>
