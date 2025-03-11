<template>
  <main class="menu bg-base-100 rounded-box w-full">
    <ul>
      <li>
        <details false>
          <summary class="font-bold">{{ title }}</summary>

          <ul>
            <li v-for="group in chapters" :key="group.label">
              <details false>
                <summary class="font-bold">{{ group.label }}</summary>
                <ul>
                  <li v-for="chapter in group.options" :key="chapter.id">
                    <a
                      @click="handleChange(chapter)"
                      :class="chapter.id == currentId ? 'bg-primary' : ''"
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
                      <span class="badge"
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
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  currentId: { type: [Number, String], required: true },
  chapters: { type: Array, required: true },
  title: { type: String, default: "章节列表" },
});

const emit = defineEmits(["handle-change"]);

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
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
