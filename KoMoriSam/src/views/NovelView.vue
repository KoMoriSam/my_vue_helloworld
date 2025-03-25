<template>
  <main class="flex-1 m-0 p-0 w-full">
    <SideBar>
      <template #content>
        <div
          class="flex flex-col md:flex-row md:w-[90%] m-8 lg:m-12 items-start justify-center md:justify-between gap-5"
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

          <div class="flex-1 mx-auto md:w-[10%] md:sticky md:top-12">
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
          class="btn btn-soft btn-primary btn-square btn-lg drawer-button z-1 lg:hidden fixed max-md:left-6 md:right-6 bottom-12 md:bottom-32 shadow-sm"
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
import { onMounted, watch, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNovelStore } from "@/stores/novelStore";
import Giscus from "@giscus/vue";

import SideBar from "@/components/ui/Layout/SideBar.vue";
import ChList from "@/components/novel/ChList.vue";
import PreNext from "@/components/novel/PreNext.vue";
import Markdown from "@/components/Markdown.vue";

// 路由相关
const route = useRoute();
const router = useRouter();

// 状态管理
const novelStore = useNovelStore();
const currentTheme = ref("preferred_color_scheme");

// 生命周期钩子
onMounted(async () => {
  await novelStore.setChapterList();
  novelStore.updateTitle();

  watch(
    () => novelStore.currentChapterId,
    (newId) => {
      router.push({
        query: {
          chapter: newId,
          page: 1,
        },
      });
    }
  );
  watch(
    () => novelStore.currentChapterPage,
    (newPage) => {
      router.push({
        query: {
          chapter: route.query.chapter,
          page: newPage,
        },
      });
    }
  );
});

// 事件处理函数
const handleChange = (chapter) => {
  novelStore.setChapter(chapter.id);
};

// 监听路由参数变化;
watch(
  () => route.query.chapter,
  async (chapter) => {
    await novelStore.setChapter(Number(chapter));
    novelStore.updateTitle();
  },
  { immediate: true }
);

watch(
  () => route.query.page,
  (page) => {
    novelStore.setPage(Number(page));
  }
);
</script>
