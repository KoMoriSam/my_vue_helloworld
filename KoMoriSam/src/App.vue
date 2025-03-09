<template>
  <div class="min-h-screen flex flex-col bg-base-100">
    <NavBar />
    <router-view />
    <FootBar />
  </div>
</template>

<script setup>
import NavBar from "./components/ui/Layout/NavBar.vue";
import FootBar from "./components/ui/Layout/FootBar.vue";
</script>
