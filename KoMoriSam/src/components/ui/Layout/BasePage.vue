<template>
  <main
    class="flex-1 flex flex-col md:flex-row mx-12 my-12 items-start md:items-center justify-center md:justify-evenly gap-12"
  >
    <img
      :src="imageSrc"
      :alt="imageAlt"
      class="h-52 lg:w-52 lg:h-auto lg:basis-3xs rounded-lg"
    />
    <div class="divider md:divider-horizontal m-0 p-0"></div>
    <article class="prose lg:prose-xl lg:basis-3xl">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
      <slot></slot>
    </article>
  </main>
  <FootBar />
  <ToTop />
</template>

<script setup>
import FootBar from "@/components/ui/layout/FootBar.vue";
import ToTop from "@/components/ui/ToTop.vue";

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
