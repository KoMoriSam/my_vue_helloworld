<template>
  <label
    :class="[
      'md:btn md:btn-soft md:btn-square md:btn-lg md:drawer-button md:z-1 md:fixed md:shadow-sm md:right-6 lg:right-12',
      positionClasses,
      buttonClass,
    ]"
    @click="onClick"
  >
    <i :class="icon"></i>
    <span class="dock-label md:hidden">{{ label }}</span>
  </label>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  positionClasses: {
    type: String,
    default: "",
  },
  buttonClass: {
    type: String,
    default: "md:btn-primary",
  },
  onClick: {
    type: Function,
    required: true,
  },
});
</script>
