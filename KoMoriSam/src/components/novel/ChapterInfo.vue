<template>
  <li
    :class="[
      'btn lg:btn-lg w-full text-left justify-start font-bold',
      additionalClasses,
    ]"
    @click="onClick"
  >
    <span class="badge font-normal italic text-xs lg:text-base mr-4">
      {{ badgeText }}
    </span>
    {{ content }}
  </li>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  badgeText: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  additionalClasses: {
    type: String,
    default: "",
  },
  onClick: {
    type: Function,
    default: null,
  },
});
</script>
