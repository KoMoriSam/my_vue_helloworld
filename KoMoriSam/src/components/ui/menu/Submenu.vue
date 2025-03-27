<template>
  <main class="menu">
    <ul>
      <li>
        <details open>
          <summary>{{ title }}</summary>
          <ul>
            <slot></slot>
          </ul>
        </details>
      </li>
    </ul>
  </main>
</template>

<script setup>
const props = defineProps({ title: String });
</script>
