import { createRouter, createWebHashHistory, type RouterOptions } from 'vue-router'
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

export const router = createRouter(router_option);