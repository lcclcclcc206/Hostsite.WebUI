<script setup lang="ts">
import { NButton, NForm, NFormItem, NInput, useMessage } from 'naive-ui'
import { ref, type Ref } from 'vue';
import { type IToken } from '@/Utils/Interfaces/Token';
import { useUserInfoStore } from '@/Stores/UserInfoStore';
import { useAxiosStore } from '@/Stores/AxiosStore';
import { BASE_URL } from '@/Utils/constant';

interface LoginForm {
    username: string;
    password: string;
}

const userInfo = useUserInfoStore();
const axios = useAxiosStore();
const emit = defineEmits<{
    (e: 'login_sucess'): void
}>()

const message = useMessage();
// let token = inject('token') as Ref<IToken | null>;

let loginForm: Ref<LoginForm> = ref({
    username: '',
    password: ''
});
let login_button_disabled = ref(false);

function login() {
    axios.default.post(`${BASE_URL}/token`, loginForm.value, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then((res) => {
        // 如果认证成功，存储令牌，显示登录成功，关闭登陆界面，将登录按钮替换为用户
        userInfo.token = res.data as IToken;
        localStorage.setItem("token", JSON.stringify(userInfo.token))
        message.success("登录成功", { duration: 2000 });
        emit('login_sucess');

    }).catch(function (error) {
        if (error.response.status == 401)
            message.error("登录失败，用户名或密码错误！", { duration: 2000 });
    });
}

document.addEventListener('keydown', function (e) {
    if (e.code == 'Enter') {
        login();
    }
});
</script>

<template>
    <div class="container">
        <div class="title">登录</div>
        <div>
            <img class="icon" alt="icon" src='/src/Assets/Images/icon.svg' />
        </div>
        <n-form class="login-form" size="large" :model="loginForm">
            <n-form-item label="用户名" path="username">
                <n-input v-model:value="loginForm.username" placeholder="输入用户名" />
            </n-form-item>
            <n-form-item label="密码" path="password">
                <n-input type="password" v-model:value="loginForm.password" placeholder="输入密码" />
            </n-form-item>
            <n-form-item :show-label="false" :show-feedback="false">
                <div style="width: 100%; display: flex; justify-content: center;">
                    <n-button class="submit-button" style="justify-self: center;" @click="login"
                        :disabled="login_button_disabled">
                        登录
                    </n-button>
                </div>
            </n-form-item>
        </n-form>

    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 400px;
    height: 480px;
    background-color: rgb(251, 251, 251);
    border-radius: 1em;
}

.container>* {
    margin-bottom: 24px;
}

.title {
    font-size: 24px;
    font-weight: 300;
}

.icon {
    width: 100px;
}

.login-form {
    width: 240px;
    margin-bottom: 12px;
}
</style>../Utils/Interfaces/interfaces