<template>
  <el-form
    v-if="schema && schema.properties"
    :inline="true"
    class="schema-search-bar"
  >
    <el-form-item
      v-for="(item, key) in schema.properties"
      :key="key"
      :label="item.label"
    >
      <component
        ref="searchComList"
        :is="SearchItemConfig[item.option?.comType]?.component"
        :schemaKey="key"
        :schema="item"
        @loaded="handleChildLoaded"
      ></component>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" plain class="search-btn" @click="search"
        >搜索</el-button
      >
      <el-button plain class="reset-btn" @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, toRefs } from "vue";
import SearchItemConfig from "./search-item-config";
const props = defineProps({
  schema: Object,
});
const { schema } = toRefs(props);
const emit = defineEmits(["load", "search", "reset"]);
const searchComList = ref([]);

const getValue = () => {
  let dtoObj = {};
  searchComList.value.forEach((item) => {
    dtoObj = {
      ...dtoObj,
      ...item?.getValue(),
    };
  });
  return dtoObj;
};
let childComLoadedCount = 0;
const handleChildLoaded = (schemaItem) => {
  childComLoadedCount++;
  if (childComLoadedCount >= Object.keys(schema?.value?.properties).length) {
    emit("load", getValue());
  }
};
const search = () => {
  emit("search", getValue());
};
const reset = () => {
  searchComList.value.forEach((item) => {
    item?.reset();
  });
  emit("reset");
};
defineExpose({ reset, getValue });
</script>
<style lang="less">
.schema-search-bar {
  min-width: 500px;
  .input,
  .select,
  .dynamic-select {
    width: 180px;
  }
  .search-btn,
  .reset-btn {
    width: 100px;
  }
}
</style>
