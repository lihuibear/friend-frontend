import {createApp} from 'vue'
import App from './App.vue'
// 1. 引入你需要的组件
import {Button, Toast} from 'vant';
// 2. 引入组件样式
import 'vant/lib/index.css';
import * as VueRouter from 'vue-router';
import routes from './config/route'
import "vant/es/toast/style"


const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes,
})

const app = createApp(App);

app.use(Button);
app.use(Toast)
app.use(router);
app.mount('#app')

