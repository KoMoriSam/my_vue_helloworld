<template>
  <div class="dropdown">
    <div tabindex="0" role="button" class="btn btn-ghost m-1">
      <i :class="currentTheme.icon"></i>主题
      <i class="ri-arrow-down-s-line"></i>
    </div>
    <ul
      tabindex="0"
      class="menu menu-sm dropdown-content bg-base-200 rounded-box z-1 mt-5 w-max p-0 shadow"
    >
      <li v-for="style in themeList" :key="style.value">
        <div class="relative inline-block">
          <i
            class="absolute translate-x-2.25 translate-y-3 lg:translate-y-3.25 z-1"
            :class="style.icon"
          ></i>
          <input
            type="radio"
            name="theme-dropdown"
            class="theme-controller btn btn-sm btn-ghost justify-end pl-6 my-1 lg:my-1.5"
            :aria-label="style.name"
            :value="style.value"
            v-model="theme"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";

// 从 localStorage 初始化主题，若不存在则默认为空字符串
const theme = ref(JSON.parse(localStorage.getItem("theme") || '""'));

// 监听主题变化并保存到 localStorage
watch(theme, (newTheme) => {
  localStorage.setItem("theme", JSON.stringify(newTheme));
});

const currentTheme = computed(() => {
  const foundTheme = themeList.value.find((t) => t.value === theme.value);
  return foundTheme || { icon: "ri-contrast-line" }; // 默认图标
});

const themeList = ref([
  { name: "自动模式", icon: "ri-contrast-line", value: "default" },
  { name: "日间模式", icon: "ri-sun-line", value: "lemonade" },
  { name: "夜间模式", icon: "ri-moon-line", value: "forest" },
]);
</script>
