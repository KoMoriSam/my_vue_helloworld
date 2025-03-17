<template>
  <main class="flex-1">
    <SideBar>
      <template #content>
        <Loading v-if="novelStore.isLoadingList" />

        <div
          class="flex flex-col lg:flex-row m-8 lg:m-12 items-start lg:justify-evenly gap-10"
          v-else
        >
          <div class="flex-2 basis-24">
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
              v-if="novelStore.currentChapter"
              class="btn lg:btn-lg w-full text-left justify-start font-bold mb-0"
            >
              <span class="badge font-normal italic text-xs lg:text-base mr-4">
                当前章节
              </span>
              {{ novelStore.currentChapter.chapter.name }}
            </li>

            <PreNext />
            <Markdown />
            <PreNext v-if="!novelStore.isLoadingContent" />
          </div>
          <div class="divider lg:divider-horizontal m-0"></div>

          <div
            class="flex-1 basis-4 prose prose-2xl prose-h1:text-3xl max-w-none"
          >
            <h1>评论区</h1>
            <p>Coming Soon……</p>
          </div>
        </div>
        <label
          for="my-drawer-2"
          class="btn btn-soft btn-primary btn-square btn-lg drawer-button z-1 lg:hidden fixed left-6 lg:left-12 bottom-12 lg:bottom-32 shadow-sm"
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
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNovelStore } from "@/stores/novelStore";

import SideBar from "@/components/ui/Layout/SideBar.vue";
import ChList from "@/components/novel/ChList.vue";
import PreNext from "@/components/novel/PreNext.vue";
import Markdown from "@/components/Markdown.vue";
import Loading from "@/components/ui/Loading.vue";

// 路由相关
const route = useRoute();
const router = useRouter();

// 状态管理
const novelStore = useNovelStore();

// 生命周期钩子
onMounted(async () => {
  await novelStore.setChapterList();

  // 优先使用路由参数
  if (route.query.chapter) {
    await novelStore.setChapter(Number(route.query.chapter));
  }

  await novelStore.setChapter(); // 加载默认章节
});

// 事件处理函数
const handleChange = async (chapter) => {
  await novelStore.setChapter(chapter.id);
};

// 监听路由参数变化
watch(
  [() => novelStore.currentChapterId, () => novelStore.currentChapterPage],
  ([newId, newPage]) => {
    router.push({
      query: {
        chapter: newId,
        page: newPage + 1,
      },
    });
  },
  { immediate: true }
);

watch(
  () => route.query,
  async ({ chapter, page }) => {
    await novelStore.setChapter(Number(chapter), Number(page) - 1);
  },
  { immediate: true }
);

watch(
  () => novelStore.chapterList,
  async () => {
    await novelStore.loadChapterContent();
  },
  { immediate: true }
);
</script>
