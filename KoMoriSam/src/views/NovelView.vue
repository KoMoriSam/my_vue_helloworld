<template>
  <main class="flex-1">
    <div class="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content flex flex-col items-start justify-start">
        <Loading v-if="isLoadingList" />

        <div
          class="flex flex-col lg:flex-row m-8 lg:m-12 items-start lg:justify-evenly gap-10"
          v-else
        >
          <div class="flex-2 basis-24">
            <li
              v-if="currentChapter"
              class="btn w-full text-left justify-start font-bold lg:py-4 mb-6"
            >
              <span class="badge font-normal italic text-xs">当前章节</span>
              {{ currentChapter.name }}
            </li>

            <li
              v-if="latestChapter"
              @click="handleChange(latestChapter)"
              class="btn btn-info w-full text-left justify-start font-bold lg:py-4 mb-0"
            >
              <span class="badge font-normal italic text-xs">最新章节</span>
              {{ latestChapter.name }}
            </li>

            <PreNext
              :current-id="currentId"
              :chapters
              :is-loading-content="isLoadingContent"
              @handle-change="handleChange"
            />
            <Markdown
              :current-id="currentId"
              :current-page="currentPage + 1"
              :chapters
              v-model="isLoadingContent"
              @handle-loading="handleChange"
            />
            <PreNext
              :current-id="currentId"
              :chapters
              :is-loading-content="isLoadingContent"
              @handle-change="handleChange"
              v-if="!isLoadingContent"
            />
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
          class="btn btn-soft btn-primary btn-square btn-lg drawer-button lg:hidden fixed left-6 lg:left-12 bottom-32"
        >
          <i class="ri-file-list-2-line"></i>
        </label>
      </div>
      <div class="drawer-side">
        <label
          for="my-drawer-2"
          aria-label="close sidebar"
          class="drawer-overlay"
        ></label>
        <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          <aside class="flex-1 flex flex-col lg:sticky lg:top-12">
            <ChList
              :current-id="currentId"
              :chapters
              @handle-change="handleChange"
            />
          </aside>
        </ul>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from "vue";
import { useRoute, useRouter } from "vue-router";

import ChList from "@/components/novel/ChList.vue";
import PreNext from "@/components/novel/PreNext.vue";
import Markdown from "@/components/Markdown.vue";
import Loading from "@/components/ui/Loading.vue";

// 状态管理
const isLoadingList = ref(true);
const isLoadingContent = ref(true);
const chapters = ref([]);
const flatChapters = ref([]);
const currentId = ref(null);
const currentPage = ref(0); // 当前页码

// 路由相关
const route = useRoute();
const router = useRouter();

// 当前章节名称
const currentChapter = computed(() => {
  return flatChapters.value.find((ch) => ch.id === currentId.value);
});

// 获取最新章节
const latestChapter = computed(() => {
  return flatChapters.value[flatChapters.value.length - 1];
});

// 生命周期钩子
onMounted(async () => {
  try {
    const res = await fetch("/assets/markdown/novel/list.json");
    const data = await res.json();
    chapters.value = data;
    flatChapters.value = chapters.value.flatMap((chapter) => chapter.options);

    // 优先使用路由参数
    currentId.value = route.params.chapterId
      ? Number(route.params.chapterId)
      : flatChapters.value[0]?.id;
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    isLoadingList.value = false;
  }
});

// 事件处理函数
const handleChange = (chapter) => {
  chapters.value.forEach((group) => {
    const readChapter = group.options.find((ch) => ch.id === chapter.id);
    if (readChapter) chapter.read = true;
  });

  router.push({
    name: "novel",
    params: {
      chapterId: chapter.id,
      page: 1, // 总是跳转到新章节的第一页
    },
  });

  handleToTop();
};

const scrollToTop = inject("scrollToTop"); // 注入方法

const handleToTop = () => {
  scrollToTop(); // 平滑滚动到顶部
};

// 监听路由参数变化
watch(
  () => route.params,
  ({ chapterId, page }) => {
    currentId.value = Number(chapterId); // 转换为数字类型
    currentPage.value = Number(page) - 1; // 转换为数字并处理页码索引
  },
  { immediate: true }
);
</script>
