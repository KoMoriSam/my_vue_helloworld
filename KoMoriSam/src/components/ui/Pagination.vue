<template>
  <div class="join flex items-center justify-center m-6 lg:m-12">
    <button
      class="join-item btn"
      @click="handlePageChange(currentPage - 1)"
      :disabled="currentPage === 0"
    >
      <i class="ri-arrow-left-s-line"></i>
    </button>
    <button class="join-item md:hidden btn">
      第 {{ currentPage + 1 }} 页 / 共 {{ totalPages }} 页
    </button>
    <button
      v-for="(page, idx) in totalPages"
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
      :disabled="currentPage === totalPages - 1"
    >
      <i class="ri-arrow-right-s-line"></i>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
});

const emit = defineEmits(["page-change"]);

const handlePageChange = (pageIndex) => {
  emit("page-change", pageIndex);
};
</script>
