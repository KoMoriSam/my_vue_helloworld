<template>
  <main class="menu bg-base-100 rounded-box w-72 md:w-96 lg:w-108">
    <ul>
      <li>
        <a
          v-if="currentChapter"
          class="font-bold bg-info text-info-content my-1"
          ><span class="badge font-normal italic text-xs">当前章节</span
          >{{ currentChapter.name }}</a
        >
        <a
          v-if="latestChapter"
          @click="handleChange(latestChapter)"
          class="font-bold bg-success text-success-content my-1"
          ><span class="badge font-normal italic text-xs">最新章节</span
          >{{ latestChapter.name }}</a
        >

        <details class="dropdown w-72 md:w-96 lg:w-108" open>
          <summary class="font-bold">{{ title }}</summary>
          <ul
            class="menu dropdown-content bg-base-100 rounded-box z-1 p-2 w-72 md:w-96 lg:w-108 shadow-sm"
          >
            <li v-for="group in chapters" :key="group.label">
              <details false>
                <summary class="font-bold">{{ group.label }}</summary>
                <ul>
                  <li v-for="chapter in group.options" :key="chapter.id">
                    <a
                      @click="handleChange(chapter)"
                      :class="
                        chapter.id == currentId
                          ? 'bg-primary text-primary-content'
                          : ''
                      "
                      class="my-1"
                    >
                      <!-- 章节状态指示 -->
                      <i
                        :class="
                          chapter.read
                            ? 'status status-success'
                            : 'status status-info animate-bounce'
                        "
                      ></i>

                      <!-- 章节名称 -->
                      <span>{{ chapter.name }}</span>

                      <!-- 更新时间 -->
                      <span class="badge italic text-xs"
                        ><span class="hidden lg:inline">更新时间</span
                        >{{ formatDate(chapter.updated) }}</span
                      >

                      <span
                        :class="
                          isRecent(chapter.updated) && !chapter.read
                            ? 'badge badge-info text-xs'
                            : ''
                        "
                        >{{
                          isRecent(chapter.updated) && !chapter.read
                            ? "New"
                            : ""
                        }}</span
                      >
                    </a>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </details>
      </li>
    </ul>
  </main>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  currentId: { type: [Number, String, null], required: true },
  chapters: { type: Array, required: true },
  title: { type: String, default: "章节列表" },
});

// 扁平化章节列表
const flatChapters = computed(() => props.chapters.flatMap((g) => g.options));

// 当前章节名称
const currentChapter = computed(() => {
  return flatChapters.value.find((ch) => ch.id == props.currentId);
});

// 获取最新章节
const latestChapter = computed(() => {
  return [...flatChapters.value].sort((a, b) => b.id - a.id)[0];
});

const emit = defineEmits(["handle-change"]);

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    // hour: "2-digit",
    // minute: "2-digit",
  });
};

const isRecent = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  return diff < 14 * 24 * 60 * 60 * 1000; // 14 天内
};

const handleChange = (chapter) => {
  emit("handle-change", chapter);
};
</script>
