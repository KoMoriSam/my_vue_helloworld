<template>
  <div class="min-h-screen flex flex-col bg-base-100">
    <NavBar />
    <router-view class="flex-1 my-10 lg:m-auto" />
    <FootBar />
  </div>
</template>

<script setup>
import NavBar from "./components/ui/nav/NavBar.vue";
import FootBar from "./components/ui/FootBar.vue";
</script>
