<template>
  <!-- 加载中动画 -->
  <div v-if="loading" class="loading-container">
    <van-loading size="24px" /> 💓正在为您搜索💓...
  </div>

  <!-- 用户卡片列表 -->
  <user-card-list :user-list="userList" :loading="loading"/>
  <!-- 空数据提示 -->
  <van-empty v-if="!userList || userList.length < 1" description="数据为空"/>
</template>

<script setup>
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import qs from "qs";
import {showFailToast, showSuccessToast} from "vant";
import myAxios from "../plugins/myAxios.ts";
import UserCardList from "../components/UserCardList.vue";

// 获取路由中的标签参数
const route = useRoute();
const {tags, username} = route.query; // 从路由参数中获取tags或username

const userList = ref([]);
const loading = ref(true); // 控制加载状态

onMounted(async () => {
  loading.value = true; // 开始加载

  try {
    // 根据不同的搜索模式发起请求
    let searchParams = {};

    // 如果传入了tags参数，进行标签搜索
    if (tags && tags.length > 0) {
      searchParams = {tagNameList: tags}; // 标签搜索
      const userListData = await myAxios.get('/user/search/tags', {
        params: searchParams,
        paramsSerializer: params => {
          return qs.stringify(params, {indices: false});
        }
      });

      console.log('/user/search/tags succeed', userListData);

      if (userListData?.data) {
        userListData.data.forEach(user => {
          if (user.tags) {
            user.tags = JSON.parse(user.tags); // 解析标签字符串
          }
        });

        userList.value = userListData.data;
        // showSuccessToast('标签搜索成功');
      }

      // 如果传入了username参数，进行用户名搜索
    } else if (username) {
      searchParams = {username}; // 用户名搜索
      const userListData = await myAxios.get('/user/search', {
        params: searchParams,
        paramsSerializer: params => {
          return qs.stringify(params, {indices: false});
        }
      });

      console.log('/user/search succeed', userListData);

      if (userListData?.data) {
        userListData.data.forEach(user => {
          if (user.tags) {
            user.tags = JSON.parse(user.tags); // 解析标签字符串
          }
        });

        userList.value = userListData.data;
        // showSuccessToast('用户名搜索成功');
      }

    } else {
      showFailToast('出错啦，请重新搜索');
      loading.value = false;
      return;
    }

  } catch (error) {
    // 处理请求失败
    console.error('/user/search error', error);
    showFailToast('搜索失败');
  } finally {
    loading.value = false; // 请求结束，关闭加载动画
  }
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
