<template>
  <main class="menu rounded-box w-full">
    <ul>
      <li>
        <details class="w-full" open>
          <summary class="font-bold lg:py-4 mb-1 lg:mb-2">章节列表</summary>
          <ul class="menu rounded-box z-1 p-2 w-full ml-0">
            <li v-for="group in novelStore.chapterList" :key="group.label">
              <details open>
                <summary class="font-bold">{{ group.label }}</summary>
                <ul>
                  <li v-for="chapter in group.options" :key="chapter?.id">
                    <a
                      v-if="chapter"
                      @click="handleChange(chapter.id)"
                      :class="
                        chapter.id === novelStore.currentChapterId
                          ? 'bg-primary text-primary-content'
                          : ''
                      "
                      class="my-1"
                    >
                      <!-- 章节状态指示 -->
                      <span v-if="isRead(chapter.id)" class="badge">
                        <i class="status status-accent"></i>
                        已读
                      </span>

                      <span v-else class="badge">
                        <i class="status status-primary animate-bounce"></i>
                        未读
                      </span>

                      <!-- 章节名称 -->
                      <div
                        class="tooltip tooltip-bottom tooltip-info"
                        :data-tip="`更新时间：${formatDate(chapter.updated)} ${
                          isRecent(chapter.updated) && !isRead(chapter.id)
                            ? 'New!!!'
                            : ''
                        }`"
                      >
                        <span>{{ chapter.name }}</span>
                      </div>
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
import { useNovelStore } from "@/stores/novelStore";

const novelStore = useNovelStore();

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const isRecent = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  return diff < 14 * 24 * 60 * 60 * 1000; // 14 天内
};

const isRead = computed(() => (chapterId) => {
  return novelStore.readChapterList.some((g) => g.chapter.id === chapterId);
});

const handleChange = async (newId) => {
  await novelStore.setChapter(newId);
  window.scrollTo({ top: 200, behavior: "smooth" });
};
</script>
