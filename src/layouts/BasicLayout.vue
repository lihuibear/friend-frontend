<template>

  <!--导航栏-->
  <van-nav-bar
      title="标题"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
  >
    <template #right>
      <van-icon name="search" size="18"/>
    </template>
  </van-nav-bar>

  <!--内容-->
  <div id="content">
    <template v-if="active === 'index'">
      <Index/>
    </template>
    <template v-if="active === 'team'">
      <Team/>
    </template>
  </div>
  <!--底部tabbar-->
  <van-tabbar v-model="active" @change="onChange">
    <van-tabbar-item to="/" icon="home-o" name="index">主页</van-tabbar-item>
    <van-tabbar-item to="/team" icon="search" name="team">队伍</van-tabbar-item>
    <van-tabbar-item to="/user" icon="friends-o" name="user">个人</van-tabbar-item>
  </van-tabbar>

</template>

<script setup>
import {ref} from 'vue';
import {showToast} from 'vant';
import Index from "../pages/Index.vue";
import Team from "../pages/Team.vue";

const onClickLeft = () => alert("点击左按钮")
const onClickRight = () => alert("点击右按钮")

const active = ref("index");
const onChange = (index) => showToast(`标签 ${index}`);

</script>


<style scoped>

</style>
