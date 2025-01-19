<template>
  <van-skeleton title avatar :row="3" :loading="props.loading" v-for="user in props.userList">
    <van-card
        :desc="user.profile"
        :title="`${user.username}（${user.planetCode}）`"
        :thumb="user.avatarUrl"
    >
      <template #tags>
        <van-tag plain type="danger" v-for="tag in user.tags" style="margin-right: 8px; margin-top: 8px">
          {{ tag }}
        </van-tag>
      </template>
      <template #footer>
        <van-button size="mini" @click="handleContact(user.email)">
          联系我
        </van-button>
      </template>
    </van-card>
  </van-skeleton>
</template>

<script setup lang="ts">
import {showDialog} from 'vant';
import {UserType} from "../models/user";

interface UserCardListProps {
  loading: boolean;
  userList: UserType[];
}

const props = withDefaults(defineProps<UserCardListProps>(), {
  loading: true,
  userList: [] as UserType[],
});

// 处理联系按钮的点击
const handleContact = (email: string) => {
  if (email) {
    showDialog({
      message: `联系邮件: ${email}`,
      showCancelButton: false, // 不展示取消按钮
    });
  } else {
    showDialog({
      message: '该用户还没有联系方式',
      showCancelButton: false,
    });
  }
};
</script>

<style scoped>

</style>
