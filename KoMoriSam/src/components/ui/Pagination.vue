<template>
  <div class="join flex items-center justify-center m-6 lg:m-12">
    <button
      class="join-item btn"
      @click="handleChane(novelStore.currentChapterPage - 1)"
      :disabled="novelStore.currentChapterPage === 0"
    >
      <i class="ri-arrow-left-s-line"></i>
    </button>
    <button class="join-item md:hidden btn">
      第 {{ novelStore.currentChapterPage + 1 }} 页 / 共
      {{ novelStore.totalPages }} 页
    </button>
    <button
      v-for="(page, idx) in novelStore.totalPages"
      :key="idx"
      @click="handleChane(idx)"
      :class="idx === novelStore.currentChapterPage ? 'btn-primary' : ''"
      class="hidden md:flex join-item btn"
    >
      {{ page }}
    </button>
    <button
      class="join-item btn"
      @click="handleChane(novelStore.currentChapterPage + 1)"
      :disabled="novelStore.currentChapterPage === novelStore.totalPages - 1"
    >
      <i class="ri-arrow-right-s-line"></i>
    </button>
  </div>
</template>

<script setup>
import { useNovelStore } from "@/stores/novelStore";

// 状态管理
const novelStore = useNovelStore();

const handleChane = (pageIndex) => {
  novelStore.setPage(pageIndex);
  window.scrollTo({ top: 200, behavior: "smooth" });
};
</script>
