<template>
  <template v-if="user">
    <van-cell title="当前用户" :value="user?.username"/>
    <van-cell title="修改信息" is-link to="/user/update"/>
    <van-cell title="我创建的队伍" is-link to="/user/team/create"/>
    <van-cell title="我加入的队伍" is-link to="/user/team/join"/>
  </template>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {getCurrentUser} from "../services/user";

const user = ref();

onMounted(async () => {
  user.value = await getCurrentUser();
})
</script>

<style scoped>

</style>
