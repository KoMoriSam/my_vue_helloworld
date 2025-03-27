<template>
  <div class="min-h-screen flex flex-col bg-base-100">
    <NavBar />
    <router-view />
    <ToTop />
  </div>
</template>

<script setup>
import NavBar from "@/components/ui/layout/NavBar.vue";
import ToTop from "@/components/ui/ToTop.vue";
</script>
