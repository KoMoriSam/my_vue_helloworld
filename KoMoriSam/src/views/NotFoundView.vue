<template>
  <BasePage
    :imageSrc="meImage"
    imageAlt="me!"
    title="Ah Oh!"
    description="404 Not Found :("
  >
    <!-- 可选：插入额外内容 -->
    <button class="btn btn-primary" @click="route.push('/')">回到主页</button>
  </BasePage>
</template>

<script setup>
import BasePage from "@/components/BasePage.vue";
import meImage from "@/assets/img/me4.png";

import { useRouter } from "vue-router";
const route = useRouter();
</script>
