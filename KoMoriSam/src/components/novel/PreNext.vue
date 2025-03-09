<template>
  <main class="flex flex-wrap">
    <button
      class="btn btn-secondary m-1"
      :disabled="!hasPrevious"
      @click="handleFirst"
    >
      ⏮️ 回首章
    </button>

    <!-- 上一章 -->
    <button
      class="btn btn-secondary m-1"
      :disabled="!hasPrevious"
      @click="handlePrev"
    >
      ◀️ 上一章
    </button>

    <!-- 下一章 -->
    <button
      class="btn btn-secondary m-1"
      :disabled="!hasNext"
      @click="handleNext"
    >
      下一章 ▶️
    </button>

    <!-- 最新章节 -->
    <button
      class="btn btn-secondary m-1"
      :disabled="!hasNext"
      @click="handleLast"
    >
      最新章 ⏭️
    </button>
  </main>
</template>

<script setup>
import { computed, defineProps, defineEmits } from "vue";

const props = defineProps({
  // 当前选中章节ID
  currentId: [String, Number],
  // 章节数据结构（分组格式）
  chapters: {
    type: Array,
    required: true,
    validator: (groups) =>
      groups.every((g) => g.options.every((ch) => "id" in ch)),
  },
});

const emit = defineEmits(["change-ch"]);

// 扁平化后的章节列表
const flatChapters = computed(() => {
  return props.chapters.flatMap((group) => group.options);
});

// 当前章节索引
const currentIndex = computed(() => {
  return flatChapters.value.findIndex((ch) => ch.id === props.currentId);
});

// 是否有上一章
const hasPrevious = computed(() => {
  return currentIndex.value > 0;
});

// 是否有下一章
const hasNext = computed(() => {
  return currentIndex.value < flatChapters.value.length - 1;
});

// 处理首章
const handleFirst = () => {
  if (flatChapters.value.length === 0) return;
  const firstChapter = flatChapters.value[0];
  emit("change-ch", { type: "first", id: firstChapter.id });
};

// 处理上一章
const handlePrev = () => {
  if (!hasPrevious.value) return;
  const prevChapter = flatChapters.value[currentIndex.value - 1];
  emit("change-ch", { type: "prev", id: prevChapter.id });
};

// 处理下一章
const handleNext = () => {
  if (!hasNext.value) return;
  const nextChapter = flatChapters.value[currentIndex.value + 1];
  emit("change-ch", { type: "next", id: nextChapter.id });
};

// 处理尾章
const handleLast = () => {
  if (flatChapters.value.length === 0) return;
  const lastChapter = flatChapters.value[flatChapters.value.length - 1];
  emit("change-ch", { type: "last", id: lastChapter.id });
};
</script>
