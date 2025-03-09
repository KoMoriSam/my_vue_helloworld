<template>
  <BasePage
    :imageSrc="meImage"
    imageAlt="Contact Me!"
    title="联系我"
    description="可以加 QQ 和 微信 捏~"
  >
    <!-- 可选：插入额外内容 -->
    <p>
      <button class="btn btn-info m-1">
        <i class="ri-qq-fill"></i> 3593516798
      </button>
      <button class="btn btn-info m-1">
        <i class="ri-wechat-fill"></i> MoriSam2023
      </button>
    </p>
  </BasePage>
</template>

<script setup>
import BasePage from "@/components/BasePage.vue";
import meImage from "@/assets/img/me3.png";
</script>
