<template>
  <main
    class="flex-1 flex flex-col md:flex-row mx-12 my-12 items-start md:items-center justify-center md:justify-evenly gap-5 lg:gap-10"
  >
    <img
      :src="imageSrc"
      :alt="imageAlt"
      class="h-50 lg:w-50 lg:h-auto lg:basis-3xs"
    />
    <div class="divider md:divider-horizontal lg:basis-3xs"></div>
    <article class="prose lg:prose-xl lg:basis-3xl">
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
