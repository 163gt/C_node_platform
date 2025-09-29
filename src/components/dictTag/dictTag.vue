<template>
  <NTag v-if="dictKey === 'NTag'" :type="type" :round="round" :size="size">
    {{ label }}
    <template #icon v-if="Icon">
      <n-icon :component="Icon" />
    </template>
  </NTag>
</template>

<script setup>
import { defineProps, onMounted, ref } from "vue";
import { useDictStore } from "@/stores/dictStore"; // 引入字典 store

const dictStore = useDictStore();

// 定义组件的响应式数据
const dictItemList = ref([]); // 存储字典项列表
const label = ref(); // 存储根据 value 查找的对应 label

// 定义 props
const props = defineProps({
  dictionaryCode: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  dictKey: {
    type: String,
    default: "NTag",
  },
  type: {
    type: String,
    default: null,
  },
  round: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: "medium",
  },
  Icon: {
    type: Object,
    default: null,
  },
});

onMounted(async () => {
  // 获取字典数据并查找对应的 label
  dictItemList.value = await dictStore.getDictionary(props.dictionaryCode);

  // 查找匹配的 label
  const dictItem = dictItemList.value.find(
    (item) => item.value === props.value
  );
  if (dictItem) {
    label.value = dictItem.label; // 如果找到，赋值给 label
  } else {
    label.value = ""; // 如果没有找到匹配项，默认显示 '未知标签'
  }
});
</script>
