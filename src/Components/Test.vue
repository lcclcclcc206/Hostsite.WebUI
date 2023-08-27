<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

console.log(route.params.dir);
console.log(route.query.relativePathStack);
</script>

<template>
    <h1>Hello</h1>
</template>