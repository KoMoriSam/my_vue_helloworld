<template>
  <main class="flex flex-wrap">
    <!-- 上一章 -->
    <button
      class="btn btn-secondary m-1"
      :disabled="!hasPrevious"
      @click="handlePrev"
    >
      <i class="ri-arrow-left-s-line"></i> 上一章
    </button>

    <!-- 下一章 -->
    <button
      class="btn btn-secondary m-1"
      :disabled="!hasNext"
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
