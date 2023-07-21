<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function test() {
    console.log('h');
    router.push({ name: 'filebrowser' });
}
</script>

<template>
    <h1>Hello</h1>
    <button @click="test">test</button>
</template>