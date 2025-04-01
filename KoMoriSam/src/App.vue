<template>
  <div class="min-h-screen flex flex-col bg-base-100">
    <NavBar />
    <router-view />
  </div>
</template>

<script setup>
import NavBar from "@/components/ui/layout/NavBar.vue";
</script>
