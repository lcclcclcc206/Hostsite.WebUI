<script setup lang="ts">
import { UserInfoStore } from '@/Stores/UserInfoStore'

const userInfo = UserInfoStore();
</script>

<template>
    <h1>Hello</h1>
    <p>{{ userInfo.token?.username }}</p>
</template>