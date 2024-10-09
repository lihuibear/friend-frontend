import {createApp} from 'vue'
import App from './App.vue'
// 1. 引入你需要的组件
import {Button} from 'vant';
// 2. 引入组件样式
import 'vant/lib/index.css';
import * as VueRouter from 'vue-router';
import routes from './config/route'


const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes,
})

const app = createApp(App);

app.use(Button);

app.use(router);
app.mount('#app')

