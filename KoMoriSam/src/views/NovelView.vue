<template>
  <main class="flex-1">
    <Loading v-if="isLoading" />

    <div
      class="flex flex-col lg:flex-row m-8 lg:m-12 items-center lg:items-start lg:justify-evenly gap-10"
      v-else
    >
      <div class="lg:basis-[25%] flex flex-col items-center justify-center">
        <ChList
          title="章节列表"
          :current-id="currentId"
          :chapters
          @handle-change="handleChange"
        />
        <PreNext
          :current-id="currentId"
          :chapters
          @handle-change="handleChange"
        />
      </div>
      <div class="divider lg:divider-horizontal m-0"></div>

      <Markdown :current-id="currentId" :chapters>
        <PreNext
          :current-id="currentId"
          :chapters
          @handle-change="handleChange"
        />
      </Markdown>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ChList from "@/components/novel/ChList.vue";
import PreNext from "@/components/novel/PreNext.vue";
import Markdown from "@/components/Markdown.vue";
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
  } catch (error) {
    console.error("Error fetching data:", error);
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
