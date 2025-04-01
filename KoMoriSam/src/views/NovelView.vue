<template>
  <main class="flex-1 m-0 p-0 w-full h-full">
    <SideBar>
      <template #content ref="target">
        <div class="flex-2 lg:basis-24">
          <ChapterInfo
            v-if="novelStore.latestChapter"
            badgeText="最新章节"
            :content="novelStore.latestChapter.name"
            additionalClasses="btn-info mb-6"
            :onClick="() => handleChange(novelStore.latestChapter)"
          />
          <ChapterInfo
            badgeText="当前章节"
            :content="
              novelStore.currentChapterInfo
                ? novelStore.currentChapterInfo.chapter.name
                : '请选择章节'
            "
          />
          <ChapterController />
          <Markdown />
          <ChapterController v-if="!novelStore.isLoadingContent" />
        </div>

        <div class="divider md:divider-horizontal m-0 p-0"></div>

        <div
          class="flex-1 mx-auto mb-12 md:mb-auto md:w-[10%] md:sticky md:top-12 prose"
        >
          <h1 class="inline">
            {{ currentMapping === "title" ? "本章说" : "本书说" }}
          </h1>
          <button class="badge badge-info mx-2 mb-4" @click="commentToggle">
            {{ currentMapping === "title" ? "切换本书说" : "切换本章说" }}
          </button>
          <Giscus
            :key="novelStore.currentChapterInfo?.chapter.name"
            repo="KoMoriSam/komorisam.github.io"
            repo-id="R_kgDOJxn8KA"
            category="Announcements"
            category-id="DIC_kwDOJxn8KM4Cnp6m"
            :mapping="currentMapping"
            term="向远方"
            strict="0"
            reactions-enabled="1"
            emit-metadata="0"
            input-position="top"
            :theme="currentTheme"
            lang="zh-CN"
            loading="lazy"
          />
        </div>

        <div class="max-md:dock">
          <FloatingButton
            for="my-drawer-2"
            icon="ri-settings-3-line"
            label="设置"
            position-classes="md:bottom-60"
            button-class="md:btn-primary"
            :onClick="() => (currentTool = 'FormatToolbox')"
          />
          <FloatingButton
            for="my-drawer-2"
            icon="ri-file-list-2-line"
            label="目录"
            position-classes="md:bottom-46"
            button-class="md:btn-primary"
            :onClick="() => (currentTool = 'ChapterList')"
          />
          <FloatingButton
            :icon="
              isFullscreen
                ? 'ri-collapse-diagonal-fill'
                : 'ri-expand-diagonal-fill'
            "
            label="全屏"
            position-classes="md:bottom-32"
            button-class="md:btn-secondary"
            :onClick="toggle"
          />
        </div>
      </template>

      <template #aside>
        <KeepAlive>
          <component :is="tools[currentTool]"></component>
        </KeepAlive>
      </template>
    </SideBar>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onActivated, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePreferredDark, useFullscreen } from "@vueuse/core";

import Giscus from "@giscus/vue";
import { useNovelStore } from "@/stores/novel";
import { useThemeStore } from "@/stores/theme";

import SideBar from "@/components/ui/layout/SideBar.vue";
import ChapterList from "@/components/novel/ChapterList.vue";
import ChapterController from "@/components/novel/ChapterController.vue";
import FormatToolbox from "@/components/novel/FormatToolbox.vue";
import Markdown from "@/components/Markdown.vue";
import ChapterInfo from "@/components/novel/ChapterInfo.vue";
import FloatingButton from "@/components/ui/button/FloatingButton.vue";

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

const currentMapping = ref("title");

// 切换评论映射
const commentToggle = () => {
  currentMapping.value =
    currentMapping.value === "title" ? "specific" : "title";
};

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

// 监听路由参数变化
watch(
  () => route.query.chapter,
  async (newId) => {
    if (newId) {
      await novelStore.setChapter(Number(newId));
    }
  }
);

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

// 监听章节变化，自动更新标题
watch(
  () => [novelStore.currentChapterId, novelStore.currentChapterPage],
  () => {
    novelStore.updateTitle();
  }
);

// 在组件挂载或激活时重新更新标题
onActivated(() => {
  novelStore.updateTitle();
});

// 事件处理函数
const handleChange = (chapter) => {
  router.push({ query: { chapter: chapter.id, page: 1 } }); // 修改 URL，触发 `watch` 监听
};

// 全屏相关
const target = ref(null);
const { isFullscreen, toggle } = useFullscreen(target);
</script>
