<template>
  <el-card class="table-panel">
    <el-row
      v-if="tableConfig?.headerButtons?.length > 0"
      justify="end"
      class="operation-panel"
    >
      <el-button
        v-for="item in tableConfig?.headerButtons"
        v-bind="item"
        @click="operationHandler({ btnConfig: item })"
        >{{ item.label }}</el-button
      >
    </el-row>
    <schema-table
      :schema="tableSchema"
      ref="schemaTableRef"
      :api="api"
      :apiParmas="apiParmas"
      :buttons="tableConfig?.rowButtons ?? []"
      @operate="operationHandler"
    ></schema-table>
  </el-card>
</template>
<script setup>
import { ref, inject, defineEmits, defineExpose } from "vue";
import { ElMessageBox, ElNotification } from "element-plus";
import $curl from "$elpisCommon/curl";
import schemaTable from "$elpisWidgets/schema-table/schema-table.vue";

// Emit事件定义
const emit = defineEmits(["operate"]);

// 注入外部数据
const { api, tableSchema, tableConfig, apiParmas } = inject("schemaViewData");

// 通过 ref 引用子组件
const schemaTableRef = ref(null);

// 映射事件到对应的处理函数
const EventHandleMap = {
  remove: removeData,
};

// 操作处理器，点击不同按钮时执行不同操作
const operationHandler = ({ btnConfig, rowData }) => {
  const { eventKey } = btnConfig;

  if (EventHandleMap[eventKey]) {
    EventHandleMap[eventKey]({ btnConfig, rowData });
  } else {
    emit("operate", { btnConfig, rowData });
  }
};

// 删除数据的处理函数
async function removeData({ btnConfig, rowData }) {
  const { eventOption } = btnConfig;

  if (!eventOption?.params) {
    return;
  }

  const { params } = eventOption;
  const removeKey = Object.keys(params)[0];

  let removeValue;
  const removeValueList = params[removeKey].split("::");
  if (removeValueList[0] == "schema" && removeValueList[1]) {
    removeValue = rowData[removeValueList[1]];
  }

  // 弹出确认框
  ElMessageBox.confirm(
    `确认删除${removeKey}为：${removeValue}数据?`,
    "Warning",
    { type: "warning", confirmButtonText: "确认", cancelButtonText: "取消" }
  ).then(async () => {
    // 显示加载状态
    schemaTableRef.value.showLoading();

    // 执行删除操作
    const res = await $curl({
      method: "DELETE",
      url: api.value,
      data: { [removeKey]: removeValue },
      errorMessages: "删除失败",
    });

    // 隐藏加载状态
    schemaTableRef.value.hideLoading();

    if (!res || !res.success || !res.data) {
      return;
    }

    // 显示成功通知
    ElNotification({
      title: "删除成功",
      type: "success",
      message: "删除成功",
      duration: 1500,
    });

    // 更新表格数据
    await initTableSData();
  });
}

// 初始化表格数据
const initTableSData = async () => {
  if (schemaTableRef.value) {
    await schemaTableRef.value.initData(); // 注意使用 .value 访问子组件方法
  }
};

// 加载表格数据
const loadTableData = async () => {
  if (schemaTableRef.value) {
    await schemaTableRef.value.loadTableData(); // 使用 .value 访问方法
  }
};

// 通过 expose 公开方法
defineExpose({ loadTableData });
</script>

<style lang="less" scoped>
.table-panel {
  flex: 1;
  margin: 10px;
  .operation-panel {
    margin-bottom: 10px;
  }
}
:deep(.el-card__body) {
  height: 98%;
  display: flex;
  flex-direction: column;
}
</style>
let a={n:1} let b=a a.x=b
