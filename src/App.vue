<script setup lang="ts">

import BasicLayout from "./layouts/BasicLayout.vue";
</script>

<template>
  <div id="app">
    <!-- 判断是否隐藏 BasicLayout -->
    <BasicLayout v-if="!$route.meta.hideLayout">
      <router-view />
    </BasicLayout>
    <router-view v-else />
  </div>
</template>

<style>

</style>
