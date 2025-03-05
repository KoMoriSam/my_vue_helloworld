<template>
  <main class="my-6">
    <label class="input">
      <i class="ri-search-line"></i>
      <input
        v-model="searchQuery"
        type="search"
        class="grow"
        placeholder="搜索章节"
      />
    </label>
    <fieldset class="fieldset">
      <legend class="fieldset-legend">{{ title }}</legend>
      <select class="select" v-model="selectedChapter" @change="handleChange">
        <option disabled :value="null">请选择章节</option>
        <option
          v-for="chapter in chapters"
          :key="chapter.id"
          :value="chapter.id"
        >
          {{ chapter.name }}（{{ formatDate(chapter.updated) }}）
        </option>
        <option disabled>未完待续</option>
      </select>
    </fieldset>
  </main>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  chapters: {
    type: Array,
    default: () => [],
    validator: (value) => {
      return value.every((ch) => "id" in ch && "name" in ch && "updated" in ch);
    },
  },
});

const emit = defineEmits(["select"]);

const selectedChapter = ref(null);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const handleChange = () => {
  const selected = props.chapters.find((ch) => ch.id === selectedChapter.value);
  if (selected) {
    emit("select", selected);
  }
};
</script>
