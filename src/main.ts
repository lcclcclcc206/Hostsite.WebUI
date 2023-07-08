import { createApp } from 'vue'
import naive from 'naive-ui'
import App from '@/App.vue'
import { createRouter, createWebHashHistory, type RouterOptions } from 'vue-router'
import axios from 'axios'
import { createPinia } from 'pinia'
import { BASE_URL } from '@/Utils/constant'
import FileBrowser from '@/Components/FileBrowser.vue'
import Home from '@/Components/Home.vue'
import LoginPanel from '@/Components/LoginPanel.vue'
import Test from '@/Components/Test.vue'
import { UserInfoStore } from './Stores/UserInfoStore'

let router_option: RouterOptions = {
    history: createWebHashHistory(),
    routes: [
        {
            path: '/', redirect: 'filebrowser'
        },
        {
            path: '/home', component: Home
        },
        {
            path: '/filebrowser', component: FileBrowser
        },
        {
            path: '/login', component: LoginPanel
        },
        {
            path: '/test', component: Test
        }
    ]
};

const router = createRouter(router_option);

const pinia = createPinia();

createApp(App).use(pinia).use(naive).use(router).mount('#app');

const userInfo = UserInfoStore();

axios.interceptors.request.use(function (config) {
    if (config.method != 'post')
        return config;
    if (config.url == `${BASE_URL}/token/refresh`)
        return config;

    if (userInfo.token != null) {
        if (userInfo.is_token_needto_refresh()) {
            userInfo.update_token(() => {
                config.headers['Authorization'] = `${userInfo.token!.token_type} ${userInfo.token!.access_token}`;
                console.log('令牌刷新成功');
            }, () => {
                delete config.headers['Authorization'];
                console.log('令牌已失效，请重新登录');
            });
        }
        else {
            config.headers['Authorization'] = `${userInfo.token.token_type} ${userInfo.token.access_token}`;
        }
    }
    return config;
});