<template>
  <div class="login-and-register">
    <p class="text" >登录</p>
    <div style="text-align: center;">
      <van-image
          round
          width="10rem"
          height="10rem"
          :src="loginImg"

      />
    </div>

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

      <div style="margin: 16px; display: flex; justify-content: space-between; align-items: center;">
        <van-button plain hairline type="primary" @click="goToRegister">
          没有账号？去注册
        </van-button>
        <van-button plain hairline type="primary" @click="goToContact">
          忘记密码？联系站长
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">

import {ref} from 'vue';
import myAxios from "../plugins/myAxios.ts";
import {showSuccessToast} from "vant";
import {useRoute, useRouter} from "vue-router";
import loginImg from '../assets/login.gif'

const router = useRouter();
const route = useRoute();

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
    const redirectUrl = route.query?.redirect as string ?? '/';
    window.location.href = redirectUrl; // oktodo 跳转到首页 替换历史记录 不是压入 点击返回 不会再回到登录页
  }
};


const goToRegister = () => {
  router.push('/user/register');
};
const goToContact = () => {
  window.location.href = 'https://lihuibear.cn/';
};
</script>

<style scoped>

</style>
