import createForm from "./create-form/create-form.vue";
import editForm from "./edit-form/edit-form.vue";
import detailPanel from "./detail-panel/detail-panel.vue";
//业务扩展component配置
import BusinessComponentConfig from "$businessComponentConfig";
const ComponentConfig = {
  createForm: {
    component: createForm,
  },
  editForm: {
    component: editForm,
  },
  detailPanel: {
    component: detailPanel,
  },
};
export default { ...ComponentConfig, ...BusinessComponentConfig };
