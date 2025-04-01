<template>
  <main
    class="flex-1 flex flex-wrap m-12 items-start justify-center lg:justify-evenly gap-4"
  >
    <div class="hero basis-2xl">
      <div class="hero-content flex-col lg:flex-row">
        <img
          src="/assets/image/cover.png"
          alt="向远方"
          class="max-w-3xs rounded-lg shadow-2xl lg:mr-6"
        />
        <div>
          <h1 class="text-5xl font-bold">向远方</h1>
          <p class="py-6">
            慌张中，才学会张口……<br />
            匆忙中，才学会乡音……
          </p>
          <button
            class="btn btn-primary w-full"
            @click="handleClick(), toggleComponent()"
          >
            开始阅读
          </button>
          <ChapterInfo
            v-if="novelStore.readChapterList.length > 0"
            badgeText="继续上次阅读"
            :content="novelStore.currentChapterInfo?.chapter.name"
            additionalClasses="w-full my-6"
            :onClick="() => toggleComponent()"
          />
        </div>
      </div>
    </div>

    <div class="basis-xs">
      <ChapterList
        :toggleComponent="toggleComponent"
        :currentComponent="currentComponent"
      />
    </div>

    <Giscus
      class="basis-sm"
      repo="KoMoriSam/komorisam.github.io"
      repo-id="R_kgDOJxn8KA"
      category="Announcements"
      category-id="DIC_kwDOJxn8KM4Cnp6m"
      mapping="specific"
      term="向远方"
      strict="0"
      reactions-enabled="1"
      emit-metadata="0"
      input-position="top"
      :theme="currentTheme"
      lang="zh-CN"
      loading="lazy"
    />
  </main>
  <FootBar />
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { usePreferredDark } from "@vueuse/core";
import Giscus from "@giscus/vue";

import { useNovelStore } from "@/stores/novel";
import { useThemeStore } from "@/stores/theme";

import ChapterInfo from "@/components/novel/ChapterInfo.vue";
import ChapterList from "@/components/novel/ChapterList.vue";
import FootBar from "@/components/ui/layout/FootBar.vue";

const novelStore = useNovelStore();
const themeStore = useThemeStore();
const isDark = usePreferredDark();
const router = useRouter();
defineProps({
  toggleComponent: {
    type: Function,
    required: true,
  },
  currentComponent: {
    type: String,
    required: true,
  },
});

// 当前主题
const currentTheme = computed(() => {
  if (themeStore.theme === "default") {
    return isDark.value ? "noborder_dark" : "noborder_light";
  } else if (themeStore.theme === "corporate") {
    return "catppuccin_latte";
  } else if (themeStore.theme === "dim") {
    return "catppuccin_macchiato";
  }
  return "preferred_color_scheme";
});

// 初始化加载
onMounted(async () => {
  await novelStore.setChapterList();
});

// 事件处理函数
const handleClick = () => {
  router.push({ query: { chapter: 1, page: 1 } }); // 修改 URL，触发 `watch` 监听
};
</script>
