<template>
  <el-row type="flex" align="middle" class="form-item">
    <el-row class="item-label" justify="end">
      <el-row v-if="schema.option?.required" type="flex" class="required"
        >*</el-row
      >{{ schema.label }}
    </el-row>
    <el-row class="item-value">
      <el-input
        v-model="dtoValue"
        v-bind="schema.option"
        :placeholder="placeholder"
        class="component"
        :class="validTips ? 'valid-border' : ''"
        @focus="onFocus"
        @blur="onBlur"
      ></el-input>
    </el-row>
    <!-- 错误信息 -->
    <el-row v-if="validTips" class="valid-tips">{{ validTips }}</el-row>
  </el-row>
</template>

<script setup>
import { ref, toRefs, watch, inject, onMounted } from "vue";
const ajv = inject("ajv");
const props = defineProps({
  schemaKey: String,
  schema: Object,
  model: String,
});

const { schemaKey, schema } = props;

const { model } = toRefs(props);
const dtoValue = ref();
const validTips = ref(null);
const placeholder = ref("");
const initData = () => {
  dtoValue.value = model.value ?? schema.option?.default;
  validTips.value = null;
  const { minLength, maxLength, pattern } = schema;
  const ruleList = [];
  if (schema.option?.placeholder) {
    ruleList.push(schema.option?.placeholder);
  }
  if (minLength) {
    ruleList.push(`最小长度${minLength}`);
  } else if (maxLength) {
    ruleList.push(`最大长度${maxLength}`);
  } else if (pattern) {
    ruleList.push(`格式${pattern}`);
  }
  placeholder.value = ruleList.join("|");
};

onMounted(() => {
  initData();
});
watch(
  [model, schema],
  () => {
    initData();
  },
  { deep: true }
);
//表单校验
const validate = () => {
  validTips.value = null;
  const { type } = schema;
  //校验是否必须
  if (schema.option?.required && !dtoValue.value) {
    validTips.value = `${schema.label}不能为空`;
    return false;
  }
  //ajv校验schema
  if (dtoValue.value) {
    const validate = ajv.compile(schema);
    const valid = validate(dtoValue.value);
    if (!valid && validate.errors && validate.errors[0]) {
      const { keyword, params } = validate.errors[0];
      if (keyword === "type") {
        validTips.value = `类型必须为${type}`;
      } else if (keyword === "maxLength") {
        validTips.value = `最大长 度应为${params.limit}`;
      } else if (keyword === "minLength") {
        validTips.value = `最小长度应为${params.limit}`;
      } else if (keyword === "pattern") {
        validTips.value = `格式不正确`;
      } else {
        validTips.value = `不符合要求`;
      }
      return false;
    }
  }
  return true;
};
//获取表单值
const getValue = () => {
  return dtoValue.value !== undefined ? { [schemaKey]: dtoValue.value } : {};
};
const onFocus = () => {
  validTips.value = null;
};
const onBlur = () => {
  validate();
};
defineExpose({
  validate,
  getValue,
});
</script>
<style lang="less" scoped></style>
