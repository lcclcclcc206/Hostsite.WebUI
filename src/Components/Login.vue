<script setup lang="ts">
import LoginPanel from '@/Components/Login/LoginPanel.vue';
import { NMessageProvider } from 'naive-ui'
import { useRouter } from 'vue-router';

const router = useRouter();

function login_sucess() {
    router.replace({ name: 'filebrowser' });
}
</script>

<template>
    <main>
        <NMessageProvider>
            <LoginPanel class="login_panel" @login_sucess="login_sucess" />
        </NMessageProvider>
    </main>
</template>

<style scoped>
.login_panel {
    margin: auto;
}
</style>