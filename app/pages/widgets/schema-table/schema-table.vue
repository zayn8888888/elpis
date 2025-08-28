<template>
  <div class="schema-table">
    <el-table
      class="table"
      v-if="schema && schema.properties"
      v-loading="loading"
      :data="tableData"
    >
      <template v-for="(schemaItem, key) in schema.properties">
        <el-table-column
          v-if="schemaItem.option.visible !== false"
          :key="key"
          :prop="key"
          :label="schemaItem.label"
          v-bind="schemaItem.option"
        ></el-table-column>
      </template>

      <el-table-column
        v-if="buttons?.length > 0"
        label="操作"
        fixed="right"
        :width="operationWidth"
      >
        <template #default="scope">
          <el-button
            v-for="item in buttons"
            link
            v-bind="item"
            @click="operationHandler({ btnConfig: item, rowData: scope.row })"
            >{{ item.label }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-row justify="end" class="pagination">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50, 100, 200]"
        :total="total"
        layout="total,sizes, prev, pager, next, jumper"
        @size-change="onPageSizeChange"
        @current-change="onCurrentPageChange"
      ></el-pagination>
    </el-row>
  </div>
</template>

<script setup>
import { ref, toRefs, computed, watch, nextTick, onMounted } from "vue";
import $curl from "$elpisCommon/curl";
const props = defineProps({
  /**
   * schema 配置，结构如下：
   * {
          //板块数据结构
          type: "object",
          properties: {
            key: {
              ...schema, //schema配置
              type: "", //字段类型
              label: "", //字段的中文名
              option: {
                ...elTableColumnConfig, //标准 elTableColumn 配置
                visible: true, //默认为true(false或不配置时，标识不在表单中显示)
              },
            },
          },
        }
   */
  schema: Object,
  /**
   * 表格数据源 api
   */
  api: String,
  /**
   * api 请求参数，请求APi时携带
   */
  apiParmas: Object,
  /**
   * buttons 按钮配置，结构如下：
   *  {
              label: "", //按钮中文名
              eventKey: "", //按钮事件名
              eventOption: {}, //按钮事件具体配置
              ...elButtonConfig, //标准 elButton 配置
            },
   */
  buttons: Array,
});
const emit = defineEmits(["operate"]);
const { schema, api, apiParmas, buttons } = toRefs(props);
const operationWidth = computed(() => {
  return buttons.value?.length > 0
    ? buttons.value.reduce((pre, cur) => {
        return pre + cur.label.length * 18;
      }, 50)
    : 50;
});
const loading = ref(false);
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(50);
const total = ref(0);
onMounted(() => {
  initData();
});
watch(
  [schema, api, apiParmas],
  () => {
    initData();
  },
  { deep: true }
);
const initData = () => {
  currentPage.value = 1;
  pageSize.value = 50;
  nextTick(async () => {
    await loadTableData();
  });
};
let timerId = null;
const loadTableData = async () => {
  clearTimeout(timerId);
  timerId = setTimeout(async () => {
    await fetchTableData();
    timerId = null;
  }, 100);
};
const fetchTableData = async () => {
  if (!api.value) {
    return;
  }
  showLoading();
  //请求table数据
  const res = await $curl({
    method: "GET",
    url: `${api.value}/list`,
    query: {
      ...apiParmas.value,
      page: currentPage.value,
      pageSize: pageSize.value,
    },
  });
  hideLoading();
  if (!res || !res.success || !Array.isArray(res.data)) {
    tableData.value = [];
    total.value = 0;
    return;
  }
  tableData.value = buildTableData(res.data);
  total.value = res.metadata.total;
};
const buildTableData = (listData) => {
  if (!schema.value?.properties) {
    return listData;
  }
  return listData.map((rowData) => {
    for (var dKey in rowData) {
      const schemaItem = schema.value?.properties?.[dKey];
      if (schemaItem?.option?.toFixed) {
        rowData[dKey] =
          rowData[dKey].toFixed &&
          rowData[dKey].toFixed(schemaItem.option.toFixed);
      }
    }
    return rowData;
  });
};
const showLoading = () => {
  loading.value = true;
};
const hideLoading = () => {
  loading.value = false;
};
const operationHandler = ({ btnConfig, rowData }) => {
  emit("operate", { btnConfig, rowData });
};
const onPageSizeChange = async (value) => {
  pageSize.value = value;
  await loadTableData();
};
const onCurrentPageChange = async (value) => {
  currentPage.value = value;
  await loadTableData();
};
defineExpose({
  initData,
  loadTableData,
  showLoading,
  hideLoading,
});
</script>
<style lang="less" scoped>
.schema-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  .table {
    flex: 1;
  }
  .pagination {
    margin: 10px 0;
    text-align: right;
  }
}
</style>
