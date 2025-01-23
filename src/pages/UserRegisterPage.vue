<template>
  <div class="login-and-register">
    <p class="text" >注册</p>
    <div style="text-align: center;">
      <van-image
          round
          width="10rem"
          height="10rem"
          position="right"
          :src="registerImg"
      />
    </div>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
            v-model="userAccount"
            name="用户名"
            label="用户名"
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
            v-model="userPassword"
            type="password"
            name="密码"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-field
            v-model="checkPassword"
            type="password"
            name="确认密码"
            label="确认密码"
            placeholder="请再次输入密码"
            :rules="[{ required: true, message: '请填写确认密码' }]"
        />
<!--        <van-field-->
<!--            v-model="planetCode"-->
<!--            name="邀请码"-->
<!--            label="邀请码"-->
<!--            placeholder="请输入邀请码（选填）"-->
<!--        />-->
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          注册
        </van-button>
      </div>

      <div style="margin: 16px;">
        <van-button round block type="primary" @click="goToLogin">
          已有账号？去登录
        </van-button>
      </div>

    </van-form>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import myAxios from "../plugins/myAxios.ts";
import {showFailToast, showSuccessToast} from "vant";
import {useRouter} from "vue-router";
import registerImg from '../assets/register.gif';
const router = useRouter();

const userAccount = ref('');
const userPassword = ref('');
const checkPassword = ref('');
// const planetCode = ref('');

const onSubmit = async () => {
  if (userPassword.value !== checkPassword.value) {
    showFailToast('两次输入的密码不一致');
    return;
  }

  const res = await myAxios.post('/user/register', {
    userAccount: userAccount.value,
    userPassword: userPassword.value,
    checkPassword: checkPassword.value,
    // planetCode: planetCode.value
  });

  console.log(res, '用户注册');

  if (res.code === 0) {
    showSuccessToast('注册成功');
    router.push('/user/login'); // 注册成功后跳转到登录页
  } else {
    showFailToast(res.message || '注册失败');
  }
};

const goToLogin = () => {
  router.push('/user/login');
};

</script>

<style scoped>
</style>
