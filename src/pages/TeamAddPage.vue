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

        <van-field name="stepper" label="最大人数">
          <template #input>
            <van-stepper v-model="addTeamData.maxNum" max="10" min="3"/>
          </template>
        </van-field>
        <van-field name="radio" label="队伍状态">
          <template #input>
            <van-radio-group v-model="addTeamData.status" direction="horizontal">
              <van-radio name="0">公开</van-radio>
              <van-radio name="1">私有</van-radio>
              <van-radio name="2">加密</van-radio>
            </van-radio-group>
          </template>
        </van-field>
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
import {useRouter} from "vue-router";
import {ref} from "vue";
import myAxios from "../plugins/myAxios";
import {showFailToast, showSuccessToast} from "vant";

// 路由
const router = useRouter();

// 当前时间设定为最小日期
const minDate = new Date();

// 初始化表单数据
const initFormData = {
  "name": "",
  "description": "",
  "expireTime": null,
  "maxNum": 3,
  "password": "",
  "status": 0,
}

const result = ref('');
const showPicker = ref(false);
const pickerValue = ref([]);

// 选择日期确认后
const onConfirm = ({selectedValues}) => {
  // 格式化日期为 "YYYY-MM-DD" 格式 //解决问题
  const formattedDate = `${selectedValues[0]}-${selectedValues[1].padStart(2, '0')}-${selectedValues[2].padStart(2, '0')}`;
  result.value = formattedDate;  // 显示格式化的日期
  addTeamData.value.expireTime = formattedDate;  // 将格式化后的日期赋值给表单数据
  pickerValue.value = selectedValues;
  showPicker.value = false;
};

// 需要用户填写的表单数据
const addTeamData = ref({...initFormData});

// 提交表单
const onSubmit = async () => {


  // 提交的数据，包括状态转换为数字
  const postData = {
    ...addTeamData.value,
    status: Number(addTeamData.value.status),
  }

  //todo 前端参数校验

  // 发送 POST 请求到后台
  const res = await myAxios.post("/team/add", postData);
  // console.log(res);
  if (res?.code === 0 && res.data) {
    showSuccessToast('添加成功');
    // Toast.success('添加成功');
    router.push({
      path: '/team',
      replace: true,
    });
  } else {
    showFailToast('添加失败,请检查队伍是否超过五个');
    // Toast.error('添加失败');
  }
}
</script>

<style scoped>
#teamAddPage {
  /* 可以根据需要添加样式 */
}
</style>
