<template>
  <main class="flex-1 m-0 p-0 w-full h-full">
    <SideBar>
      <template #content ref="target">
        <button
          class="fixed right-6 lg:right-12 bottom-32 btn btn-square btn-soft btn-lg btn-secondary shadow-sm z-1 max-md:hidden"
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

            <ChapterController />
            <Markdown />
            <ChapterController v-if="!novelStore.isLoadingContent" />
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
        <div class="dock md:hidden">
          <label for="my-drawer-2" @click="currentTool = 'ChapterList'">
            <i class="ri-file-list-2-line"></i>
            <span class="dock-label">目录</span>
          </label>
          <label for="my-drawer-2" @click="currentTool = 'FormatToolbox'">
            <i class="ri-settings-3-line"></i>
            <span class="dock-label">设置</span>
          </label>
          <button @click="toggle()">
            <i v-if="isFullscreen" class="ri-collapse-diagonal-fill"></i>
            <i v-else class="ri-expand-diagonal-fill"></i>
            <span class="dock-label">全屏</span>
          </button>
        </div>
        <label
          for="my-drawer-2"
          class="btn btn-soft btn-primary btn-square btn-lg drawer-button z-1 fixed max-md:hidden md:right-6 lg:right-12 bottom-18 md:bottom-46 shadow-sm"
          @click="currentTool = 'ChapterList'"
        >
          <i class="ri-file-list-2-line"></i>
        </label>
        <label
          for="my-drawer-2"
          class="btn btn-soft btn-primary btn-square btn-lg drawer-button z-1 fixed max-md:hidden md:right-6 lg:right-12 bottom-32 md:bottom-60 shadow-sm"
          @click="currentTool = 'FormatToolbox'"
        >
          <i class="ri-settings-3-line"></i>
        </label>
      </template>
      <template #aside>
        <aside class="flex-1 flex flex-col lg:sticky lg:top-12">
          <KeepAlive>
            <component :is="tools[currentTool]"></component>
          </KeepAlive>
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

import SideBar from "@/components/ui/layout/SideBar.vue";
import ChapterList from "@/components/novel/ChapterList.vue";
import ChapterController from "@/components/novel/ChapterController.vue";
import FormatToolbox from "@/components/novel/FormatToolbox.vue";
import Markdown from "@/components/Markdown.vue";

// 路由相关
const route = useRoute();
const router = useRouter();

// 状态管理
const novelStore = useNovelStore();
const themeStore = useThemeStore();
const isDark = usePreferredDark();
const currentTool = ref("ChapterList");
const tools = {
  ChapterList,
  FormatToolbox,
};

const currentTheme = computed(() => {
  if (themeStore.theme === "default") {
    if (isDark) {
      return "noborder_dark";
    }
    return "noborder_light";
  } else if (themeStore.theme === "corporate") {
    return "catppuccin_latte";
  } else if (themeStore.theme === "dim") {
    return "catppuccin_macchiato";
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
  await novelStore.setChapterList();
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
