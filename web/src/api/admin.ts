import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

//创建axios实例
const axiosAdmin: AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:3015/7b4371",
  //超时时间
  timeout: 5000
});

//添加请求拦截器
axiosAdmin.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const local = localStorage.getItem("admin");
    if (local != "undefined" && local != null) {
      const admin: any = JSON.parse(local);
      if (admin?.access_token) {
        config.headers.Authorization = admin.access_token;
      }
    }

    return config;
  },
  (error: AxiosError) => error
);

export default axiosAdmin;
