import {createApp} from 'vue'
import App from './App.vue'
// 1. 引入你需要的组件
import { Button } from 'vant';
// 2. 引入组件样式
import 'vant/lib/index.css';

const app = createApp(App);
app.use(Button);
app.mount('#app')

