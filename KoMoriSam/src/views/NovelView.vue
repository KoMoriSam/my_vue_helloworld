<template>
  <main class="flex-1">
    <Loading v-show="isLoading" />

    <div
      class="flex flex-col md:flex-row m-12 items-start md:justify-evenly gap-5 lg:gap-10"
      v-show="!isLoading"
    >
      <div class="lg:basis-3xs">
        <article class="prose lg:prose-xl">
          <h1>向远方</h1>
        </article>
        <ChList
          title="章节列表"
          v-model="currentId"
          :chapters
          @update-read="handleUpdateRead"
        />
        <PreNext
          :current-id="currentId"
          :chapters
          @change-ch="handleChapterChange"
        />
      </div>
      <div class="divider md:divider-horizontal lg:basis-3xs"></div>

      <MarkdownViewer :current-id="currentId" :chapters />
    </div>
  </main>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import MarkdownViewer from "@/components/MarkdownViewer.vue";
import PreNext from "@/components/novel/PreNext.vue";
import ChList from "@/components/novel/ChList.vue";
import Loading from "@/components/ui/Loading.vue";

const chapters = ref([]);
const currentId = ref(null);

// 从 localStorage 加载已读状态
const loadReadStates = () => {
  try {
    const saved = localStorage.getItem("readChapters");
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

// 保存已读状态到 localStorage
const saveReadStates = (states) => {
  localStorage.setItem("readChapters", JSON.stringify(states));
};

const isLoading = ref(true);

// 初始化章节数据和状态
const initializeChapters = async () => {
  try {
    const response = await fetch("/assets/markdown/novel/list.json");
    if (!response.ok) throw new Error("加载章节列表失败");
    const data = await response.json();

    // 合并已读状态
    const readStates = loadReadStates();
    chapters.value = data.map((group) => ({
      ...group,
      options: group.options.map((ch) => ({
        ...ch,
        read: !!readStates[ch.id], // 转换布尔值
      })),
    }));
  } catch (error) {
    console.error("加载章节列表失败:", error);
  }
};

// 初始化章节 ID
const initializeCurrentId = () => {
  const savedId = localStorage.getItem("chapterId");
  if (savedId !== null) {
    const parsedId = parseInt(savedId, 10);
    currentId.value = Number.isNaN(parsedId) ? null : parsedId;
  }
};

onMounted(async () => {
  isLoading.value = true;
  await initializeChapters();
  initializeCurrentId();
  isLoading.value = false;
});

// 监听章节 ID 变化
watch(currentId, (newId) => {
  if (newId !== null) {
    localStorage.setItem("chapterId", newId.toString());
  } else {
    localStorage.removeItem("chapterId");
  }
});

// 更新已读状态
const handleUpdateRead = (chapter) => {
  const target = chapters.value
    .flatMap((g) => g.options)
    .find((ch) => ch.id === chapter.id);

  if (target) {
    // 更新本地存储
    const readStates = loadReadStates();
    saveReadStates({
      ...readStates,
      [chapter.id]: true,
    });
    setTimeout(() => {
      // 更新内存状态
      target.read = true;
    }, 300);
  }
};

// 章节切换
const handleChapterChange = ({ id }) => {
  currentId.value = id;
  handleUpdateRead({ id });
};
</script>
