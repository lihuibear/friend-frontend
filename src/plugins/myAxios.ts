import axios from "axios";
import {showFailToast} from "vant";

// const isDev = process.env.NODE_ENV === 'development';

const myAxios = axios.create({
    baseURL: 'http://localhost:8080/api'
});

myAxios.defaults.withCredentials = true; //配置为true 携带cookie

// Add a request interceptor
myAxios.interceptors.request.use(function (config) {
    console.log('我要发请求啦', config)
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
myAxios.interceptors.response.use(function (response) {
    console.log('我收到你的响应啦', response)
    // 未登录则跳转到登录页
    if (response?.data?.code === 40100) {
        showFailToast('未登录，请先登录');
        const redirectUrl = window.location.href;

        window.location.href = `/user/login?redirect=${redirectUrl}`;
    }
    // Do something with response data
    return response.data;
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});

export default myAxios;
