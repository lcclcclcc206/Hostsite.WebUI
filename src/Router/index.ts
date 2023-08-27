import { createRouter, createWebHistory, type RouterOptions } from 'vue-router'
import FileBrowser from '@/Components/FileBrowser.vue'
import Home from '@/Components/Home.vue'
import Login from '@/Components/Login.vue'
import Test from '@/Components/Test.vue'
import { useUserInfoStore } from '@/Stores/UserInfoStore'

let router_option: RouterOptions = {
    history: createWebHistory(),
    routes: [
        {
            path: '/', redirect: 'filebrowser'
        },
        {
            name: 'home', path: '/home', component: Home
        },
        {
            name: 'filebrowser', path: '/filebrowser/:dir?', component: FileBrowser
        },
        {
            name: 'login', path: '/login', component: Login
        },
        {
            path: '/test/:number?', component: Test
        }
    ]
};

export const router = createRouter(router_option);

router.beforeEach((to, from) => {
    const userInfo = useUserInfoStore();
    if (to.name != 'login') {
        if (userInfo.token == null) {
            return { name: 'login' };
        }
        else {
            userInfo.verify_token();
        }
    }
    return true;
});