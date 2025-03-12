<template>
  <button
    @click="scrollToTop"
    :style="{ bottom, right }"
    class="fixed right-6 lg:right-12 bottom-32 btn btn-square btn-lg btn-info"
    :class="showButton ? 'opacity-100' : 'opacity-0'"
  >
    <i class="ri-skip-up-line"></i>
  </button>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  threshold: { type: Number, default: 300 }, // 显示按钮的滚动阈值
});

const showButton = ref(false);

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const handleScroll = () => {
  showButton.value = window.scrollY > props.threshold;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});

defineExpose({ scrollToTop });
</script>
