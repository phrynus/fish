import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

//创建axios实例
const axiosAdmin: AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:3015/64313a",
  //超时时间
  timeout: 5000
});

//添加请求拦截器
axiosAdmin.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const admin: any = JSON.parse(localStorage.getItem("admin") || "");
    if (admin.access_token) {
      config.headers.Authorization = admin.access_token;
    }
    return config;
  },
  (error: AxiosError) => error
);
//添加响应拦截器
axiosAdmin.interceptors.response.use(
  (response) => {
    //对响应数据做点什么
    return response;
  },
  (error: AxiosError) => error
);

export default axiosAdmin;
