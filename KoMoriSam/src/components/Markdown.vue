<template>
  <main class="lg:basis-[75%]">
    <Loading v-if="isLoading" />
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
    <!-- 分页控件 -->
    <div
      v-if="pages.length > 1"
      class="join flex items-center justify-center m-6 lg:m-12"
    >
      <button
        class="join-item btn"
        @click="handlePageChange(currentPage - 1)"
        :disabled="currentPage === 0"
      >
        <i class="ri-arrow-left-s-line"></i>
      </button>
      <button class="join-item md:hidden btn">
        第 {{ currentPage + 1 }} 页 / 共 {{ pages.length }} 页
      </button>
      <button
        v-for="(page, idx) in pages.length"
        :key="idx"
        @click="handlePageChange(idx)"
        :class="idx === currentPage ? 'btn-primary' : ''"
        class="hidden md:flex join-item btn"
      >
        {{ page }}
      </button>
      <button
        class="join-item btn"
        @click="handlePageChange(currentPage + 1)"
        :disabled="currentPage === pages.length - 1"
      >
        <i class="ri-arrow-right-s-line"></i>
      </button>
    </div>
    <slot></slot>
  </main>
</template>

<script setup>
import { ref, watch, computed, inject } from "vue";
import VueMarkdown from "vue-markdown-render";
import Loading from "@/components/ui/Loading.vue";

const props = defineProps({
  currentId: { type: [Number, String, null], required: true },
  chapters: { type: Array, required: true },
});

const isLoading = ref(false);
const error = ref(null);
const fontStyle = ref("font-kai");
const options = {
  html: true,
};

const currentPage = ref(0); // 当前页码
const pages = ref([]); // 分页后的内容数组
const pageSize = 1000; // 每页字符数

// 分页处理函数
const splitContent = (content) => {
  const result = [];
  const paragraphs = content.split("\n"); // 假设段落是通过换行符分隔的
  let currentPageContent = "";

  paragraphs.forEach((paragraph) => {
    // 如果当前页面内容 + 该段落长度超过了最大字符数
    if (currentPageContent.length + paragraph.length + 1 > pageSize) {
      // 如果是新的一页，先保存当前页面内容
      result.push(currentPageContent);
      currentPageContent = paragraph; // 把当前段落放到新的一页
    } else {
      // 否则，将段落加入当前页面内容
      if (currentPageContent.length > 0) {
        currentPageContent += "\n"; // 添加换行符
      }
      currentPageContent += paragraph;
    }
  });

  // 最后一页内容添加进去
  if (currentPageContent.length > 0) {
    result.push(currentPageContent);
  }

  return result;
};

const handlePageChange = (page) => {
  currentPage.value = page;
  handleToTop();
};

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

const loadContent = async () => {
  if (!contentUrl.value) return;

  try {
    isLoading.value = true;
    const response = await fetch(contentUrl.value);
    if (!response.ok) throw new Error("加载失败");
    const content = await response.text();

    // 处理分页
    pages.value = splitContent(content);
    currentPage.value = 0; // 重置到第一页
    error.value = null;
  } catch (e) {
    error.value = e.message;
    pages.value = [];
  } finally {
    isLoading.value = false;
  }
};

watch(contentUrl, loadContent, { immediate: true });

const scrollToTop = inject("scrollToTop"); // 注入方法

// 调用示例
const handleToTop = () => {
  scrollToTop(); // 平滑滚动到顶部
};
</script>
