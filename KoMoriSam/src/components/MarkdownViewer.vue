<template>
  <main class="lg:basis-3xl">
    <Loading v-show="isLoading" />
    <div v-show="!isLoading">
      <article class="prose prose-2xl lg:prose lg:prose-2xl">
        <vue-markdown
          v-if="markdownContent"
          :source="markdownContent"
          :options
        />
        <h1 v-else-if="!error">请选择章节</h1>
        <h1 v-else class="text-red-500">加载失败，请稍后重试。</h1>
      </article>
    </div>
  </main>
</template>

<script setup>
import { ref, watch } from "vue";
import VueMarkdown from "vue-markdown-render";
import Loading from "@/components/ui/Loading.vue";

const isLoading = ref(true);
const options = { html: true };

const props = defineProps({
  currentId: {
    type: [String, Number, null],
    required: true,
  },
  chapters: {
    type: Array,
    required: true,
  },
});

const markdownContent = ref("");
const error = ref(null);

// 根据 currentId 获取对应的 Markdown 文件路径
const getMarkdownPath = (id) => {
  // 遍历章节数据，找到对应的章节
  for (const group of props.chapters) {
    const chapter = group.options.find((ch) => ch.id === id);
    if (chapter) {
      // 根据卷号和章节名称生成路径
      const volume = group.label.split(" ")[1]; // 提取卷号（如 "壹"）
      const fileName = chapter.name; // 去除空格
      return `/assets/markdown/novel/${volume}/${fileName}.md`;
    }
  }
  return null;
};

// 加载 Markdown 文件
const fetchMarkdown = async (id) => {
  const path = getMarkdownPath(id);
  if (!path) {
    error.value = "未找到对应的章节文件";
    markdownContent.value = "";
    return;
  }

  try {
    isLoading.value = true;
    const response = await fetch(path);
    if (!response.ok) throw new Error("文件加载失败");
    isLoading.value = false;
    markdownContent.value = await response.text();
    error.value = null;
  } catch (err) {
    console.error("加载 Markdown 失败:", err);
    error.value = err.message;
    markdownContent.value = "";
  }
};

// 监听 currentId 变化
watch(
  () => props.currentId,
  (newId) => {
    if (newId) fetchMarkdown(newId);
  },
  { immediate: true }
);
</script>
