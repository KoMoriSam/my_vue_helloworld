<template>
  <div class="navbar bg-base-100 shadow-sm">
    <div class="navbar-start">
      <a
        @click="router.push('/')"
        class="hidden lg:btn lg:btn-ghost lg:text-xl"
      >
        <img src="@/assets/img/logo.png" alt="KoMoriSam" class="h-8" />
      </a>
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <i class="fill-current ri-menu-line text-base lg:text-xl"></i>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content bg-base-200 rounded-box z-1 mt-5 w-max p-0 shadow"
        >
          <NavLinks />
        </ul>
      </div>
    </div>
    <div class="navbar-center">
      <a @click="router.push('/')" class="lg:hidden btn btn-ghost text-xl">
        <img src="@/assets/img/logo.png" alt="KoMoriSam" class="h-8" />
      </a>
      <div class="hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <NavLinks />
        </ul>
      </div>
    </div>
    <div class="navbar-end">
      <ThemeController />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

import NavLinks from "./NavLinks.vue";
import ThemeController from "../theme/ThemeController.vue";
</script>
