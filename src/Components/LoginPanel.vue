<script setup lang="ts">
import { NButton, NForm, NFormItem, NInput } from 'naive-ui'
import { ref, type Ref } from 'vue';

interface LoginForm {
    username: string;
    password: string;
}

let loginForm: Ref<LoginForm> = ref({
    username: '',
    password: ''
});

function login() {
    console.log(JSON.stringify(loginForm.value));
}

</script>

<template>
    <div class="container">
        <div class="title">登录</div>
        <div>
            <img class="icon" alt="icon" src="../Assets/Images/icon.svg" />
        </div>
        <n-form class="login-form" size="large" :model="loginForm">
            <n-form-item label="用户名" path="username">
                <n-input v-model:value="loginForm.username" placeholder="输入用户名" />
            </n-form-item>
            <n-form-item label="密码" path="password">
                <n-input type="password" v-model:value="loginForm.password" placeholder="输入密码" />
            </n-form-item>
        </n-form>
        <n-button @click="login">
            登录
        </n-button>
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
    background-color: rgb(255, 255, 255);
    border-radius: 1em;
}

.container>* {
    margin-bottom: 24px;
}

.title {
    font-size: 24px;
}

.icon {
    width: 100px;
}

.login-form {
    width: 240px;
    margin-bottom: 12px;
}
</style>