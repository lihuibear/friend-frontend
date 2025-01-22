<template>
  <van-cell-group>
    <van-cell v-for="(tag, index) in usertags" :key="index" class="tag-cell">
      <template #title>
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
        <van-icon name="delete" class="delete-icon" @click="removeTag(index)" />
        <van-icon name="edit" class="edit-icon" @click="editTag(index)" />
      </template>
    </van-cell>

    <van-cell v-if="isAdding">
      <van-field
          v-model="newTag"
          placeholder="输入新的标签"
          class="add-tag-field"
      />
    </van-cell>

    <van-button
        v-if="!isAdding"
        color="#ff7f50"
        @click="startAddingTag"
        class="add-tag-button"
    >
      添加标签
    </van-button>

    <van-button
        color="#7232dd"
        plain
        @click="saveTags"
        class="complete-button"
    >
      完成
    </van-button>
  </van-cell-group>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { getCurrentUser } from "../services/user";
import myAxios from "../plugins/myAxios.ts"; // 引入获取当前用户信息的 API

const router = useRouter();

// 定义变量存储用户标签和新标签
const usertags = ref<string[]>([]);
const newTag = ref("");
const editIndex = ref<number | null>(null); // 用于标识正在编辑的标签
const editedTag = ref(""); // 用于存储正在编辑的标签
const isAdding = ref(false); // 控制是否显示添加标签输入框
const isTagDeleted = ref(false); // 标记是否有标签被删除
const hasSubmitted = ref(false); // 标记是否已提交过标签更新

// 组件加载时获取用户数据并处理标签
onMounted(async () => {
  const user = await getCurrentUser();
  if (user?.tags) {
    usertags.value = JSON.parse(user.tags);  // 解析 tags 字符串为数组
  }
});

// 删除标签
const removeTag = async (index: number) => {
  const tagToRemove = usertags.value[index];
  try {
    const res = await updateUserTags("remove", tagToRemove, tagToRemove);
    if (res?.code === 0) {
      usertags.value.splice(index, 1);
      isTagDeleted.value = true;  // 标记有标签被删除
    } else {
      console.error("删除标签失败", res);
    }
  } catch (error) {
    console.error("删除标签请求失败", error);
  } finally {
    // 删除后清空删除标记
    isTagDeleted.value = false;
  }
};

// 开始添加标签，显示输入框
const startAddingTag = () => {
  isAdding.value = true;
};

// 添加新标签
const addTag = async () => {
  if (newTag.value.trim()) {
    try {
      const res = await updateUserTags("add", newTag.value.trim(), newTag.value.trim());
      if (res?.code === 0) {
        usertags.value.push(newTag.value.trim());
        newTag.value = ""; // 清空输入框
        isAdding.value = false; // 隐藏输入框
      } else {
        console.error("添加标签失败", res);
      }
    } catch (error) {
      console.error("添加标签请求失败", error);
    }
  }
};

// 编辑标签
const editTag = (index: number) => {
  editIndex.value = index;
  editedTag.value = usertags.value[index];
};

// 保存编辑后的标签
const saveEditedTag = async () => {
  if (editIndex.value !== null && editedTag.value.trim()) {
    const oldTag = usertags.value[editIndex.value];
    const newTagValue = editedTag.value.trim();

    try {
      const res = await updateUserTags("update", oldTag, newTagValue);
      if (res?.code === 0) {
        usertags.value[editIndex.value] = newTagValue;
        editIndex.value = null;
        editedTag.value = "";
      } else {
        console.error("更新标签失败", res);
      }
    } catch (error) {
      console.error("更新标签请求失败", error);
    }
  }
};

// 保存标签并更新用户
const saveTags = async () => {
  console.log("saveTags called");

  // 如果已经提交过，直接返回
  if (hasSubmitted.value) {
    console.log("已经提交过标签，返回上一页");
    router.back(); // 返回上一页
    return;
  }

  // 如果正在添加标签，先处理添加
  if (isAdding.value && newTag.value.trim()) {
    await addTag(); // 提交新的标签
  }

  // 检查是否有未提交的编辑或删除
  const isEditing = editIndex.value !== null || newTag.value.trim() !== "";
  const isDeleted = isTagDeleted.value;

  // 如果有编辑或删除操作，提交更新
  if (isEditing || isDeleted) {
    const updatedTags = JSON.stringify(usertags.value); // 将标签列表转为 JSON 字符串
    try {
      console.log("正在提交更新");
      // 确保调用更新标签的 API 请求
      const res = await updateUserTags("update", "", updatedTags);
      if (res?.code === 0) {
        console.log("标签更新成功");
        hasSubmitted.value = true; // 标记已提交
      } else {
        console.error("更新标签失败", res);
      }
    } catch (error) {
      console.error("更新标签请求失败", error);
    }
  } else {
    // 如果没有编辑、添加或删除操作，直接返回上一页
    console.log("没有标签更新，直接返回");
    router.back();
  }
};

// 更新用户标签（API 请求）
const updateUserTags = async (operation: string, oldTag: string, newTag: string) => {
  try {
    const res = await myAxios.post("/user/updateTags", {
      operation,
      oldTag,
      newTag
    });
    return res;
  } catch (error) {
    console.error("API 请求失败:", error);
    throw error;
  }
};
</script>

<style scoped>
.van-button {
  margin-bottom: 20px;
  transition: background-color 0.3s ease;
}

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

.van-icon {
  cursor: pointer;
  margin-left: 10px;
}

.add-tag-field {
  margin-top: 15px;
}

.van-cell-group {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
  overflow-y: auto;
  padding-bottom: 60px;
}

.add-tag-button {
  width: 100%;
  margin-bottom: 40px;
  font-size: 16px;
  height: 45px;
  position: fixed;
  bottom: 70px;
  left: 0;
  z-index: 10;
}

.complete-button {
  width: 100%;
  font-size: 16px;
  height: 45px;
  position: fixed;
  bottom: 35px;
  left: 0;
  z-index: 10;
}
</style>
