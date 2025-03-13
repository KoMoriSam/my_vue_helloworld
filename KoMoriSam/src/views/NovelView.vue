<template>
  <main class="flex-1">
    <Loading v-if="isLoading" />

    <div
      class="flex flex-col lg:flex-row m-8 lg:m-12 items-center lg:items-start lg:justify-evenly gap-10"
      v-else
    >
      <aside class="flex-1 sticky">
        <ChList
          title="章节列表"
          :current-id="currentId"
          :chapters
          @handle-change="handleChange"
        />
        <PreNext
          :current-id="currentId"
          :chapters
          @handle-change="handleChange"
        />
      </aside>
      <div class="divider lg:divider-horizontal m-0"></div>

      <Markdown
        :current-id="currentId"
        :current-page="currentPage + 1"
        :chapters
      >
        <PreNext
          :current-id="currentId"
          :chapters
          @handle-change="handleChange"
        />
      </Markdown>
      <div class="divider lg:divider-horizontal m-0"></div>

      <div class="flex-1 prose prose-2xl prose-h1:text-3xl max-w-none">
        <h1>评论区</h1>
        <p>Coming Soon……</p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import ChList from "@/components/novel/ChList.vue";
import PreNext from "@/components/novel/PreNext.vue";
import Markdown from "@/components/Markdown.vue";
import Loading from "@/components/ui/Loading.vue";

// 状态管理
const isLoading = ref(true);
const chapters = ref([]);
const currentId = ref(null);
const currentPage = ref(0); // 当前页码

// 路由相关
const route = useRoute();
const router = useRouter();

// 生命周期钩子
onMounted(async () => {
  try {
    const res = await fetch("/assets/markdown/novel/list.json");
    const data = await res.json();
    chapters.value = data;

    // 优先使用路由参数
    currentId.value = route.params.chapterId
      ? Number(route.params.chapterId)
      : chapters.value[0].options[0].id;
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    isLoading.value = false;
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
