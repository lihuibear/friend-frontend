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
    <router-view></router-view>
  </div>
  <!--底部tabbar-->
  <van-tabbar route @change="onChange">
    <van-tabbar-item to="/" icon="home-o" name="index">主页</van-tabbar-item>
    <van-tabbar-item to="/team" icon="search" name="team">队伍</van-tabbar-item>
    <van-tabbar-item to="/user" icon="friends-o" name="user">个人</van-tabbar-item>
  </van-tabbar>

</template>

<script setup>
import {ref} from 'vue';
import {showToast} from 'vant';

const onClickLeft = () => alert("点击左按钮")
const onClickRight = () => alert("点击右按钮")

const active = ref("index");
const onChange = (index) => showToast(`标签 ${index}`);

</script>


<style scoped>

</style>
