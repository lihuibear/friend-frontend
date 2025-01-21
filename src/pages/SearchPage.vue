<template>
  <van-notice-bar
      left-icon="volume-o"
      background="#ECF9FF"
      color="#1989FA"
      text="通过标签搜索时，可以自定义标签搜索，但是请您选择您需要的标签(X掉您不需要的标签)"
  />
  <form action="/">
    <!-- 搜索框，允许输入自定义标签 -->
    <van-search
        v-model="searchText"
        show-action
        :placeholder="placeholdertext"
        @search="onSearch"
        @cancel="onCancel"
        @input="onInputChange"
    />
  </form>

  <!-- 搜索模式切换开关 -->
  <van-cell center title="切换搜索模式">
    <template #right-icon>
      <van-switch v-model="toggleSearchMode" size="24"/>
    </template>
  </van-cell>

  <!-- 如果是标签搜索，显示已选标签和选择标签部分 -->
  <div v-if="!toggleSearchMode">
    <!-- 已选标签展示 -->
    <van-divider content-position="left">已选标签</van-divider>
    <div v-if="activeIds.length === 0">请选择标签</div>
    <van-row gutter="16" style="padding:0 16px">
      <van-col v-for="tag in activeIds" :key="tag">
        <van-tag closeable size="small" type="primary" @close="doClose(tag)">
          {{ tag }}
        </van-tag>
      </van-col>
    </van-row>

    <!-- 可选择标签 -->
    <van-divider content-position="left">选择标签</van-divider>
    <van-tree-select
        v-model:active-id="activeIds"
        v-model:main-active-index="activeIndex"
        :items="tagList"
        multiple
        placeholder="选择标签"
    />
  </div>

  <!-- 搜索按钮 -->
  <div style="padding: 12px">
    <van-button block type="primary" @click="doSearchResult">
      搜索
    </van-button>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {ref, watchEffect} from 'vue';

const router = useRouter();

// 输入框内容
const searchText = ref('');
// 已选中的标签
const activeIds = ref([]);
// 主选中项索引
const activeIndex = ref(0);

// 搜索模式开关（默认搜索标签）
const toggleSearchMode = ref(false);

// 初始标签数据
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

// 标签列表，带有搜索功能的标签列表
let tagList = ref(originTagList);
const placeholdertext = ref('请输入搜索的内容');

// 切换搜索模式
watchEffect(() => {
  if (toggleSearchMode.value) {
    placeholdertext.value = '请输入用户名';
    // 切换为用户名搜索模式
    tagList.value = []; // 清空标签列表
  } else {
    // 切换为标签搜索模式
    placeholdertext.value = '请输入标签';
    tagList.value = originTagList;
  }
});

// 搜索处理
const onSearch = (val: string) => {
  if (!val) {
    tagList.value = originTagList; // 如果没有输入内容，恢复原始标签列表
    return;
  }

  if (toggleSearchMode.value) {
    // 如果是用户名搜索
    console.log('用户名搜索:', val); // 这里可以进行实际的用户名搜索操作
  } else {
    // 如果是标签搜索
    tagList.value = originTagList.map(parentTag => {
      const tempChildren = parentTag.children.filter(item => item.text.includes(val));
      return {...parentTag, children: tempChildren};
    });
  }
};

// 取消搜索，恢复所有标签
const onCancel = () => {
  searchText.value = '';
  tagList.value = originTagList;
};

// 输入框内容改变时处理自定义标签输入
const onInputChange = (event: Event) => {
  const inputValue = (event.target as HTMLInputElement).value;

  if (inputValue && !activeIds.value.includes(inputValue)) {
    // 如果输入框内容不是已有的标签，且未被选中过，则添加到已选标签
    activeIds.value.push(inputValue);
  }
};

// 移除标签
const doClose = (tag: string) => {
  activeIds.value = activeIds.value.filter(item => item !== tag);
};

// 点击搜索按钮时，跳转到结果页面并传递选中的标签
const doSearchResult = () => {
  if (toggleSearchMode.value) {
    // 用户名搜索
    router.push({
      path: '/user/list',
      query: {username: searchText.value}
    });
  } else {
    // 标签搜索
    router.push({
      path: '/user/list',
      query: {tags: activeIds.value}
    });
  }
};
</script>

<style scoped>
/* 添加一些样式优化 */
</style>
