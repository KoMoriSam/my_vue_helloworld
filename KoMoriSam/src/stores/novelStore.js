import { defineStore } from "pinia";
import { getReadChapters, setReadChapters } from "@/utils/storageServicer";

export const useNovelStore = defineStore("novel", {
  state: () => ({
    // 章节数据
    chapterList: [],
    flatChapterList: [],
    readChapterList: [],
    pageCache: [],
    currentChapterId: 1,
    currentChapterPage: 0,
    fontStyle: "font-kai",
    // 加载状态
    isLoadingList: true,
    isLoadingContent: true,
  }),

  getters: {
    // 获取当前章节完整信息
    currentChapter(state) {
      for (const group of state.chapterList) {
        const chapter = group.options.find(
          (ch) => ch.id === state.currentChapterId
        );
        if (chapter) return { chapter, group };
      }
      return null;
    },

    latestChapter(state) {
      return state.flatChapterList[state.flatChapterList.length - 1];
    },

    contentUrl() {
      if (!this.currentChapter) return null;
      const { chapter, group } = this.currentChapter;
      const volume = group.label.match(/(.*)/)?.[0];
      const fileName = chapter.name;
      return `/assets/markdown/novel/${volume}/${fileName}.md`;
    },

    totalPages: (state) => state.pageCache.length,

    currentPageContent: (state) => {
      return state.pageCache[state.currentChapterPage] || "";
    },
  },

  actions: {
    // 初始化章节数据
    async setChapterList() {
      try {
        this.isLoadingList = true;
        const res = await fetch("/assets/markdown/novel/list.json");
        const data = await res.json();
        this.chapterList = data;
        this.flatChapterList = data.flatMap((chapter) => chapter.options);
        const read = getReadChapters();
        if (read) {
          this.readChapterList = read;
        }
      } catch (error) {
        console.error("列表加载失败:", error);
        this.markdownContent = "# 内容加载失败\n请检查网络连接";
      } finally {
        this.isLoadingList = false;
      }
    },

    // 加载章节数据
    async loadChapterContent() {
      if (!this.contentUrl) return;

      try {
        this.isLoadingContent = true;
        const response = await fetch(this.contentUrl);
        if (!response.ok) throw new Error("加载失败");
        this.markdownContent = await response.text();
        this.splitContent(); // 加载后自动分页
        if (
          !this.readChapterList.some(
            (g) => g.chapter === this.currentChapter.chapter
          )
        ) {
          setReadChapters(this.currentChapter);
          this.readChapterList = [...this.readChapterList, this.currentChapter];
        }
      } catch (error) {
        console.error("内容加载失败:", error);
        this.markdownContent = "# 内容加载失败\n请检查网络连接";
      } finally {
        this.isLoadingContent = false;
      }
    },

    splitContent() {
      const PAGE_SIZE = 1100;
      const pages = [];
      let currentPage = "";

      const paras = this.markdownContent.split("\n");

      paras.forEach((para) => {
        if (currentPage.length + paras.length + 1 > PAGE_SIZE) {
          pages.push(currentPage);
          currentPage = para;
        } else {
          if (currentPage.length > 0) {
            currentPage += "\n";
          }
          currentPage += para;
        }
      });

      if (currentPage.length > 0) {
        pages.push(currentPage);
      }
      this.pageCache = pages;
    },

    async setChapter(chapterId = this.currentChapterId, chapterPage = 0) {
      if (this.currentChapterId === chapterId) return;
      this.currentChapterId = chapterId;
      this.currentChapterPage = chapterPage;
      await this.loadChapterContent(); // 自动触发内容加载
    },

    setPage(chapterPage = this.currentChapterPage) {
      if (this.currentChapterPage === chapterPage) return;
      this.currentChapterPage = chapterPage;
    },
  },
});
