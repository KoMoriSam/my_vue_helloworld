<template>
  <BasePage
    :imageSrc="`/assets/image/me4.png`"
    imageAlt="me!"
    title="Ah Oh!"
    description="404 Not Found :("
  >
    <button class="btn btn-primary" @click="route.push('/')">回到主页</button>
  </BasePage>
</template>

<script setup>
import BasePage from "@/components/ui/layout/BasePage.vue";

import { useRouter } from "vue-router";
const route = useRouter();
</script>
