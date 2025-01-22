<template>
  <div style="text-align: center;">
    <!-- 直接用 v-bind 替代 :src -->
    <van-image
        round
        width="10rem"
        height="10rem"
        :src="user?.avatarUrl"
    />
  </div>
  <template v-if="user">
    <van-cell title="当前用户" :value="user?.username"/>
    <van-cell title="修改信息" is-link to="/user/update"/>
    <van-cell title="我创建的队伍" is-link to="/user/team/create"/>
    <van-cell title="我加入的队伍" is-link to="/user/team/join"/>
  </template>
  <van-button color="#7232dd" plain @click="Logout" class="logout-button">退出登录</van-button>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {getCurrentUser} from "../services/user";
import myAxios from "../plugins/myAxios";
import {useRouter} from "vue-router";
import {showFailToast} from "vant";

const user = ref();
const router = useRouter(); // 用于导航到登录页

// 页面加载时获取当前用户信息
onMounted(async () => {
  user.value = await getCurrentUser();

})
const userImg = user?.avatarUrl;

// 退出登录
const Logout = async () => {
  try {
    // 调用后端接口退出登录
    const res = await myAxios.post('/user/logout');

    if (res?.code === 0) {
      // 退出成功，跳转到登录页
      router.push("/user/login");
    } else {
      // 退出失败，显示错误信息
      // alert("退出登录失败，请稍后重试");
    }
  } catch (error) {
    // 捕获错误并显示提示
    console.error("Logout error:", error);
    showFailToast("退出登录失败，请稍后重试")
    // alert("退出登录失败，请稍后重试");
  }
}
</script>

<style scoped>
.logout-button {
  width: 100%;
  font-size: 16px;
  height: 45px;
  position: fixed; /* 保持按钮固定在屏幕底部 */
  bottom: 60px; /* 离底部有一个间距 */
  left: 0;
  z-index: 10;
}
</style>
