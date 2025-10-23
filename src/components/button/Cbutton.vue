
<template>
  <button
    :class="['C-Button', type ? type : '', disabled ? 'C-Button-disabled' : '']"
    :style="{ width: props.width, height: props.height }"
    :disabled="disabled"
    @click="handleClick"
  >
    <component v-if="props.icon" :is="props.icon" class="C-svgIcon"></component>
    <slot></slot>
  </button>
</template>
<script setup>
import { defineProps, onMounted, defineEmits } from "vue";
defineOptions({
  name: "CButton",
});

const emit = defineEmits(["click"]);

const props = defineProps({
  icon: {
    type: Object,
    required: false,
  },
  type: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    default: "auto",
  },
  height: {
    type: String,
    default: "32px",
  },
});

const handleClick = (event) => {
  // 触发父组件的 `click` 事件
  emit("click", event);
};
</script>

<style scoped>
.C-Button {
  display: flex;
  align-items: center;
  justify-content: center;
  /* justify-content: flex-start; */
  gap: 10px;
  border-radius: 30px;
  font-weight: 600;
  border: none;
  position: relative;
  cursor: pointer;
  transition-duration: 0.2s;
  box-shadow: 5px 15px 10px rgba(0, 0, 0, 0.116);
  /* padding-left: 8px; */
  padding: 0 8px;
  transition-duration: 0.5s;
  margin: 0 5px;
}

.C-svgIcon {
  height: 25px;
  transition-duration: 1.5s;
}

.bell path {
  fill: rgb(19, 19, 19);
}

/* .C-Button:hover {
  background-color: rgb(192, 255, 20);
  transition-duration: 0.5s;
} */

.C-Button:active {
  transform: scale(0.97);
  transition-duration: 0.2s;
}

.C-Button:hover .C-svgIcon {
  transform: rotate(360deg);
  transition-duration: 1.5s;
}

/* 多状态 */
.CPrimary {
  background-color: var(--green--levelOne);
  color: #fff;
}
.CSuccess {
  background-color: var(--purple--levelOne);
  color: #fff;
}
.CWarning {
  background-color: var(--red--levelOne);
  color: #fff;
}

/* 禁用 */
.C-Button-disabled {
  background-color: #d1d1d1 !important;
  color: #989898 !important;
  box-shadow: none;
  cursor: not-allowed;
}
.C-Button-disabled:active {
  transform: scale(1);
  transition-duration: 0s;
}
.C-Button-disabled:hover .C-svgIcon {
  transform: rotate(0deg);
  transition-duration: 0s;
}
</style>
