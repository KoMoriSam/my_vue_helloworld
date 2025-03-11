<template>
  <main class="flex-1">
    <Loading v-show="isLoading" />

    <div
      class="flex flex-col lg:flex-row m-12 items-start lg:justify-evenly gap-5 lg:gap-10"
      v-show="!isLoading"
    >
      <div class="lg:basis-[50%]">
        <article class="prose lg:prose-xl">
          <h1>向远方</h1>
        </article>
        <ChList
          title="章节列表"
          :current-id
          :chapters
          @handle-change="handleChange"
        />
        <PreNext :current-id :chapters @handle-change="handleChange" />
      </div>
      <div class="divider lg:divider-horizontal lg:basis-3xs"></div>

      <MarkdownViewer :current-id="currentId" :chapters />
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ChList from "@/components/novel/ChList.vue";
import PreNext from "@/components/novel/PreNext.vue";
import MarkdownViewer from "@/components/MarkdownViewer.vue";
import Loading from "@/components/ui/Loading.vue";

const isLoading = ref(true);
const chapters = ref([]);
const currentId = ref(null);

onMounted(async () => {
  try {
    const res = await fetch("/assets/markdown/novel/list.json");
    const data = await res.json();
    chapters.value = data;
    currentId.value = chapters.value[0].options[0].id;
  } finally {
    isLoading.value = false;
  }
});

const handleChange = (chapter) => {
  currentId.value = chapter.id;
  chapters.value.forEach((group) => {
    const readChapter = group.options.find((ch) => ch.id === chapter.id);
    if (readChapter) chapter.read = true;
  });
};
</script>
