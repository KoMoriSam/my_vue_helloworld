<template>
  <main class="my-6">
    <fieldset class="fieldset">
      <legend class="fieldset-legend">{{ title }}</legend>
      <div class="join">
        <select
          class="select select-sm join-item"
          v-model="selectedId"
          @change="handleChange"
        >
          <option disabled :value="null">请选择章节</option>
          <template v-for="group in chapters" :key="group.label">
            <optgroup :label="group.label">
              <option
                v-for="(chapter, idx) in group.options"
                :key="idx"
                :value="chapter.id"
              >
                <!-- 章节状态指示 -->
                {{ chapter.read ? "✔️" : "💠" }}

                <!-- 最近更新标记 -->
                {{ isRecent(chapter.updated) && !chapter.read ? "🆕" : "" }}

                <!-- 章节名称 -->
                {{ chapter.name }}

                <!-- 更新时间 -->
                {{ formatDate(chapter.updated) }}
              </option>
            </optgroup>
          </template>
          <option disabled>未完待续</option>
        </select>
        <button class="btn btn-sm join-item">刷新</button>
      </div>
    </fieldset>
  </main>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";

const props = defineProps({
  title: String,
  modelValue: [String, Number], // 接收父组件管理的ID
  chapters: {
    type: Array,
    default: () => [],
    validator: (groups) =>
      groups.every(
        (g) =>
          "label" in g &&
          "options" in g &&
          g.options.every(
            (ch) =>
              "id" in ch && "name" in ch && "updated" in ch && "read" in ch
          )
      ),
  },
});

const emit = defineEmits(["update:modelValue", "update-read"]);

const selectedId = ref(props.modelValue);

// 同步父组件传入的modelValue变化
watch(
  () => props.modelValue,
  (newVal) => {
    selectedId.value = newVal;
  }
);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const isRecent = (dateString) => {
  const date = new Date(dateString);
  return Date.now() - date < 30 * 24 * 60 * 60 * 1000;
};

const handleChange = () => {
  // 通知父组件更新选中ID
  emit("update:modelValue", selectedId.value);

  // 查找对应章节并通知更新阅读状态
  let foundChapter;
  for (const group of props.chapters) {
    foundChapter = group.options.find((ch) => ch.id === selectedId.value);
    if (foundChapter) break;
  }
  if (foundChapter) {
    emit("update-read", foundChapter);
  }
};
</script>
