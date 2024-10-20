<template>
  <form action="/">
    <van-search
        v-model="searchText"
        show-action
        placeholder="请输入要搜索的标签"
        @search="onSearch"
        @cancel="onCancel"
    />
  </form>
  <van-divider content-position="left">已选标签</van-divider>
  <div v-if="tagList.length===0">请选择标签</div>
  <van-row gutter="16" style="padding:0 16px">
    <van-col v-for="tag in activeIds">
      <van-tag closeable size="small" type="primary" @close="doClose(tag)">
        {{ tag }}
      </van-tag>
    </van-col>
  </van-row>
  <van-divider content-position="left">选择标签</van-divider>
  <van-tree-select
      v-model:active-id="activeIds"
      v-model:main-active-index="activeIndex"
      :items="tagList"
  />
</template>

<script setup lang="ts">

import {ref} from 'vue';

//已选中的标签

const searchText = ref('');
const activeIds = ref([]);
const activeIndex = ref(0);


const originTagList = [
  {
    text: '年级',
    children: [
      {text: '大一', id: '大一'},
      {text: '大二', id: '大二'},
      {text: '大三', id: '大三'},
    ],
  },
  {
    text: '性别',
    children: [
      {text: '男', id: '男'},
      {text: '女', id: '女'},
    ],
  },
  {
    text: '专业',
    children: [
      {text: '计算机', id: '计算机'},
      {text: '软件工程', id: '软件工程'}
    ],
  },
];


// 标签列表
let tagList = ref(originTagList);
/**
 * 搜素过滤
 * @param val
 */
const onSearch = (val) => {
  tagList.value = originTagList.map(parentTag => {
    const tempChildren = [...parentTag.children];
    const tempParentTag = {...parentTag};
    tempParentTag.children = tempChildren.filter(item => item.text.includes(searchText.value));
    return tempParentTag;
  });
}
const onCancel = (val) => {
  searchText.value = '';
  tagList.value = originTagList;
}


//移除标签
const doClose = (tag) => {
  activeIds.value = activeIds.value.filter(item => item !== tag);
}
</script>

<style scoped>

</style>
