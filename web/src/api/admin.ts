import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

const getTokenPayload = (token: any, join: string) => {
  if (token.value) {
    const payload = token.value.split(".")[1];
    return JSON.parse(atob(payload))[join] || null;
  }
  return null;
};

//创建axios实例
const axiosAdmin: AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:3015/7b4371",
  //超时时间
  timeout: 5000
});

//添加请求拦截器
axiosAdmin.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.params = { ...config.data, ...config.params };
    config.data = undefined;
    const local = localStorage.getItem("admin");
    if (local != "undefined" && local != null) {
      const admin: any = JSON.parse(local);
      if (admin?.access_token && admin?.refresh_token) {
        config.headers.Authorization = admin.access_token;
      }
    }
    return config;
  },
  (error: AxiosError) => error
);

export default axiosAdmin;
