<template>
  <main class="flex items-center justify-between my-6">
    <!-- 上一章 -->
    <button
      class="btn btn-secondary w-[45%]"
      :disabled="!hasPrevious || isLoadingContent"
      @click="handlePrev"
    >
      <i class="ri-arrow-left-s-line"></i> 上一章
    </button>

    <!-- 下一章 -->
    <button
      class="btn btn-secondary w-[45%]"
      :disabled="!hasNext || isLoadingContent"
      @click="handleNext"
    >
      下一章 <i class="ri-arrow-right-s-line"></i>
    </button>
  </main>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  currentId: { type: [Number, String, null], required: true },
  chapters: { type: Array, required: true },
  isLoadingContent: { type: Boolean, required: true },
});

const emit = defineEmits(["handle-change"]);

// 扁平化章节列表
const flatChapters = computed(() => props.chapters.flatMap((g) => g.options));

const currentIndex = computed(() =>
  flatChapters.value.findIndex((ch) => ch.id === props.currentId)
);

const hasPrevious = computed(() => currentIndex.value > 0);
const hasNext = computed(
  () => currentIndex.value < flatChapters.value.length - 1
);

const handlePrev = () =>
  emit("handle-change", flatChapters.value[currentIndex.value - 1]);
const handleNext = () =>
  emit("handle-change", flatChapters.value[currentIndex.value + 1]);
</script>
