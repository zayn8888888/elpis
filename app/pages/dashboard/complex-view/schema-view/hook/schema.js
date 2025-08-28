import { ref, watch, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useMenuStore } from "$elpisStore/menu";
export const useSchema = function () {
  const route = useRoute();
  const menuStore = useMenuStore();
  const api = ref("");
  const tableSchema = ref({});
  const tableConfig = ref();
  const searchSchema = ref({});
  const searchConfig = ref();
  const components = ref({});

  const buildData = function () {
    const { key, sider_key: siderKey } = route.query;
    const mItem = menuStore.findMenuItem({
      key: "key",
      value: siderKey ?? key,
    });
    if (mItem && mItem.schemaConfig) {
      const { schemaConfig: sConfig } = mItem;
      const configSchema = JSON.parse(JSON.stringify(sConfig.schema));
      api.value = sConfig.api ?? "";
      tableSchema.value = {};
      tableConfig.value = undefined;
      searchSchema.value = {};
      searchConfig.value = undefined;
      components.value = {};
      nextTick(() => {
        //构造tableSchema和ableConfig
        tableSchema.value = buildDtoSchema(configSchema, "table");

        tableConfig.value = mItem.tableConfig;
        //构造searchSchema和searchConfig
        const dtoSearchSchema = buildDtoSchema(configSchema, "search");
        for (const key in dtoSearchSchema.properties) {
          if (route.query[key] !== undefined) {
            dtoSearchSchema.properties[key].option.default = route.query[key];
          }
        }
        searchSchema.value = dtoSearchSchema;
        searchConfig.value = sConfig.searchConfig;

        //构造components={key:{schema,config}}
        const { componentConfig } = mItem;
        if (componentConfig && Object.keys(componentConfig).length > 0) {
          const dtoComponents = {};
          for (const comName in componentConfig) {
            dtoComponents[comName] = {
              schema: buildDtoSchema(configSchema, comName),
              config: componentConfig[comName],
            };
          }
          components.value = dtoComponents;
        }
      });
    }
  };
  //通用构建schema方法（清除噪音）
  const buildDtoSchema = (_schema, comName) => {
    if (!_schema?.properties) {
      return {};
    }
    const dtoSchema = {
      type: "object",
      properties: {},
    };
    //提取有效schema字段信息
    for (const key in _schema.properties) {
      const props = _schema.properties[key];
      if (props[`${comName}Option`]) {
        let dtoProps = {};
        // 提取props中非option的部分，存放到dtoProps中
        for (const pKey in props) {
          if (pKey.indexOf("Option") < 0) {
            dtoProps[pKey] = props[pKey];
          }
        }
        // 处理comNameOption
        dtoProps = Object.assign({}, dtoProps, {
          option: props[`${comName}Option`],
        });

        //处理required字段
        const { required } = _schema;
        if (required && required.find((pk) => pk === key)) {
          dtoProps.option.required = true;
        }
        dtoSchema.properties[key] = dtoProps;
      }
    }
    return dtoSchema;
  };
  watch(
    [
      () => route.query.key,
      () => route.query.sider_key,
      () => menuStore.menuList,
    ],
    () => {
      buildData();
    },
    { deep: true }
  );
  onMounted(() => {
    buildData();
  });
  return {
    api,
    tableSchema,
    tableConfig,
    searchSchema,
    searchConfig,
    components,
  };
};
