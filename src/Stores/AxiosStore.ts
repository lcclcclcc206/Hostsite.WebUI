import { defineStore } from 'pinia'
import axios from 'axios';
import { type AxiosInstance } from 'axios';
import { useUserInfoStore } from '@/Stores/UserInfoStore'
import { useRouter } from 'vue-router';

interface State {
    default: AxiosInstance,
    useToken: AxiosInstance
}

let axios_useToken = axios.create({
    withCredentials: true
});
axios_useToken.interceptors.request.use(function (config) {
    const userInfo = useUserInfoStore();
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

export const useAxiosStore = defineStore('axios', {
    state: (): State => {
        return {
            default: axios.create(),
            useToken: axios_useToken,
        };
    },
    getters: {

    },
    actions: {

    }
});