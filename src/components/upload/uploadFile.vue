<template>
  <n-upload
    multiple
    directory-dnd
    :action="action"
    :max="5"
    @error="onError"
    @finish="onFinish"
    :headers="{
      Authorization: userStore.getToken(),
    }"
  >
    <n-upload-dragger>
      <div style="margin-bottom: 12px">
        <n-icon size="48" :depth="3">
          <ArchiveIcon />
        </n-icon>
      </div>
      <n-text style="font-size: 1rem"> 点击或者拖动文件到该区域来上传 </n-text>
      <n-p depth="3" style="margin: 8px 0 0 0; font-size: 0.8rem">
        请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码
      </n-p>
    </n-upload-dragger>
  </n-upload>
</template>
<script>
import { ArchiveOutline as ArchiveIcon } from "@vicons/ionicons5";
import { useAuthStore } from "@/stores/authStore";
export default {
  name: "UploadFile",
  components: { ArchiveIcon },
  props: {
    modelValue: {
      type: String,
      default: () => "",
    },
  },
  emits: ["update:modelValue"],

  setup(props, { emit }) {
    // 双向绑定的 page 和 pageSize
    const modelValue = props.modelValue;
    const action = import.meta.env.VITE_API_FILES_URL + "/file/upload";
    const userStore = useAuthStore();
    const onError = (error) => {
      console.log("上传失败", error);
    };

    const onFinish = (file) => {
      const { data } = JSON.parse(file.event.currentTarget.response);
      emit("update:modelValue", import.meta.env.VITE_API_FILES_URL + data.url);
    };

    return {
      modelValue,
      action,
      userStore,
      onError,
      onFinish,
    };
  },
};
</script>