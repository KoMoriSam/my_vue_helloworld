<template>
  <article class="prose lg:prose-xl flex flex-col items-center justify-center">
    <h1>Ah Oh!</h1>
    <p>404 Not Found :(</p>
    <button class="btn btn-primary" @click="route.push('/')">回到主页</button>
  </article>
</template>

<script setup>
import { useRouter } from "vue-router";
const route = useRouter();
</script>
