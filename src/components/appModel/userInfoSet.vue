<template>
  <NDrawer v-model:show="userSetShow" width="40%">
    <div class="userSet">
      <n-form :model="form1">
        <n-form-item label="主题色1" path="levelOne">
          <n-color-picker
            v-model:value="form1.levelOne"
            :show-alpha="false"
            :show-preview="true"
            :swatches="['#48bfe3']"
            style="margin-right: 8px"
          />
          <n-color-picker
            v-model:value="form1.levelTwo"
            :show-alpha="false"
            :show-preview="true"
            :swatches="['#a8cfdb']"
          />
        </n-form-item>
        <n-form-item>
          <div class="saveBtn">
            <CButton @click="saveColor('green')" type="CPrimary">保 存</CButton>
          </div>
        </n-form-item>
      </n-form>

      <n-form :model="form2">
        <n-form-item label="主题色2" path="levelOne">
          <n-color-picker
            v-model:value="form2.levelOne"
            :show-alpha="false"
            :show-preview="true"
            :swatches="['#EB5757']"
            style="margin-right: 8px"
          />
          <n-color-picker
            v-model:value="form2.levelTwo"
            :show-alpha="false"
            :show-preview="true"
            :swatches="['#ffdada']"
          />
        </n-form-item>
        <n-form-item>
          <div class="saveBtn">
            <CButton @click="saveColor('red')" type="CWarning">保 存</CButton>
          </div>
        </n-form-item>
      </n-form>

      <n-form :model="form3">
        <n-form-item label="主题色3" path="levelOne">
          <n-color-picker
            v-model:value="form3.levelOne"
            :show-alpha="false"
            :show-preview="true"
            :swatches="['#b5179e']"
            style="margin-right: 8px"
          />
          <n-color-picker
            v-model:value="form3.levelTwo"
            :show-alpha="false"
            :show-preview="true"
            :swatches="['#E8E8FF']"
          />
        </n-form-item>
        <n-form-item>
          <div class="saveBtn">
            <CButton @click="saveColor('purple')" type="CSuccess"
              >保 存</CButton
            >
          </div>
        </n-form-item>
      </n-form>
    </div>
  </NDrawer>
</template>
<script setup>
import { computed, ref, onMounted } from "vue";
import { setThemeColor, initThemeColor } from "../../utils/theme";

const form = {
  levelOne: "",
  levelTwo: "",
};

const form1 = ref({ ...form });
const form2 = ref({ ...form });
const form3 = ref({ ...form });

const saveColor = (name) => {
  setThemeColor(name, form.value.levelOne, form.value.levelTwo);
  initThemeColor();
};

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:visible"]);

const userSetShow = computed({
  get: () => props.visible,
  set: (val) => emit("update:visible", val),
});
</script>
<style scoped>
.userSet {
  width: 100%;
  height: auto;
  padding: 8px;
}
.saveBtn {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>