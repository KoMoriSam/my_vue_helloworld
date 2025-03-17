<template>
  <main class="flex items-center justify-between my-6">
    <!-- 上一章 -->
    <button
      class="btn btn-secondary w-[45%]"
      :disabled="!hasPrevious || novelStore.isLoadingContent"
      @click="handlePrev"
    >
      <i class="ri-arrow-left-s-line"></i> 上一章
    </button>

    <!-- 下一章 -->
    <button
      class="btn btn-secondary w-[45%]"
      :disabled="!hasNext || novelStore.isLoadingContent"
      @click="handleNext"
    >
      下一章 <i class="ri-arrow-right-s-line"></i>
    </button>
  </main>
</template>

<script setup>
import { computed } from "vue";
import { useNovelStore } from "@/stores/novelStore";

const novelStore = useNovelStore();

const hasPrevious = computed(() => novelStore.currentChapterId > 1);
const hasNext = computed(
  () => novelStore.currentChapterId < novelStore.flatChapterList.length
);

const handlePrev = () => {
  novelStore.setChapter(novelStore.currentChapterId - 1);
  window.scrollTo({ top: 200, behavior: "smooth" });
};

const handleNext = () => {
  novelStore.setChapter(novelStore.currentChapterId + 1);
  window.scrollTo({ top: 200, behavior: "smooth" });
};
</script>
