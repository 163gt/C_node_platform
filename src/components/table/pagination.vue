<template>
  <n-pagination
    v-model:page="page"
    v-model:page-size="pageSize"
    :item-count="total"
    show-size-picker
    :page-sizes="pageSizesinfo"
    @update:page="updatePage"
    @update:page-size="updatePageSize"
  />
</template>

<script>
export default {
  name: "Pagination",
  props: {
    // 父组件传递的分页参数
    modelValue: {
      type: Object,
      default: () => ({
        page: 1,
        pageSize: 10,
      }),
    },
    total: {
      type: Number,
      default: 0,
    },
    pageSizesinfo: {
      type: Array,
      default: () => [
        { label: "10/页", value: 10 },
        { label: "20/页", value: 20 },
        { label: "30/页", value: 30 },
        { label: "40/页", value: 40 },
      ],
    },
    defaultPage: {
      type: Number,
      default: 1,
    },
    defaultPageSize: {
      type: Number,
      default: 10,
    },
  },
  emits: ["update:modelValue"],

  setup(props, { emit }) {
    // 双向绑定的 page 和 pageSize
    const page = props.modelValue.page;
    const pageSize = props.modelValue.pageSize;

    // 页码变化时的处理
    const updatePage = (newPage) => {
      emit("update:modelValue", { ...props.modelValue, page: newPage });
    };

    // 每页显示条数变化时的处理
    const updatePageSize = (newPageSize) => {
      emit("update:modelValue", { ...props.modelValue, pageSize: newPageSize });
    };

    return {
      page,
      pageSize,
      updatePage,
      updatePageSize,
    };
  },
};
</script>
