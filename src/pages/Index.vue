<template>
  <van-notice-bar
      left-icon="volume-o"
      background="#ECF9FF"
      color="#1989FA"
      text="富强 民主 文明 和谐 自由 平等 公正 法制 爱国 敬业 诚信 友善"
  />
  <van-cell center title="心动模式">
    <template #right-icon>
      <van-switch v-model="isMatchMode" size="24"/>
    </template>
  </van-cell>

  <!-- 加载中动画 -->
  <div v-if="loading" class="loading-container">
    <van-loading size="24px"/>
    💓正在为您匹配💓...
  </div>

  <!-- 用户卡片列表 -->
  <user-card-list :user-list="userList" :loading="loading"/>

  <!-- 空数据提示 -->
  <van-empty v-if="!userList || userList.length < 1" description="数据为空"/>

  <!-- 分页按钮 -->
  <van-pagination
      v-if="!loading && userList.length > 0 && isMatchMode == false"
      v-model="currentPage"
      :total-items="totalItems"
      :show-page-size="3"
      force-ellipses
      @change="loadData"
  />
</template>

<script setup lang="ts">
import {ref, watchEffect} from 'vue';
import myAxios from "../plugins/myAxios";
import {showFailToast} from "vant";
import UserCardList from "../components/UserCardList.vue";
import {UserType} from "../models/user";

const isMatchMode = ref<boolean>(false);
const currentPage = ref<number>(1);
const userList = ref([]);
const loading = ref(true);
const totalItems = ref<number>(125); // 假设总数据量为125，实际值可以从API响应中获取

/**
 * 加载数据
 */
const loadData = async () => {
  let userListData;
  loading.value = true;

  // 心动模式，根据标签匹配用户
  if (isMatchMode.value) {
    const num = 10;
    userListData = await myAxios.get('/user/match', {
      params: {
        num,
      },
    })
        .then(function (response) {
          console.log('/user/match succeed', response);
          return response?.data;
        })
        .catch(function (error) {
          console.error('/user/match error', error);
          showFailToast('请求失败');
        });
  } else {
    // 普通模式，直接分页查询用户
    userListData = await myAxios.get('/user/recommend', {
      params: {
        pageSize: 8,
        pageNum: currentPage.value,
      },
    })
        .then(function (response) {
          console.log('/user/recommend succeed', response);
          return response?.data?.records;
        })
        .catch(function (error) {
          console.error('/user/recommend error', error);
          showFailToast('请求失败');
        });
  }

  if (userListData) {
    userListData.forEach((user: UserType) => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags);
      }
    });
    userList.value = userListData;
  }
  loading.value = false;
};

watchEffect(() => {
  loadData();
});
</script>

<style scoped>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #666;
  margin-top: 20px;
}

.loading-container van-loading {
  margin-right: 8px;
}
</style>
