<template>
  <li v-for="link in navLinks" :key="link.path">
    <router-link
      :to="link.path"
      class="btn m-1 lg:m-1.5"
      :class="route.path === link.path ? 'btn-primary' : 'btn-ghost'"
    >
      <i :class="link.icon"></i>
      {{ link.name }}
    </router-link>
  </li>
</template>

<script setup>
import { useRoute } from "vue-router";
const route = useRoute();

import { ref } from "vue";

const navLinks = ref([
  { name: "主页", icon: "ri-home-5-line lg:text-xl", path: "/" },
  { name: "小说", icon: "ri-book-3-line lg:text-xl", path: "/novel" },
  { name: "联系", icon: "ri-discuss-line lg:text-xl", path: "/contact" },
  { name: "关于", icon: "ri-contacts-line lg:text-xl", path: "/about" },
]);
</script>
