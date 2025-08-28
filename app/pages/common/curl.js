const md5 = require("md5");
import { ElMessage } from "element-plus";
import axios from "axios";
const signKey =
  process.env.NODE_ENV === "production"
    ? require("$businessPwd/config/config.prod").signKey
    : require("$businessPwd/config/config.local").signKey;
/**
 *前端封装的curl方法
 * @param {Object} options - 请求参数
 */
const curl = ({
  url, //请求地址
  method = "post", //请求方式
  headers = {}, //请求头
  query = {}, //请求参数
  data = {}, //post body
  responseType = "json", //response data type
  timeout = 60000, //timeout
  errorMessage = "网络异常",
}) => {
  //接口签名处理（让接口变动态）
  const st = Date.now();
  const dtoHeaders = {
    ...headers,
    s_t: st,
    s_sign: md5(`${signKey}_${st}`),
  };
  if (url.indexOf("/api/proj/") > -1 && window.projKey) {
    dtoHeaders.proj_key = window.projKey;
  }
  //构造请求参数（把参数转换为axios参数）
  const ajaxStting = {
    url,
    method,
    params: query,
    data,
    responseType,
    timeout,
    headers: dtoHeaders,
  };
  return axios
    .request(ajaxStting)
    .then((response) => {
      const resData = response.data || {};
      //后端API返回格式
      const { success } = resData;
      //失败
      if (!success) {
        const { code, message } = resData;
        if (code === 442) {
          ElMessage.error("请求参数异常");
        } else if (code === 445) {
          ElMessage.error("请求签名不合法");
        } else if (code === 446) {
          ElMessage.error("缺少项目必要参数");
        } else if (code === 50000) {
          ElMessage.error(message);
        } else {
          ElMessage.error(errorMessage);
        }
        console.error(message);
        return Promise.resolve({ success, code, message });
      }
      //成功
      const { data, metadata } = resData;
      return Promise.resolve({ success, data, metadata });
    })
    .catch((error) => {
      const { message } = error;
      if (message.match(/timeout/)) {
        return Promise.resolve({
          code: 504,
          message: "Request Timeout",
        });
      }
      return Promise.resolve(error);
    });
};
export default curl;
