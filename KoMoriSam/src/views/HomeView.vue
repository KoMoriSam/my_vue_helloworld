<template>
  <BasePage
    :imageSrc="meImage"
    imageAlt="Hello Me!"
    title="你好！"
    description="这是 KoMoriSam 的个人网站"
  >
    <p>在这里会分享一些正在做的小玩意</p>
  </BasePage>
</template>

<script setup>
import BasePage from "@/components/BasePage.vue";
import meImage from "@/assets/img/me1.png";
</script>
