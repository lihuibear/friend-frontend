<template>
  <van-cell-group>
    <van-cell v-for="(tag, index) in usertags" :key="index" class="tag-cell">
      <template #title>
        <!-- 如果正在编辑该标签，显示输入框，否则显示标签文本 -->
        <div v-if="editIndex === index" class="edit-input">
          <van-field
              v-model="editedTag"
              placeholder="编辑标签"
              @blur="saveEditedTag"
              clearable
              class="tag-edit-field"
          />
        </div>
        <div v-else class="tag-text">
          {{ tag }}
        </div>
      </template>
      <template #value>
        <van-icon name="delete" class="delete-icon" @click="removeTag(index)"/>
        <van-icon name="edit" class="edit-icon" @click="editTag(index)"/>
      </template>
    </van-cell>

    <!-- 输入框：用于添加新标签 -->
    <van-cell>
      <van-field v-model="newTag" placeholder="输入新的标签" class="add-tag-field"/>
    </van-cell>

    <van-button color="#ff7f50" @click="addTag" class="add-tag-button">添加标签</van-button>
    <van-button color="#7232dd" plain @click="saveTags" class="complete-button">完成</van-button>
  </van-cell-group>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getCurrentUser } from "../services/user";
import myAxios from "../plugins/myAxios.ts"; // 引入获取当前用户信息的 API

const router = useRouter();

// 定义变量存储用户标签和新标签
const usertags = ref<string[]>([]);
const newTag = ref("");
const editIndex = ref<number | null>(null); // 用于标识正在编辑的标签
const editedTag = ref(""); // 用于存储正在编辑的标签

// 组件加载时获取用户数据并处理标签
onMounted(async () => {
  const user = await getCurrentUser();

  // 解析 tags 字符串为数组
  if (user && user.tags) {
    usertags.value = JSON.parse(user.tags);  // 解析 tags 字符串为数组
  }
});

// 删除标签
const removeTag = async (index: number) => {
  const tagToRemove = usertags.value[index];
  try {
    // 调用后端接口删除标签
    const response = await updateUserTags("remove", tagToRemove, tagToRemove);
    if (response.status === 200) {
      usertags.value.splice(index, 1);  // 成功删除标签
    } else {
      console.error("删除标签失败", response);
    }
  } catch (error) {
    console.error("删除标签请求失败", error);
  }
};

// 添加新标签
const addTag = async () => {
  if (newTag.value.trim()) {
    try {
      // 调用后端接口添加标签
      const response = await updateUserTags("add", newTag.value.trim(), newTag.value.trim());
      if (response.status === 200) {
        usertags.value.push(newTag.value.trim()); // 添加到标签列表
        newTag.value = ""; // 清空输入框
      } else {
        console.error("添加标签失败", response);
      }
    } catch (error) {
      console.error("添加标签请求失败", error);
    }
  }
};

// 编辑标签
const editTag = (index: number) => {
  editIndex.value = index; // 设置正在编辑的标签的索引
  editedTag.value = usertags.value[index]; // 设置正在编辑的标签的内容
};

// 保存编辑后的标签
const saveEditedTag = async () => {
  if (editIndex.value !== null && editedTag.value.trim()) {
    const oldTag = usertags.value[editIndex.value];
    const newTagValue = editedTag.value.trim();

    // 调用后端接口更新标签
    try {
      const response = await updateUserTags("update", oldTag, newTagValue);
      if (response.status === 200) {
        usertags.value[editIndex.value] = newTagValue; // 更新标签
        editIndex.value = null; // 清空编辑状态
        editedTag.value = ""; // 清空编辑内容
      } else {
        console.error("更新标签失败", response);
      }
    } catch (error) {
      console.error("更新标签请求失败", error);
    }
  }
};

// 保存标签并更新用户
const saveTags = async () => {
  const updatedTags = JSON.stringify(usertags.value); // 将标签列表转为 JSON 字符串
  try {
    // 调用 API 更新用户标签
    const response = await updateUserTags("update", "", updatedTags);
    if (response.status === 200) {
      router.back(); // 保存完后返回上一页
    } else {
      console.error("更新标签失败", response);
    }
  } catch (error) {
    console.error("更新标签请求失败", error);
  }
};

// 更新用户标签（API 请求）
const updateUserTags = async (operation: string, oldTag: string, newTag: string) => {
  try {
    const response = await myAxios.post("/user/updateTags", {
      oldTag,
      newTag,
      operation
    });
    return response;
  } catch (error) {
    console.error("API 请求失败:", error);
    throw error; // 抛出错误以便上层捕获
  }
};
</script>

<style scoped>
/* 按钮样式 */
.van-button {
  margin-bottom: 20px; /* 按钮和标签之间增加间距 */
  transition: background-color 0.3s ease;
}

.complete-button {
  width: 100%; /* 完成按钮占满整行 */
  margin-bottom: 30px;
  font-size: 16px;
  height: 45px;
}

/* 标签样式 */
.van-cell {
  display: inline-block;
  white-space: nowrap;
}

.tag-cell {
  background-color: #f9f9f9;
  margin-bottom: 12px;
  border-radius: 8px;
  padding: 10px 15px;
}

.tag-text {
  font-size: 16px;
  color: #333;
  display: inline-block;
}

.tag-edit-field {
  width: 100%;
}

.edit-input {
  width: 100%;
}

/* 编辑、删除按钮样式 */
.van-icon {
  cursor: pointer;
  margin-left: 10px;
}

/* 输入框和添加按钮样式 */
.add-tag-field {
  margin-top: 15px;
}

.van-cell-group {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px); /* 确保标签区域可以滚动，减去按钮的高度 */
  overflow-y: auto; /* 使标签区域可滚动 */
  padding-bottom: 60px; /* 确保底部不被按钮遮挡 */
}

.add-tag-button {
  width: 100%;
  font-size: 16px;
  height: 45px;
  position: fixed; /* 保持按钮固定在屏幕底部 */
  bottom: 30px;  /* 离底部有一个间距 */
  left: 0;
  z-index: 10;
}

.complete-button {
  width: 100%; /* 完成按钮占满整行 */
  margin-bottom: 30px;
  font-size: 16px;
  height: 45px;
  position: fixed;
  bottom: 70px;  /* 完成按钮距离底部 */
  left: 0;
  z-index: 10;
}
</style>
