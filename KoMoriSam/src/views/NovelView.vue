<template>
  <main
    class="flex flex-col lg:flex-row mx-12 my-12 items-start lg:items-center justify-center gap-5 lg:gap-10"
  >
    <div>
      <article class="prose lg:prose-xl">
        <h1>向远方</h1>
        <blockquote>方远洛</blockquote>
      </article>
      <ChSelector
        title="章节列表"
        :chapters="chList"
        @select="handleChapterSelect"
      />
      <PreNext />
    </div>
    <div class="divider lg:divider-horizontal"></div>
    <article class="prose lg:prose-xl">
      <h1>你好！</h1>
      <p>
        这里是 KoMoriSam 的网站
        <br />在这里我会分享一些正在做的项目 <br />另外还有我写的一点小东西捏
      </p>
    </article>
  </main>
</template>

<script setup>
import { ref } from "vue";
import PreNext from "@/components/ui/novel/PreNext.vue";
import ChSelector from "@/components/ui/novel/ChSelector.vue";
// import BasePage from "@/components/BasePage.vue";
// import meImage from "@/assets/img/me1.png";

const chList = ref([
  { id: 0, name: "000 序", updated: "2023-12-07 16:25" },
  { id: 1, name: "壹 · 远方不远。" },
  { id: 2, name: "001 大院的孩子", updated: "2025-01-23 23:56" },
  { id: 3, name: "002 潋城的方家", updated: "2025-01-26 23:10" },
  { id: 4, name: "贰 · “繁星即为远方”" },
  { id: 5, name: "结 002 无忧无虑", updated: "2025-02-05 16:12" },
  { id: 6, name: "番外 001 方远洛的小说", updated: "2025-01-30 00:23" },
  { id: 7, name: "叁 · 向远方的远方！" },
  { id: 8, name: "结 003 一切都好", updated: "2025-02-01 01:37" },
  { id: 9, name: "肆 · 林海淹没的远方……" },
  { id: 10, name: "伍 · 那里是远方？" },
  { id: 11, name: "001 高考后的日子", updated: "2025-02-06 01:56" },
  { id: 12, name: "陆 · 此处为远方。" },
]);
</script>
