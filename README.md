#elpis

## 一个企业级应用框架，通过全栈实现。

### model 配置

```javascript
{
 mode:'dashboard',//模板类型，不同模板类型对应不一样的模板数据结构
 name:'dashboard',//模板名称
 desc:'',//模板描述
 icon:'',//模板图标
 homePage:'',//模板首页
 //头部菜单
 menu:[
   {
     key:'',//菜单唯一标识
     name:'',//菜单名称
     menuType:'',//枚举值：'menu'、'link'、'button'、'dropdown'、'group'、'divider'、'subMenu'、'tabMenu'、'tabGroup'
     // 当menuType==group时，可填
     subMenu:[{
      //可递归menuItem
     }],
      // 当menuType==module时，可填
      moduleType:'',//枚举值：sider/iframe/custom/schema
       // 当menuType==sider时，可填
      siderConfig:{
        menu:[
          {
            //可递归menuItem(除moduleType === sider)
          }
        ]
      },
      //当moduleType==iframe时
      iframeConfig:{
        path:'',//iframe路径
      },
      //当moduleType==custom时
      customConfig:{
        path:'',//自定义配置
      },
      //当moduleType==schema时
      schemaConfig:{
        //schema配置
        api:'',//数据源API(遵循RESTFUL规范)
        schema:{//板块数据结构
            type:'object',
            properties:{
              key:{
                ...schema,//标准schema配置
                type:'',//字段类型
                label:'',//字段中文名
                //字段在table中的相关配置
                tableOption:{
                  ...elTableColumnConfig,//标准elTableColumn配置
                  toFixed:0, //保留小数点后几位
                  visible:true,//默认为true(false时，表示不在表单中显示)
                },
                //字段在search-bar中的相关配置
                searchOption:{
                  ...elComponentConfig,//标准el-component-column配置
                 comType:'', //配置组件类型input/select
                 default:'', //默认值
                 //comType==='select'
                 enumList:[], //下拉框可选项
                 //comType==='dynamicSelect'
                 api:''
                },
                // 字段在不同动态component中的相关配置,前缀对应componentComfig中的键值
                // 如：componentComfig.createForm,这里对应createFormOption
                // 字段在createForm中的相关配置
                createFormOption:{
                  ...elComponentConfig,//标准el-component-column配置
                  comType:'', //配置组件类型input/select
                  visible: true, //是否展示(true/false),默认为false
                  disabled:false,//是否禁用(true/false),默认为false
                  default:'', //默认值
                  //comType==='select'
                  enumList:[], //下拉框可选项

                },
                // 字段在editForm中的相关配置
                editFormOption:{
                  ...elComponentConfig,//标准el-component-column配置
                  comType:'', //配置组件类型input/select
                  visible: true, //是否展示(true/false),默认为false
                  disabled:false,//是否禁用(true/false),默认为false
                  default:'', //默认值
                  //comType==='select'
                  enumList:[], //下拉框可选项
                },
                // 字段在detailPanel中的相关配置
                detailPanelOption:{
                  ...elComponentConfig,//标准el-component-column配置
                }
              }
            }
            required:[]//标记哪些字段是必填字段
        },
        //table相关配置
        tableConfig:{
          headerButtons:[{
            label:'',//按钮中文名
            eventKey:'',//按钮事件名
            //按钮事件的具体配置
            eventOption:{
              //当eventKey==='showComponent'时
              comName:'',//组件名称
            }
            ...elButtonConfig,//标准elButton配置
          }],
          rowButtons:[{
            label:'',//按钮中文名
            eventKey:'',//按钮事件名
            //按钮事件的具体配置
            eventOption:{
              //当eventKey==='showComponent'时
              comName:'',//组件名称
              params:{
                // paramKey=参数的键值
                // rowValueKey=参数值，格式为schema::tableKey,到table中找相应的字段
                paramKey:rowValueKey
              }
            }
            ...elButtonConfig,//标准elButton配置
          }],

        },
        // search-bar相关配置
        searchConfig:{},
        // 动态组件，相关配置
        componentConfig:{
          // create-form表单相关配置
          createForm:{
            title:'',//表单标题
            saveBtnText:'',//保存按钮文字
          },
          // edit-form表单相关配置
          editForm:{
            mainKey:'',//表单主键，用于唯一标识要修改的数据对象
            title:'',//表单标题
            saveBtnText:'',//保存按钮文字
          },
          //detail-panel相关配置
          detailPanel:{
            mainKey:'',//表单主键，用于唯一标识要修改的数据对象
            title:'',//表单标题
          }
        }
      }
   }
 ]

}
```

### 服务端启动

```javascript
const { serverStart } = require("@fsiaonma/elpis");
//启动elpis服务
const app = serverStart({});
```

### 自定义服务端

- router-schema
- router
- controller
- service
- extend
- config

### 前端构建

```javascript
const { frontendBuild } = require("@fsiaonma/elpis");
//编译构建前端工程
frontendBuild(process.env._ENV);
```

### 自定义页面扩展

- 在 `app/pages/`目录下写入口 entry.xxx.js

### dashboard / custom-view 自定义页面扩展

- 在 `app/pages/dashboard/xxx`下写页面

### dashboard/schema-view/components 动态组件扩展

1.在`app/pages/dashboard/complex-view/schema-view/components`下写组件

2.配置到`app/pages/dashboard/complex-view/schema-view/components/component-config.js`中

### schema-form 控件扩展

1.在`app/widgets/schema-form/complex-view`下写控件

2.配置到`app/widgets/schema-form/form-item-config.js`

### schema-search-bar 控件扩展

1.在`app/widgets/schema-search-bar/complex-view`下写控件

2.配置到`app/widgets/schema-search-bar/search-item-config.js`

### 日志配置

在 config 中配置 log4js 对象属性，参考[log4js](https://log4js-node.github.io/log4js-node/)

### 邮件配置

### 队列配置

### 缓存配置

### 定时任务配置

### 部署配置

### 单元测试配置

### 集成测试配置
