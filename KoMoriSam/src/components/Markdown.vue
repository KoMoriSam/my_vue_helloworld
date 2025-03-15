<template>
  <main class="flex-2">
    <Loading v-if="modelValue" />
    <div v-else>
      <vue-markdown
        v-if="pages.length > 0"
        :source="pages[currentPage]"
        :options="options"
        class="prose prose-2xl max-w-none prose-h1:text-3xl prose-h2:text-2xl prose-p:text-justify prose-p:indent-12.5 quotes-none prose-blockquote:prose-p:not-italic prose-blockquote:prose-p:indent-0 prose-blockquote:ps-4 lg:prose-blockquote:ps-8 prose-blockquote:prose-p:text-left"
        :class="fontStyle"
      />
      <h1 v-else-if="!error">请选择章节</h1>
      <h1 v-else class="text-red-500">加载失败，请稍后重试。</h1>
    </div>
    <Pagination
      v-if="pages.length > 1 && !modelValue"
      :current-page="currentPage"
      :total-pages="pages.length"
      @page-change="handlePageChange"
    />
  </main>
</template>

<script setup>
import { ref, watch, computed, inject } from "vue";
import { useRouter } from "vue-router";
import VueMarkdown from "vue-markdown-render";
import Loading from "@/components/ui/Loading.vue";
import Pagination from "@/components/ui/Pagination.vue";

// 路由相关
const router = useRouter();

// Props 定义
const props = defineProps({
  currentId: { type: [Number, String, null], required: true },
  chapters: { type: Array, required: true },
  currentPage: { type: [Number, String], default: 0 },
  modelValue: { type: Boolean, required: true },
});

const emit = defineEmits(["update:modelValue"]);

// 状态管理
const error = ref(null);
const fontStyle = ref("font-kai");
const chapterCache = ref({});
const pages = ref([]); // 分页后的内容数组
const currentPage = ref(props.currentPage || 0);
const pageSize = 1000; // 每页字符数

// Markdown 渲染选项
const options = {
  html: true,
  typographer: true,
};

// 计算属性
const currentChapter = computed(() => {
  for (const group of props.chapters) {
    const chapter = group.options.find((ch) => ch.id === props.currentId);
    if (chapter) {
      return { chapter, group };
    }
  }
  return null;
});

const contentUrl = computed(() => {
  if (!currentChapter.value) return null;
  const { chapter, group } = currentChapter.value;
  const volume = group.label.match(/(.*)/)?.[0];
  const fileName = chapter.name;
  return `/assets/markdown/novel/${volume}/${fileName}.md`;
});

// 方法定义
const splitContent = (content) => {
  const result = [];
  const paragraphs = content.split("\n"); // 假设段落是通过换行符分隔的
  let currentPageContent = "";

  paragraphs.forEach((paragraph) => {
    if (currentPageContent.length + paragraph.length + 1 > pageSize) {
      result.push(currentPageContent);
      currentPageContent = paragraph;
    } else {
      if (currentPageContent.length > 0) {
        currentPageContent += "\n";
      }
      currentPageContent += paragraph;
    }
  });

  if (currentPageContent.length > 0) {
    result.push(currentPageContent);
  }

  return result;
};

const handlePageChange = (pageIndex) => {
  router.push({
    name: "novel",
    params: {
      chapterId: props.currentId,
      page: pageIndex + 1, // 转换回路由页码格式
    },
  });
  handleToTop();
};

const loadContent = async () => {
  if (!contentUrl.value) return;

  // 检查缓存
  if (chapterCache.value[props.currentId]) {
    pages.value = chapterCache.value[props.currentId];
    return;
  }

  try {
    emit("update:modelValue", true);
    const response = await fetch(contentUrl.value);
    if (!response.ok) throw new Error("加载失败");
    const content = await response.text();
    const splitPages = splitContent(content);

    // 缓存章节内容
    chapterCache.value[props.currentId] = splitPages;
    pages.value = splitPages;
    // 优先使用路由参数
    currentPage.value = router.currentRoute.value.params.page - 1;
    error.value = null;
  } catch (e) {
    error.value = e.message;
    pages.value = [];
  } finally {
    emit("update:modelValue", false);
  }
};

const scrollToTop = inject("scrollToTop"); // 注入方法

const handleToTop = () => {
  scrollToTop(); // 平滑滚动到顶部
};

// 监听器
watch(contentUrl, loadContent, { immediate: true });

watch(
  () => router.currentRoute.value.params.page,
  (newPage) => {
    currentPage.value = Number(newPage) - 1;
  },
  { immediate: true }
);
</script>
