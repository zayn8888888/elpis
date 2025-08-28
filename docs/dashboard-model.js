{
  //模板类型，不同模板类型对应不一样的模板数据结构
  mode: "dashboard";
  name: ""; //模板名称
  desc: ""; //模板描述
  icon: ""; //模板图标
  homePage: ""; //模板首页(项目配置)
  menu: [
    {
      key: "", //菜单项的唯一标识
      name: "", //菜单项的名称
      menuType: "", //枚举值：group/module
      //当menuType为group时可填
      subMenu: [
        {
          //递归menuItem
        },
      ],
      //当menuType为module时可填
      moduleType: "", //枚举值：iframe/custom/schema/sider
      //当moduleType为sider时
      siderCongif: {
        menu: [
          {
            //可递归menuItem(除moduleType===sider)
          },
        ],
      }, //侧边栏配置
      //当moduleType为iframe时
      iframeConfig: {
        path: "", //iframe路径
      }, //iframe配置
      //当moduleType为custom时
      customConfig: {
        path: "", //自定义路由路径
      }, //自定义配置
      //当moduleType为schema时
      schemaConfig: {
        api: "", // 数据源API(遵循RESTFUL规范)
        schema: {
          //板块数据结构
          type: "object",
          properties: {
            key: {
              ...schema, //schema配置
              type: "", //字段类型
              label: "", //字段的中文名
              tableOption: {
                ...elTableColumnConfig, //标准 elTableColumn 配置
                toFixed: 2, //数字类型时，保留小数位数
                visible: true, //默认为true(false时，表示不在表单中显示)
              },
              searchOption: {
                ...eleComponentConfig, //标准 elComponent 配置
                comType: "", //配置组件类型 input/select/checkbox/radio/datePicker
                default: "", //默认值
                //comType ==='select'时
                enumList: [], //下拉框可选项
                api: "", //comType ===dynamicSelect时，下拉框数据源API
              },
              //字段在不同动态component中的相关配置，前缀对应componentConfig中的键值
              //如：componentConfig.createForm，这里对应createFormOption
              //字段在createForm中的相关配置
              createFormOption: {
                ...eleComponentConfig, //标准 elComponent 配置
                comType: "", //配置组件类型 input/select/checkbox/radio/datePicker
                visible: true, //是否展示（true/false),默认为true
                disabled: false, //是否禁用（true/false）,默认为false
                default: "", //默认值
                //comType ==='select'时
                enumList: [], //下拉框可选项
              },
              //字段在updateForm中的相关配置
              editFormOption: {
                ...eleComponentConfig, //标准 elComponent 配置
                comType: "", //配置组件类型 input/select/checkbox/radio/datePicker
                visible: true, //是否展示（true/false),默认为true
                disabled: false, //是否禁用（true/false）,默认为false
                default: "", //默认值
                //comType ==='select'时
                enumList: [], //下拉框可选项
              },
              detailPanelOption: {
                ...eleComponentConfig, //标准 elComponent 配置
              },
            },
          },
          required: [], //标记哪些字段是必填项
        },
        tableConfig: {
          headerButtons: [
            {
              label: "", //按钮中文名
              eventKey: "", //按钮事件名
              eventOption: {
                //当eventKey==='showComponent'
                comName: "", //组件名称
              }, //按钮事件具体配置
              ...elButtonConfig, //标准 elButton 配置
            },
          ],
          rowButtons: [
            {
              label: "", //按钮中文名
              eventKey: "", //按钮事件名
              eventOption: {
                //当eventKey==='showComponent'
                comName: "", //组件名称
                //当eventKey==='remove'
                params: {
                  //paramKey=参数的键值
                  //rowValueKey=参数值，格式为schema:tableKey到table中找相应的字段
                  paramKey: rowValueKey,
                },
              }, //按钮事件具体配置
              ...elButtonConfig, //标准 elButton 配置
            },
          ],
        }, //table相关配置
        searchConfig: {}, //search相关配置
        componentConfig: {
          //create-form 表单相关配置
          createForm: {
            title: "", //表单标题
            saveBtnText: "", //保存按钮文案
          },
          //edit-form 表单相关配置
          editForm: {
            mainKey: "", //主键字段,用于唯一标识要修改的数据对象
            title: "", //表单标题
            saveBtnText: "", //保存按钮文案
          },
          //detail-panner 表单相关配置
          detailPanel: {
            mainKey: "", //主键字段,用于唯一标识要修改的数据对象
            title: "", //表单标题
          },
        }, //模块组件
      }, //schema配置
    },
  ];
}
