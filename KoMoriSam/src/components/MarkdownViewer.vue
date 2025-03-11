<template>
  <main class="lg:basis-[50%]">
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
import { ref, watch, computed } from "vue";
import VueMarkdown from "vue-markdown-render";
import Loading from "@/components/ui/Loading.vue";

const props = defineProps({
  currentId: { type: [Number, String], required: true },
  chapters: { type: Array, required: true },
});

const isLoading = ref(false);
const error = ref(null);
const markdownContent = ref("");

const options = {
  html: true,
};

// 获取当前章节
const currentChapter = computed(() => {
  for (const group of props.chapters) {
    const chapter = group.options.find((ch) => ch.id === props.currentId);
    if (chapter) {
      return { chapter, group };
    }
  }
  return null;
});

// 动态生成 Markdown 文件路径
const contentUrl = computed(() => {
  if (!currentChapter.value) return null;

  const { chapter, group } = currentChapter.value;
  const volume = group.label.match(/(.*)/)?.[0]; // 提取卷名
  const fileName = chapter.name; // 章节名称
  return `/assets/markdown/novel/${volume}/${fileName}.md`; // 生成路径
});

// 加载内容
const loadContent = async () => {
  if (!contentUrl.value) return;

  try {
    isLoading.value = true;
    const response = await fetch(contentUrl.value);
    if (!response.ok) throw new Error("加载失败");
    markdownContent.value = await response.text();
    error.value = null;
  } catch (e) {
    error.value = e.message;
    markdownContent.value = "";
  } finally {
    isLoading.value = false;
  }
};

// 监听章节变化
watch(contentUrl, loadContent, { immediate: true });
</script>
