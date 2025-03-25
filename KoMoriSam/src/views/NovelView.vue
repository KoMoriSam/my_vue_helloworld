<template>
  <main class="flex-1 m-0 p-0 w-full h-full">
    <SideBar>
      <template #content ref="target">
        <button
          class="fixed right-6 max-md:left-6 lg:right-12 bottom-26 md:bottom-40 lg:bottom-12 btn btn-square btn-soft btn-lg btn-secondary shadow-sm z-1"
          @click="toggle()"
        >
          <i v-if="isFullscreen" class="ri-collapse-diagonal-fill"></i>
          <i v-else class="ri-expand-diagonal-fill"></i>
        </button>
        <div
          class="flex flex-col md:flex-row h-full md:w-[90%] m-8 lg:m-12 items-start justify-center md:justify-between gap-5"
        >
          <div class="flex-2 lg:basis-24">
            <li
              v-if="novelStore.latestChapter"
              @click="handleChange(novelStore.latestChapter)"
              class="btn btn-info lg:btn-lg w-full text-left justify-start font-bold mb-6"
            >
              <span class="badge font-normal italic text-xs lg:text-base mr-4">
                最新章节
              </span>
              {{ novelStore.latestChapter.name }}
            </li>

            <li
              class="btn lg:btn-lg w-full text-left justify-start font-bold mb-0"
            >
              <span class="badge font-normal italic text-xs lg:text-base mr-4">
                当前章节
              </span>
              {{
                novelStore.currentChapterInfo
                  ? novelStore.currentChapterInfo.chapter.name
                  : "请选择章节"
              }}
            </li>

            <PreNext />
            <Markdown />
            <PreNext v-if="!novelStore.isLoadingContent" />
          </div>
          <div class="divider md:divider-horizontal m-0 p-0"></div>

          <div class="flex-1 mx-auto md:w-[10%] md:sticky md:top-12 md:pr-1">
            <Giscus
              :key="novelStore.currentChapterInfo"
              repo="KoMoriSam/komorisam.github.io"
              repo-id="R_kgDOJxn8KA"
              category="Announcements"
              category-id="DIC_kwDOJxn8KM4Cnp6m"
              mapping="title"
              strict="0"
              reactions-enabled="1"
              emit-metadata="0"
              input-position="top"
              :theme="currentTheme"
              lang="zh-CN"
              loading="lazy"
            />
          </div>
        </div>
        <label
          for="my-drawer-2"
          class="btn btn-soft btn-primary btn-square btn-lg drawer-button z-1 lg:hidden fixed max-md:left-6 md:right-6 bottom-12 md:bottom-26 shadow-sm"
        >
          <i class="ri-file-list-2-line"></i>
        </label>
      </template>
      <template #aside>
        <aside class="flex-1 flex flex-col lg:sticky lg:top-12">
          <ChList />
        </aside>
      </template>
    </SideBar>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePreferredDark, useFullscreen } from "@vueuse/core";

const target = ref(null);
const { isFullscreen, toggle } = useFullscreen(target);

import Giscus from "@giscus/vue";
import { useNovelStore } from "@/stores/novel";
import { useThemeStore } from "@/stores/theme";

import SideBar from "@/components/ui/Layout/SideBar.vue";
import ChList from "@/components/novel/ChList.vue";
import PreNext from "@/components/novel/PreNext.vue";
import Markdown from "@/components/Markdown.vue";

// 路由相关
const route = useRoute();
const router = useRouter();

// 状态管理
const novelStore = useNovelStore();
const themeStore = useThemeStore();
const isDark = usePreferredDark();

const currentTheme = computed(() => {
  if (themeStore.theme === "default") {
    if (isDark) {
      return "noborder_dark";
    }
    return "noborder_light";
  } else if (themeStore.theme === "lemonade") {
    return "noborder_light";
  } else if (themeStore.theme === "forest") {
    return "noborder_dark";
  }
  return "preferred_color_scheme";
});

// 监听路由参数，确保章节 ID 变化时，切换章节
watch(
  () => route.query.chapter,
  async (newId) => {
    if (newId) {
      await novelStore.setChapter(Number(newId));
    }
  }
);

// 监听路由参数，确保 page 变化时切换
watch(
  () => route.query.page,
  (newPage) => {
    if (newPage) {
      novelStore.setPage(Number(newPage));
    }
  }
);

// 初始化加载
onMounted(async () => {
  if (route.query.chapter) {
    await novelStore.setChapter(Number(route.query.chapter));
  }
  novelStore.updateTitle();
  if (route.query.page) {
    novelStore.setPage(Number(route.query.page));
  }
});

// 事件处理函数
const handleChange = (chapter) => {
  router.push({ query: { chapter: chapter.id, page: 1 } }); // 修改 URL，触发 `watch` 监听
};
</script>
