<template>
  <van-notice-bar
      left-icon="volume-o"
      background="#ECF9FF"
      color="#1989FA"
      text="由于服务器资源,头像仅支持链接上传,请自行上传到图床后填写链接🙏"
  />
  <template v-if="user">
    <van-cell title="昵称" is-link to="/user/edit" :value="user.username"
              @click="toEdit('username','昵称',user.username)"/>
    <van-cell title="账号" :value="user.userAccount"/>
    <van-cell title="头像" is-link to="/user/edit" @click="toEdit('avatarUrl','头像链接',user.avatarUrl)">
      <img style="height:48px" :src="user.avatarUrl"/>
    </van-cell>

    <!-- 性别字段，根据值显示为 '男' 或 '女' -->
    <van-cell title="性别" is-link to="/user/edit" :value="genderText" @click="toEdit('gender','性别',user.gender)"/>

    <van-cell title="电话" is-link to="/user/edit" :value="user.phone" @click="toEdit('phone','电话',user.phone)"/>
    <van-cell title="邮箱" is-link to="/user/edit" :value="user.email" @click="toEdit('email','邮箱',user.email)"/>
    <van-cell title="职业" is-link to="/user/edit" :value="user.profile" @click="toEdit('profile','职业',user.profile)"/>
<!--    <van-cell title="星球编号" :value="user.planetCode"/>-->
    <van-cell title="注册时间" :value="formatDate(user.createTime)"/>
    <van-cell title="我的标签" is-link to="/user/tags"/>
  </template>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, ref, computed } from "vue";
import { getCurrentUser } from "../services/user.ts";

onMounted(async () => {
  user.value = await getCurrentUser();
})
const user = ref<any>();

const router = useRouter();

// 计算属性，用于根据性别值显示 '男' 或 '女'
const genderText = computed(() => {
  return user.value?.gender === 1 ? '男' : '女';
});

// 跳转到编辑页面
const toEdit = (editKey: string, editName: string, currentValue: string) => {
  router.push({
    path: '/user/edit',
    query: {
      editKey,
      editName,
      currentValue,
    },
  });
}
const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleString(); // 可以根据需求自定义格式
}
</script>

<style scoped>
</style>
