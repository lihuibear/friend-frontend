<template>
  <van-button color="#7232dd" plain @click="onEditClick">编辑</van-button>

  <van-cell-group>
    <!-- 显示用户标签并给每个标签不同的颜色 -->
    <van-cell
        v-for="(tag, index) in usertags"
        :key="index"
        :title="tag"
        value=""
    />
  </van-cell-group>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getCurrentUser } from "../services/user";
import {useRouter} from "vue-router";
const  router = useRouter();

// 定义变量存储用户标签
const usertags = ref<string[]>([]);

// 组件加载时获取用户数据并处理标签
onMounted(async () => {
  const user = await getCurrentUser();

  // 解析 tags 字符串为数组
  if (user && user.tags) {
    usertags.value = JSON.parse(user.tags);  // 解析 tags 字符串为数组
  }
});

// 编辑按钮点击事件
const onEditClick = () => {
  console.log("点击编辑按钮");
  // 在此处可以跳转到编辑页面或者打开编辑表单
  router.push('/user/tags/edit');
};

</script>

<style scoped>
/* 按钮样式 */
.van-button {
  margin-bottom: 20px; /* 按钮和标签之间增加间距 */
  transition: background-color 0.3s ease;
}

.van-button:hover {
  background-color: #5e2ec0; /* 鼠标悬停时改变按钮颜色 */
}

/* 标签样式 */
.van-cell {
  display: inline-block; /* 使标签水平排列 */
  white-space: nowrap;   /* 防止标签文字换行 */
}

</style>
