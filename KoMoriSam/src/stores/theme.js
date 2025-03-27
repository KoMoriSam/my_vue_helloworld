import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useStorage } from "@vueuse/core";

export const useThemeStore = defineStore("theme", () => {
  const theme = useStorage("SET_THEME", "default");

  const themeList = ref([
    { name: "跟随系统", icon: "ri-contrast-line", value: "default" },
    { name: "日间模式", icon: "ri-sun-line", value: "corporate" },
    { name: "夜间模式", icon: "ri-moon-line", value: "dim" },
  ]);

  const currentTheme = computed(() => {
    return (
      themeList.value.find((t) => t.value === theme.value) || {
        icon: "ri-contrast-line",
      }
    );
  });

  // 修改主题并存储
  function setTheme(newTheme) {
    theme.value = newTheme;
  }

  return { theme, themeList, currentTheme, setTheme };
});
