import { createApp } from 'vue'
import naive from 'naive-ui'
import App from './App.vue'
import { createRouter, createWebHashHistory, type RouterOptions } from 'vue-router'
import FileBrowser from './Components/FileBrowser.vue'
import Home from './Components/Home.vue'


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
        }
    ]
};

const router = createRouter(router_option);

createApp(App).use(naive).use(router).mount('#app')
