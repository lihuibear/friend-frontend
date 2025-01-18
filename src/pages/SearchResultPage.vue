<template>
  <user-card-list :user-list="userList"/>
  <van-empty v-if="!userList || userList.length<1" description="搜索结果为空"/>

</template>

<script setup>
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import qs from "qs";
import {showFailToast, showSuccessToast} from "vant";
import myAxios from "../plugins/myAxios.ts";
import UserCardList from "../components/UserCardList.vue";
//已选中的标签

const route = useRoute();

const {tags} = route.query;
const userList = ref([]);

onMounted(async () => {
  // console.log( "钩子启动");
  const userListData = await myAxios.get('/user/search/tags', {
    params: {
      tagNameList: tags
    },
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    }
  }).then(function (response) {
    // 处理成功情况
    console.log('/user/search/tags succeed', response);
    showSuccessToast('搜索成功');
    console.log(response.data);
    return response?.data;
  })
      .catch(function (error) {
        // 处理错误情况
        console.log('/user/search/tags error', error);
        // Toast.fail('搜索失败');
        showFailToast('搜索失败')
      })
  if (userListData) {
    userListData.forEach(user => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags)
      }
    })
    userList.value = userListData;

  }
})


// const mockUser = {
//   id: 1,
//   username: "lihui",
//   userAccount: "lihui",
//   avatarurl: "https://blog-1306153177.cos.ap-beijing.myqcloud.com/202404042115281.png",
//   profile: "lihui,我是李慧，是个小学生，喜欢唱跳rap篮球",
//   gender: 0,
//   phone: '1111111',
//   email: '1111111111@aasasd.com',
//   userRole: 0,
//   planetcode: '111',
//   tags: ['tag1', 'tag2', 'java', 'emo'],
//   createTime: new Date()
// }

</script>

<style scoped>

</style>

