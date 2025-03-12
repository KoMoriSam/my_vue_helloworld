<template>
  <main class="menu bg-base-100 rounded-box">
    <ul>
      <li>
        <a
          v-if="currentChapter"
          class="font-bold bg-base-200 lg:py-4 my-1 lg:my-2"
          ><span class="badge font-normal italic text-xs">当前章节</span
          >{{ currentChapter.name }}</a
        >
        <a
          v-if="latestChapter"
          @click="handleChange(latestChapter)"
          class="font-bold bg-info text-info-content lg:py-4 my-1 lg:my-2"
          ><span class="badge font-normal italic text-xs">最新章节</span
          >{{ latestChapter.name }}</a
        >

        <details class="dropdown dropdown-center w-full md:w-72 lg:w-96" false>
          <summary class="bg-base-200 font-bold lg:py-4 my-1 lg:my-2">
            {{ title }}
          </summary>
          <ul
            class="menu dropdown-content bg-base-200 rounded-box z-1 p-2 w-full md:w-72 lg:w-96 shadow-sm"
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
                            ? 'status status-accent'
                            : 'status status-primary animate-bounce'
                        "
                      ></i>

                      <!-- 章节名称 -->
                      <div
                        class="tooltip tooltip-bottom tooltip-info"
                        :data-tip="`更新时间：${formatDate(chapter.updated)} ${
                          isRecent(chapter.updated) && !chapter.read
                            ? 'New!!!'
                            : ''
                        }`"
                      >
                        <span>{{ chapter.name }}</span>
                      </div>

                      <!-- 更新时间 -->
                      <span
                        class="hidden lg:flex"
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
                      <span class="hidden xl:flex badge italic text-xs">
                        更新时间
                        {{ formatDate(chapter.updated) }}
                      </span>
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
    month: "numeric",
    day: "numeric",
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
