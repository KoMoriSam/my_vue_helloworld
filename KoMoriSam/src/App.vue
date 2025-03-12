<template>
  <div class="min-h-screen flex flex-col bg-base-100">
    <NavBar />
    <router-view />
    <ToTop ref="childRef" />
    <FootBar />
  </div>
</template>

<script setup>
import NavBar from "@/components/ui/Layout/NavBar.vue";
import FootBar from "@/components/ui/Layout/FootBar.vue";
import ToTop from "@/components/ui/ToTop.vue";

import { ref, provide } from "vue";
const childRef = ref(null); // 获取ToTop组件的引用

// 将方法通过provide提供给所有子组件
provide("scrollToTop", () => {
  childRef.value?.scrollToTop();
});
</script>
