import { createApp } from 'vue'
import naive from 'naive-ui'
import App from '@/App.vue'
import { createRouter, createWebHashHistory, type RouterOptions } from 'vue-router'
import { createPinia } from 'pinia'
import FileBrowser from '@/Components/FileBrowser.vue'
import Home from '@/Components/Home.vue'
import LoginPanel from '@/Components/LoginPanel.vue'
import Test from '@/Components/Test.vue'

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