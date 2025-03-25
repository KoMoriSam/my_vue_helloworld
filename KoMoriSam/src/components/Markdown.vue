<template>
  <main class="flex-2 min-h-dvh">
    <Loading
      v-if="novelStore.currentChapterInfo && novelStore.isLoadingContent"
    />
    <article
      v-else
      class="prose prose-2xl max-w-none prose-h1:text-3xl prose-h2:text-2xl prose-p:text-justify prose-p:indent-12.5 quotes-none prose-blockquote:prose-p:not-italic prose-blockquote:prose-p:indent-0 prose-blockquote:ps-4 lg:prose-blockquote:ps-8 prose-blockquote:prose-p:text-left"
      :class="novelStore.fontStyle"
    >
      <vue-markdown
        v-if="novelStore.totalPages > 0"
        :source="novelStore.currentPageContent"
        :options="options"
      />
      <h1 v-else-if="!novelStore.currentChapterInfo">请选择章节</h1>
      <h1 v-else>加载失败，请稍后重试。</h1>
    </article>
    <Pagination v-if="novelStore.totalPages > 1" />
  </main>
</template>

<script setup>
import { useNovelStore } from "@/stores/novelStore";

import VueMarkdown from "vue-markdown-render";
import Loading from "@/components/ui/Loading.vue";
import Pagination from "@/components/ui/Pagination.vue";

// 状态管理
const novelStore = useNovelStore();

// Markdown 渲染选项
const options = {
  html: true,
  typographer: true,
};
</script>
