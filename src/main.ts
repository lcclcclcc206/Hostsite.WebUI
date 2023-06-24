import { createApp } from 'vue'
import naive from 'naive-ui'
import App from './App.vue'
import { createRouter, createWebHashHistory, type RouterOptions } from 'vue-router'
import FileBrowser from './Components/FileBrowser.vue'
import Home from './Components/Home.vue'
import LoginPanel from './Components/LoginPanel.vue'
import axios from 'axios'
import { type IToken } from './Utils/interfaces'
import { is_token_needto_refresh, update_token } from './Utils/authentication'
import { BASE_URL } from './Utils/constant'

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
        }
    ]
};

const router = createRouter(router_option);

axios.interceptors.request.use(function (config) {
    if (config.method != 'post')
        return config;
    if (config.url == `${BASE_URL}/token/refresh`)
        return config;
    
    let temp_token = localStorage.getItem('token');
    if (temp_token != null) {
        let token_value = JSON.parse(temp_token) as IToken;
        if (is_token_needto_refresh(token_value)) {
            update_token(token_value, () => {
                config.headers['Authorization'] = `${token_value.token_type} ${token_value.access_token}`;
                console.log('令牌刷新成功');
            }, () => {
                delete config.headers['Authorization'];
                console.log('令牌已失效，请重新登录');
            });
        }
        else {
            config.headers['Authorization'] = `${token_value.token_type} ${token_value.access_token}`;
        }
    }
    return config;
});

createApp(App).use(naive).use(router).mount('#app')
