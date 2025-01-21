<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <!-- 判断是否是性别字段 -->
      <template v-if="editUser.editKey === 'gender'">
        <van-radio-group v-model="editUser.currentValue">
          <van-radio name="1">男</van-radio>
          <van-radio name="0">女</van-radio>
        </van-radio-group>
      </template>
      <!-- 其他字段使用普通输入框 -->
      <template v-else>
        <van-field
            v-model="editUser.currentValue"
            :name="editUser.editKey"
            :label="editUser.editName"
            :placeholder="`请输入${editUser.editName}`"
        />
      </template>
    </van-cell-group>

    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit" :loading="isLoading">
        提交
      </van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {showFailToast, showSuccessToast} from "vant";
import myAxios from "../plugins/myAxios.ts";
import {getCurrentUser} from "../services/user.ts";

const router = useRouter();

// 获取页面传递的参数
const route = useRoute();
const editUser = ref({
  editKey: route.query.editKey as string,
  editName: route.query.editName as string,
  currentValue: route.query.currentValue as string // 默认为用户当前的值
});

const isLoading = ref(false);

const onSubmit = async () => {
  const currentUser = await getCurrentUser(); // 获取当前用户

  if (!currentUser) {
    showFailToast('请先登录');
    return;
  }

  isLoading.value = true;  // 提交时显示加载状态

  const res = await myAxios.post('/user/update', {
    'id': currentUser.id,
    [editUser.value.editKey as string]: editUser.value.currentValue
  });

  isLoading.value = false;  // 提交完成后恢复

  if (res.data > 0) {
    showSuccessToast('修改成功');
    router.back();
  } else {
    showFailToast('修改失败');
  }
};
</script>

<style scoped>
</style>
