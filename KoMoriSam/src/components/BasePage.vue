<template>
  <main
    class="flex flex-col lg:flex-row mx-12 my-12 items-start lg:items-center justify-center gap-5 lg:gap-10"
  >
    <img
      :src="imageSrc"
      :alt="imageAlt"
      class="w-auto h-50 lg:w-50 lg:h-auto"
    />
    <div class="divider lg:divider-horizontal"></div>
    <article class="prose lg:prose-xl">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
      <slot></slot>
    </article>
  </main>
</template>

<script setup>
const props = defineProps({
  imageSrc: {
    type: String,
    required: false,
  },
  imageAlt: {
    type: String,
    default: "Image",
  },
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
});
</script>
