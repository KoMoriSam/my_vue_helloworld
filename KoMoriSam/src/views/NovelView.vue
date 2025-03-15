<template>
  <main class="flex-1">
    <SideBar>
      <template #content>
        <Loading v-if="isLoadingList" />

        <div
          class="flex flex-col lg:flex-row m-8 lg:m-12 items-start lg:justify-evenly gap-10"
          v-else
        >
          <div class="flex-2 basis-24">
            <li
              v-if="currentChapter"
              class="btn lg:btn-lg w-full text-left justify-start font-bold mb-6"
            >
              <span class="badge font-normal italic text-xs lg:text-base mr-4"
                >当前章节</span
              >
              {{ currentChapter.name }}
            </li>

            <li
              v-if="latestChapter"
              @click="handleChange(latestChapter)"
              class="btn btn-info lg:btn-lg w-full text-left justify-start font-bold mb-0"
            >
              <span class="badge font-normal italic text-xs lg:text-base mr-4"
                >最新章节</span
              >
              {{ latestChapter.name }}
            </li>

            <PreNext
              :current-id="currentId"
              :chapters="chapters"
              :is-loading-content="isLoadingContent"
              @handle-change="handleChange"
            />
            <Markdown
              :current-id="currentId"
              :current-page="currentPage + 1"
              :chapters="chapters"
              v-model="isLoadingContent"
              @handle-loading="handleChange"
            />
            <PreNext
              :current-id="currentId"
              :chapters="chapters"
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
          class="btn btn-soft btn-primary btn-square btn-lg drawer-button z-1 lg:hidden fixed left-6 lg:left-12 bottom-12 lg:bottom-32 shadow-sm"
        >
          <i class="ri-file-list-2-line"></i>
        </label>
      </template>
      <template #aside>
        <aside class="flex-1 flex flex-col lg:sticky lg:top-12">
          <ChList
            :current-id="currentId"
            :chapters="chapters"
            :readChapters="readChapters"
            @handle-change="handleChange"
          />
        </aside>
      </template>
    </SideBar>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from "vue";
import { useRoute, useRouter } from "vue-router";

import SideBar from "@/components/ui/Layout/SideBar.vue";
import ChList from "@/components/novel/ChList.vue";
import PreNext from "@/components/novel/PreNext.vue";
import Markdown from "@/components/Markdown.vue";
import Loading from "@/components/ui/Loading.vue";

import { getReadChapters, setReadChapters } from "@/utils/storageServicer";

// 状态管理
const isLoadingList = ref(true);
const isLoadingContent = ref(true);
const chapters = ref([]);
const flatChapters = ref([]);
const readChapters = ref([]);
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

    // 检查当前章节是否需要标记为已读
    const readList = getReadChapters();
    if (readList) {
      readChapters.value = readList;
    }

    const currentChapter = flatChapters.value.find(
      (ch) => ch.id === currentId.value
    );
    if (
      currentChapter &&
      !readChapters.value.some((ch) => ch.id === currentId.value)
    ) {
      setReadChapters(currentChapter);
      readChapters.value = [...readChapters.value, currentChapter];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    isLoadingList.value = false;
  }
});

// 事件处理函数
const handleChange = (chapter) => {
  const nowReadChapter = flatChapters.value.find((ch) => ch.id === chapter.id);
  if (nowReadChapter) setReadChapters(nowReadChapter);

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
    currentId.value = Number(chapterId);
    currentPage.value = Number(page) - 1;

    // 确保 flatChapters 已初始化
    if (flatChapters.value.length > 0) {
      // 检查当前章节是否需要标记为已读
      const currentChapter = flatChapters.value.find(
        (ch) => ch.id === currentId.value
      );
      if (
        currentChapter &&
        !readChapters.value.some((ch) => ch.id === currentId.value)
      ) {
        setReadChapters(currentChapter);
        readChapters.value = [...readChapters.value, currentChapter];
      }
    }
  },
  { immediate: true }
);
</script>
