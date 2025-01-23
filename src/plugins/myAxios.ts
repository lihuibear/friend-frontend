import axios from "axios";
import { showFailToast } from "vant";
import { useRouter } from "vue-router";

const isDev = process.env.NODE_ENV === 'development';
const myAxios = axios.create({
    baseURL: isDev ? 'http://localhost:8081/api' : 'http://back.friend.huifly.cn/api',
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

const router = useRouter();

// Add a response interceptor
myAxios.interceptors.response.use(function (response) {
    console.log('我收到你的响应啦', response)
    // 未登录则跳转到登录页
    if (response?.data?.code === 40100) {
        showFailToast('未登录，请先登录');

        // 获取当前页面 URL，并进行编码
        const redirectUrl = encodeURIComponent(window.location.href);

        // 使用 window.location.replace() 进行重定向
        window.location.replace(`/user/login?redirect=${redirectUrl}`);
    }

    // Do something with response data
    return response.data;
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});

export default myAxios;
