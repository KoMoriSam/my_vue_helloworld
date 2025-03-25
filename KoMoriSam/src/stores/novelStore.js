import { defineStore } from "pinia";
import { getReadChapters, setReadChapters } from "@/utils/storageServicer";
import { useTitle } from "@vueuse/core";

export const useNovelStore = defineStore("novel", {
  state: () => ({
    // 章节数据
    chapterList: [],
    flatChapterList: [],
    readChapterList: [],
    currentChapterContent: [],
    contentCache: {},
    currentChapterId: 1,
    currentChapterPage: 1,
    title: useTitle("小说 | KoMoriSam"),
    fontStyle: "font-kai",
    // 加载状态
    isLoadingList: true,
    isLoadingContent: true,
  }),

  getters: {
    // 获取当前章节完整信息
    currentChapterInfo(state) {
      if (state.isLoadingList || state.chapterList.length === 0) {
        console.warn("章节列表仍在加载中");
        return null;
      }

      for (const group of state.chapterList) {
        if (!group?.options) continue;
        const chapter = group.options.find(
          (ch) => ch.id === state.currentChapterId
        );
        if (chapter) return { chapter, group };
      }

      console.warn("未找到匹配的章节:", state.currentChapterId);
      return null;
    },

    latestChapter(state) {
      return state.flatChapterList[state.flatChapterList.length - 1];
    },

    contentUrl() {
      if (!this.currentChapterInfo) return null;
      const { chapter, group } = this.currentChapterInfo;
      const volume = group.label.match(/(.*)/)?.[0];
      const fileName = chapter.name;
      return `/assets/markdown/novel/${volume}/${fileName}.md`;
    },

    totalPages: (state) => state.currentChapterContent.length,

    currentPageContent: (state) => {
      return state.currentChapterContent[state.currentChapterPage - 1] || "";
    },
  },

  actions: {
    // 初始化章节数据
    async setChapterList() {
      if (this.chapterList.length > 0) {
        return; // 如果数据已存在或正在加载，则不重复请求
      }
      try {
        this.isLoadingList = true;
        const res = await fetch("/assets/markdown/novel/list.json");
        const data = await res.json();
        this.chapterList = data;
        this.flatChapterList = data.flatMap((ch) => ch.options);
        const read = getReadChapters();
        if (read) this.readChapterList = read;
      } catch (error) {
        console.error("列表加载失败:", error);
        this.chapterList = [];
        this.markdownContent = "# 内容加载失败\n请检查网络连接";
      } finally {
        this.isLoadingList = false;
        // 章节列表加载完成后，触发获取当前章节内容
        if (!this.markdownContent) this.loadChapterContent();

        console.log("章节列表数据初始化完成:", this.chapterList);
        console.log("当前章节信息初始化完成:", this.currentChapterInfo);
      }
    },

    // 加载章节数据
    async loadChapterContent() {
      if (!this.contentUrl) return;

      // 检查 contentCache
      if (this.contentCache[this.currentChapterId]) {
        this.currentChapterContent = this.contentCache[this.currentChapterId];
        return;
      }

      try {
        this.isLoadingContent = true;
        const response = await fetch(this.contentUrl);
        if (!response.ok) throw new Error("加载失败");
        this.markdownContent = await response.text();
        this.currentChapterContent = this.splitContent(this.markdownContent); // 加载后自动分页

        // 缓存章节内容
        this.contentCache[this.currentChapterId] = this.currentChapterContent;

        this.setRead();
      } catch (error) {
        console.error("内容加载失败:", error);
        this.markdownContent = "# 内容加载失败\n请检查网络连接";
      } finally {
        this.isLoadingContent = false;
      }
    },

    splitContent(content) {
      const PAGE_SIZE = 1100;
      const pages = [];
      let currentPage = "";

      const paras = content.split("\n");

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
      return pages;
    },

    async setChapter(chapterId = 0) {
      console.log("设置章节:", chapterId);
      if (this.currentChapterId === chapterId) return;
      this.currentChapterId = chapterId;
      await this.loadChapterContent(); // 自动触发内容加载
    },

    setPage(chapterPage = 0) {
      console.log("设置页码:", chapterPage);
      if (chapterPage == this.currentChapterPage) return;
      this.currentChapterPage = chapterPage;
    },

    updateTitle() {
      this.title = `${this.currentChapterInfo.chapter.name} | KoMoriSam`;
      console.log("标题更新:", this.title);
    },

    setRead() {
      if (
        !this.readChapterList.some(
          (g) => g?.chapter === this.currentChapterInfo.chapter
        )
      ) {
        setReadChapters(this.currentChapterInfo);
        this.readChapterList = [
          ...this.readChapterList,
          this.currentChapterInfo,
        ];
      }
    },
  },
});
