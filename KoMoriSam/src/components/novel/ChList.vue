<template>
  <main class="menu rounded-box w-full">
    <ul>
      <li>
        <details class="w-full" open>
          <summary class="font-bold lg:py-4 mb-1 lg:mb-2">
            <span class="badge font-normal italic text-xs">章节列表</span>向远方
          </summary>
          <ul class="menu rounded-box z-1 p-2 w-full ml-0">
            <li v-for="group in chapters" :key="group.label">
              <details open>
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
                      <!-- <span
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
                      </span> -->
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
