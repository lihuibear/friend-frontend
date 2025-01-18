<template>
  <div id="teamAddPage">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
            v-model="addTeamData.name"
            name="name"
            label="队伍名"
            placeholder="请输入队伍名"
            :rules="[{ required: true, message: '请输入队伍名' }]"
        />
        <van-field
            v-model="addTeamData.description"
            rows="4"
            autosize
            label="队伍描述"
            type="textarea"
            placeholder="请输入队伍描述"
        />
        <van-field
            v-model="result"
            is-link
            readonly
            name="datePicker"
            label="过期时间"
            placeholder="点击选择过期时间"
            @click="showPicker = true"
        />
        <van-popup v-model:show="showPicker" destroy-on-close position="bottom">
          <van-date-picker
              :model-value="pickerValue"
              :min-date="minDate"
              @confirm="onConfirm"
              @cancel="showPicker = false"
          />
        </van-popup>

        <!-- 队伍状态 -->
        <van-field name="radio" label="队伍状态">
          <template #input>
            <van-radio-group v-model="addTeamData.status" direction="horizontal">
              <van-radio name="0">公开</van-radio>
              <van-radio name="1">私有</van-radio>
              <van-radio name="2">加密</van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <!-- 密码输入框 (仅在加密状态时显示) -->
        <van-field
            v-if="Number(addTeamData.status) === 2"
            v-model="addTeamData.password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入队伍密码"
            :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import myAxios from "../plugins/myAxios";
import { showFailToast, showSuccessToast } from "vant";

// 状态和日期相关的引用
const result = ref('');
const pickerValue = ref([]);
const showPicker = ref(false);
const minDate = new Date();
const id = Number(useRoute().query.id);  // 确保 id 是数字类型
const router = useRouter();

// 队伍数据模型
const addTeamData = ref({
  name: '',
  description: '',
  status: '0',  // 默认公开，状态必须是字符串类型
  password: '',
  expireTime: ''
});

// 获取队伍信息
onMounted(async () => {
  if (id <= 0) {
    showFailToast('加载队伍失败');
    return;
  }
  const res = await myAxios.get("/team/get", { params: { id } });
  if (res?.code === 0) {
    addTeamData.value = res.data;
    addTeamData.value.status = String(addTeamData.value.status);  // 确保 status 是字符串类型

    const expireTime = formatDate(res.data.expireTime);  // 格式化过期时间
    result.value = expireTime;  // 显示格式化的过期时间
    pickerValue.value = expireTime.split('-').map(Number);  // 格式化日期为数组
  } else {
    showFailToast('加载队伍失败，请刷新重试');
  }
});

// 格式化日期为 YYYY-MM-DD
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 日期选择器确认回调
const onConfirm = ({ selectedValues }) => {
  const formattedDate = `${selectedValues[0]}-${selectedValues[1].padStart(2, '0')}-${selectedValues[2].padStart(2, '0')}`;
  result.value = formattedDate;
  addTeamData.value.expireTime = formattedDate;
  pickerValue.value = selectedValues;
  showPicker.value = false;
};

// 提交表单
const onSubmit = async () => {
  const postData = {
    ...addTeamData.value,
    status: Number(addTeamData.value.status)  // 确保 status 是数字类型
  };

  const res = await myAxios.post("/team/update", postData);
  if (res?.code === 0 && res.data) {
    showSuccessToast('更新成功');
    router.push({
      path: '/team',
      replace: true,
    });
  } else {
    showFailToast('更新失败');
  }
};
</script>

<style scoped>
#teamAddPage {
  /* Optional styles */
}
</style>
