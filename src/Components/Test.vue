<script setup lang="ts">
import { useUserInfoStore } from '@/Stores/UserInfoStore'
import { useAxiosStore } from '@/Stores/AxiosStore';
import { BASE_URL } from '@/Utils/constant';

const userInfo = useUserInfoStore();
const axios = useAxiosStore();


axios.useToken.post(`${BASE_URL}/test`)
    .then((res) => {
        console.log('success');
    });
</script>

<template>
    <h1>Hello</h1>
    <p>{{ userInfo.token?.username }}</p>
</template>