import { error, t } from "elysia";

const StatusMap: Record<number, string> = {
  100: "继续",
  101: "协议切换",
  102: "处理中",
  103: "提前提示",
  200: "成功",
  201: "已创建",
  202: "已接受",
  203: "非授权信息",
  204: "无内容",
  205: "重置内容",
  206: "部分内容",
  207: "多重状态",
  208: "已报告",
  300: "多种选择",
  301: "永久重定向",
  302: "临时重定向",
  303: "查看其他",
  304: "未修改",
  307: "临时重定向",
  308: "永久重定向",
  400: "错误请求",
  401: "未授权",
  402: "需要付费",
  403: "禁止",
  404: "资源不存在",
  405: "方法不允许",
  406: "不可接受",
  407: "需要代理身份验证",
  408: "请求超时",
  409: "冲突",
  410: "已删除",
  411: "需要长度",
  412: "前提条件失败",
  413: "请求实体过大",
  414: "请求 URI 太长",
  415: "不支持的媒体类型",
  416: "请求范围不满足",
  417: "期望失败",
  418: "不支持此请求",
  421: "请求被拒绝",
  422: "不可处理",
  423: "锁定",
  424: "依赖失败",
  425: "太早",
  426: "需要升级",
  428: "需要先决条件",
  429: "请求过多",
  431: "请求头字段过大",
  451: "因法律原因不可用",
  500: "服务器内部错误",
  501: "未实现",
  502: "错误网关",
  503: "服务不可用",
  504: "网关超时",
  505: "HTTP 版本不受支持",
  506: "变体也在协商",
  507: "存储空间不足",
  508: "循环检测到",
  510: "未扩展",
  511: "需要网络身份验证"
};
export default {
  error: t.Object({
    code: t.Number(),
    msg: t.String()
  }),
  run: async (data: any) => {
    const c: any = {
      code: 500,
      msg: "success"
    };
    switch (typeof data) {
      case "object":
        c.code = data.code || 200;
        let msg = StatusMap[c.code]; // 获取状态码对应的描述
        c.msg = data.msg || msg || "success";
        c.data = c.code === 200 ? data.data || data : {};
        if (Object.keys(c.data).length === 0) delete c.data;
        break;
      case "string":
        c.code = 500;
        c.msg = data;
        break;
      case "number":
        c.code = data;
        c.msg = StatusMap[c.code] || "success";
        break;
      default:
        c.code = 500;
        c.msg = "null";
    }
    return error(c.code, c);
  }
};
